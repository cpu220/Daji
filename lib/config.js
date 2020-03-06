const path = require('path')
const process = require('child_process');
const getFile = require('getfiles');
const cFile = require('cfiles');
const utils = require('../common/utils');
const _fileList = require('../data/_fileList.json');
const question = require('../common/_gitQuestion');
const appListManage = require('../common/appListManage');
const _gitConfig = require('../data/git/config.json');


const log = utils.msg;

const _defaultConfigFileName = 'gitConfig.json'
const _getFile = new getFile();
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
    const { install, backup } = options;
    if (install) {
      console.log('导入备份')
      this.doImportBack();
    } else if (backup) {
      this.doBackUp()
    }
  }

  // 备份
  async doBackUp() {
    const _cFile = new cFile();
    const fileList = await this.getList({
      root: '../data',
      absolute: true,
    });

    const fileListLength = fileList.length
    for (let i = 0; i < fileListLength; i += 1) {
      const _json = path.parse(fileList[i]);
      if (_json.name.indexOf('_') < 0) {
        const _url = path.format({
          root: './',
          dir: `backup/${_json.dir.split('/').pop()}`,
          base: _json.base
        })
        utils.file.readFile({ path: fileList[i] }).then((data) => {
          _cFile.create(path.resolve(_url), data)
        })
      }
    }
  }

  // 导入备份数据
  async doImportBack() {
    const fileList = await this.getList({ root: './' });
    for (let i = 0; i < fileList.length; i += 1) {
      const _json = path.parse(fileList[i]); 
      const root = path.resolve(__dirname, ) 
      utils.file.readFile({ path: fileList[i]}).then((data)=>{ 
        utils.file.reset(`../data/${_json.dir.split('/').pop()}/${_json.base}`,data)
      })
    }
  }

  getList(param) {
    const { root, absolute } = param;
    let _root = root;
    if (absolute) {
      _root = path.resolve(__dirname, root)
    }


    return new Promise((resolve) => {
      _getFile.getResult({
        root: _root,
        suffix: ['json'],
        callback: function (arr) {
          resolve(arr)
        }
      });
    })
  }



}

module.exports = (cmd, options) => {

  const app = new App({ cmd, options });
  app.init();

}