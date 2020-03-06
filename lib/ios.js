#!/usr/bin/env node

const process = require('child_process');
const color = require('colors-cli/toxic');
const iosTools = require('../common/iosTools');
const question = require('../common/_IOSQuestion');
const appListManage = require('../common/appListManage');
const utils = require('../common/utils');
const log = utils.msg;


class App {
  constructor(props) {
    // super(props)
    const {
      cmd,
      options
    } = props;
    this.state = {
      cmd,
      options
    };;
  }

  init() {
    const { options, cmd } = this.state;
    const { start, install, yanxuan, url, translate, add, info, remove, update, config } = options;
    
    if (!!start) {
      this.onStart(start)
    } else if (install) {
      this.onInstall();
    } else if (yanxuan) {
      this.onYanXuan()
    } else if (url) {
      this.onUrl({ cmd,url});
    } else if (translate) {
      this.onTranslate({ cmd, url: translate })
    } else if (add) {
      this.onAddApp();
    } else if (info) {
      this.onInfo(info);
    } else if (remove) {
      this.onRemove(remove)
    } else if (update) {
      this.onUpdate(update);
    } else if (config) {
      this.onConfig()
    }else {
      console.log('试试 -h?')
    }


  }

  onStart(param) {
    /**
     * 1. 没参数，则直接打开list
     * 2. none 则跳过list，直接打开模拟器，什么都不做
     * 3. type 则寻找对应id打开
     */
    if (param === true) {

      question.chooseApp((answers) => {

        if (answers === false) {
          iosTools.openIphone();
        } else {
          const appInfo = iosTools.getAppInfo(answers.app, 'cname');
          iosTools.openIphone(() => {
            process.exec(`xcrun simctl launch booted ${appInfo.boundId}`);
          });
        }

      })

    } else {
      if (param === 'none') {
        // 不选择app，仅打开模拟器
        iosTools.openIphone();
      } else {
        const appInfo = iosTools.getAppInfo(param, 'name');
        if (!!appInfo.boundId) {
          iosTools.openIphone(() => {
            process.exec(`xcrun simctl launch booted ${appInfo.boundId}`);
          });
        } else {
          console.log(`未找到${param},请确认已经安装对应app或已更新app清单库文件`)
        }
      }
    }
  }

  onInstall(param) {
    // 安装 
    question.chooseApp((answers) => {
      const appInfo = iosTools.getAppInfo(answers.app, 'cname');
      iosTools.installPackage(appInfo);
    });
  }

  onYanXuan(param) {
    // 启动客户端 
    iosTools.openIphone(() => {
      process.exec(`xcrun simctl launch booted `);
    });
  }

  onUrl(param) {
    
    const { url, cmd } = param;
    let _url = url;
    if (!/^http(s){0,1}:\/\//.test(url)) {
      log.warn('检测到url 没有带http|https ,请确认是否为遗漏');
    }
    let type = 'list';
    if (!!cmd) {
      type = cmd.toLocaleLowerCase();
    }

    if (type === 'list') {
      question.chooseApp((answers) => {
        const appInfo = iosTools.getAppInfo(answers.app, 'cname');
        _url = iosTools.translateURL(url, appInfo);
        iosTools.openUrl(_url);
      });
    } else if (type === 'safari') {
      // url不处理
      iosTools.openUrl(url);
    } else {
      const appInfo = iosTools.getAppInfo(type, 'name');
      if (!!appInfo.name) {
        _url = iosTools.translateURL(url, appInfo);
      } else {
        _url = iosTools.translateURL(url, type);
      }
      iosTools.openUrl(_url);
    }
  }

  onTranslate(param) {
    // 翻译
    const { cmd, url } = param;

    let type = '';
    if (!!cmd) {
      type = cmd.toLocaleLowerCase();
    }
    const appInfo = iosTools.getAppInfo(type, 'name');
    console.log(iosTools.translateURL(url, appInfo));
  }

  onAddApp() {
    question.inputAppInfo().then((info) => {
      appListManage.addApp(info).then().catch(err => {
        console.log(err);
      });
    }).catch(err => console.log(err));
  }

  onInfo(param) {
    const type = param;
    if (type === true) {

      appListManage.getList().then(file => {
        console.log(file);
      })
    } else {
      const appInfo = iosTools.getAppInfo(type, 'name');
      if (!!appInfo.name) {
        console.log(appInfo);
      } else {
        console.log(`未找到 ${type}`)
      }
    }
  }

  onRemove(param) {
    iosTools.judgeTypeAndChooseList(param).then((info) => {

      appListManage.removeApp(info).then().catch(err => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(`删除失败`)
    });
  }

  onUpdate(param) {
    const _this = this;
    iosTools.judgeTypeAndChooseList(param).then((info) => {
      question.updateApp(info).then((info) => {
        appListManage.updateApp(info)
      });
    }).catch((err) => {
      // console.log(`更新失败`)
      question.confirm(`目标不存在，是否改为新增`).then((answers) => {
        _this.onAddApp();
      })
    });
  }

  onConfig(){
    question.getConfig().then((answers) => { 
      if (answers.type === 'export') {
        appListManage.exportsConfig(answers);
      } else if (answers.type === 'import') {
        appListManage.importConfig(answers);
      } else if (answers.type === 'userDefined') {
        appListManage.userDefined(answers);
      } else if (answers.type === 'reset') {
        appListManage.resetConfig(answers);
      } else if (answers.type === 'thisRoot') {
        appListManage.useThisDirFile(answers);
      }
    });
  }

}


module.exports = (cmd, options) => {
  
  const app = new App({
    cmd,
    options
  });
  app.init();
};



 