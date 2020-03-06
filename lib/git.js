const path = require('path')
const process = require('child_process');

const utils = require('../common/utils');
const _fileList = require('../data/_fileList.json');
const question = require('../common/_gitQuestion');
const appListManage = require('../common/appListManage');
const _gitConfig = require('../data/git/config.json');


const log = utils.msg;

const _defaultConfigFileName = 'gitConfig.json'

// 选择设置、删除、清空

class App {
  constructor(props) {
    const { cmd, options } = props;
    this.state = {
      cmd, options
    }

  }

  init() {
    const { options, cmd } = this.state;
    const { info, switchGit, reset, config } = options;

    if (info) {
       
      this.onInfo(info);
    } else if (switchGit) {
      this.onSwitchGitCofig();
    } else if (config) {
      this.onConfig()
    } else {
      log.info('试试 -h?')
    }
  }


  // 查看信息
  async onInfo(info) { 
    if(info === 'all'){
      log.info(JSON.stringify(_gitConfig,'',2))
    }else {
      this.execGet('name');
      this.execGet('email');
    }
    
  }


  // 设置host为制定文本
  async resetConfig(param) {
    const { name, email } = param;
    this.execSet('name', name);
    this.execSet('email', email);

  }

  // 选择git账号
  async onSwitchGitCofig() {
    const answer = await question.chooseGitAccount();
    this.resetConfig(answer.gitConfig);
  }



  // 配置项操作
  async onConfig() {
    const answer = await question.getConfig()
    const { type } = answer;
    if (type === 'import') {
      appListManage.useThisDirFile(answer, _fileList.gitConfig);
    } else if (type === 'export') {
      const url = `${path.resolve('./')}/${_defaultConfigFileName}`

      await appListManage.exportsConfig({ url }, _fileList.gitConfig);
    } else if (type === 'update') {
      const answer = await question.updateGitConfig(_gitConfig);
      const { gitKey, name, email} = answer
      _gitConfig[gitKey].name = name;
      _gitConfig[gitKey].email = email;

      utils.file.reset(_fileList.gitConfig, JSON.stringify(_gitConfig,'',2) )
       
    }
  }

  execSet(type, value) {
    process.exec(`git config --global user.${type} ${value}`, (error, stdouts, stderr) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(`${type}:${value} is set success`);
      }
    });
  }

  execGet(type) {
    process.exec(`git config user.${type}`, (error, stdouts, stderr) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(stdouts);
      }
    });
  }



}












module.exports = (cmd, options) => {
  
  const app = new App({ cmd, options });
  app.init();

}