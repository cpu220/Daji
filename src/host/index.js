const path = require('path')
// const process = require('process')

const utils = require('../../utils/lib/common/utils');
const _fileList = require('../../data/_fileList.json');
const _HostQuestion = require('./question');
const _appListManage = require('./appListManage');
const _hostConfig = require('../../data/host/config.json');

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
    this.question = _HostQuestion; // question.js导出的是实例，不需要再次new
    this.appListManage = new _appListManage();
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
    try {
      console.log('开始选择host配置...');
      const answer = await this.question.chooseHost();
      
      // 详细打印选择结果进行调试
      console.log('选择结果:', JSON.stringify(answer, null, 2));
      
      // 确保answer和hostList存在
      if (!answer || !answer.hostList) {
        log.error('没有获取到选择结果');
        return;
      }
      
      // 检查hostList是否为空
      if (answer.hostList.length === 0) {
        log.warn('您没有选择任何host配置，请至少选择一个');
        return;
      }
      
      log.info(`已选择host配置: ${answer.hostList.join(', ')}`);
      const str = await this.formatHost(answer.hostList);
      console.log('格式化后的host内容:\n', str);
      this.setHost(str);
    } catch (error) {
      log.error(`选择host时出错: ${error.message}`);
      console.error(error.stack);
    }
  }

  /**
   *  获取并格式化host内容
   * @param {*} list 
   */
  async formatHost(list) {
    // 检查是否选择了任何host配置
    if (!list || list.length === 0) {
      log.warn('请至少选择一个host配置');
      return '### 请至少选择一个host配置';
    }

    let text = '### 妲己很高兴为您服务\n\n';
    for (let i = 0; i < list.length; i += 1) {
      const key = list[i];
      // 确保选择的key在配置中存在
      if (_hostConfig[key]) {
        const title = `### ${key}\n`;
        text += `${title}${_hostConfig[key]} \n`;
      } else {
        log.warn(`警告：配置中找不到 ${key}`);
      }
    } 
    
    // 使用正确的路径写入selected.json
    const selectedFilePath = path.resolve(__dirname, '../../data/host/selected.json');
    await utils.file.reset(selectedFilePath, JSON.stringify(list));
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
    const answer = await this.question.getConfig()
    const { type, fileName } = answer;
    if (type === 'import') {
      // 当前目录文件进行导入 
      // const url = `./${answer.fileName}`;
      this.appListManage.useThisDirFile(answer, _fileList.hostConfig);
    } else if (type === 'export') {
      // 导出到当前目录下

      // 导出配置文件
      const url = `${path.resolve('./')}/${_defaultConfigFileName}`;
      const data = await this.appListManage.exportsConfig({ url }, _fileList.hostConfig);

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