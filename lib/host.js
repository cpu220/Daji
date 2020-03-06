const path = require('path')
// const process = require('process')

const utils = require('../common/utils');
const _fileList = require('../data/_fileList.json');
const question = require('../common/_HostQuestion');
const appListManage = require('../common/appListManage');
const _hostConfig = require('../data/host/config.json');

const hostRoot = _fileList.host;
const log = utils.msg;
const _defaultConfigFileName = 'hostConfig.json'

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
    const { info, switchHost, reset, config } = options;

    if (info) {
      this.onInfo(info);
    } else if (switchHost) {
      this.onSwitchHost();
    } else if (reset) {
      this.onReset();
    } else if (config) {
      this.onConfig()
    } else {
      console.log('试试 -h?')
    }
  }

  // 查看信息
  async onInfo(info) {
    
    if(!!info && info === 'all'){
      for (const i  in _hostConfig){
        log.tip(`### ${i}`)
        log.info(_hostConfig[i])
        console.log('=============')
      }
    }else{
      const file = await utils.file.read(hostRoot);
      log.info(file); 
    } 
  }


  // 设置host为制定文本
  async setHost(str) {
    const _this = this;
    try {
      log.info('=== 开始修改 ===')
      await utils.file.reset(hostRoot, str)
      await _this.onInfo();
      log.success('=== 修改成功 ===')
    } catch (error) {
      log.error('=== 修改失败 ===')
    }

  }

  // 选择host
  async onSwitchHost() {
    const answer = await question.chooseHost();
    const str = await this.formatHost(answer.hostList);
    // console.log(str);
    this.setHost(str);
  }

  /**
   *  获取并格式化host内容
   * @param {*} list 
   */
  async formatHost(list) {
    // const text =[];

    let text = '### 妲己很高兴为您服务\n\n\n';
    for (let i = 0; i < list.length; i += 1) {
      // text.push(_hostConfig[list[i]]);
      const key = list[i];
      const title = `### ${key}\n`
      text += `${title}${_hostConfig[key]} \n`
    } 
    
    utils.file.reset(_fileList.hostSelectDateBase, JSON.stringify(list))
    return text;
  }


  onReset() {
    const _this = this
    utils.file.reset(hostRoot, '## 妲己为您清空 Host').then(() => {
      _this.onInfo();
    });

    utils.file.reset(_fileList.hostSelectDateBase, '[]').then(() => {
       
    });
  }

  // 配置项操作
  async onConfig() {
    const answer = await question.getConfig()
    const { type, fileName } = answer;
    if (type === 'import') {
      // 当前目录文件进行导入 
      // const url = `./${answer.fileName}`;
      appListManage.useThisDirFile(answer, _fileList.hostConfig);
    } else if (type === 'export') {
      // 导出到当前目录下

      // 导出配置文件
      const url = `${path.resolve('./')}/${_defaultConfigFileName}`;
      const data = await appListManage.exportsConfig({ url }, _fileList.hostConfig);

      // 根据配置文件导出host文件
      const _json = JSON.parse(data)

      const arr = [];
      for (const i in _json) {
        arr.push(utils.file.reset(`${path.resolve('./')}/${i}.txt`, _json[i]));
      }
      await Promise.all(arr);

    } else if (type === 'createConfig') {
      const url = `${path.resolve('./')}/${_defaultConfigFileName}`;
      // 获取所有txt文件清单
      const file = await utils.file.getFile('./', ['txt']);

      const arr = [];
      for (let i = 0; i < file.length; i += 1) {
        arr.push(utils.file.readFile({ path: `./${file[i]}` }))

      }

      // 获取所有txt文件内容
      const result = await Promise.all(arr);
      const configJson = {};
      for (let i = 0; i < file.length; i += 1) {
        configJson[path.parse(file[i]).name] = result[i]
      }
      // 生成配置文件
      utils.file.reset(url, JSON.stringify(configJson, '', 4));


    }
  }





}












module.exports = (cmd, options) => {
  const app = new App({ cmd, options });
  app.init();

}