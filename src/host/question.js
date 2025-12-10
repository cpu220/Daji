// host


const utils = require('./utils');

const inquirer = require('inquirer');
const _hostConfig = require('../data/host/config.json');
const selectedList = require('../data/host/selected.json');
// const listJSONRoot = _config.panJSON;


class question {
  constructor() {
    this.state = {

    }


  }
  async chooseHost(callback) {


    const hostList = [];

    for (const i in _hostConfig) {
      hostList.push(i);
    }

    // const list = [{
    //   type: 'list',
    //   name: 'hosts',
    //   message: '请选择Host列表',
    //   choices: hostList,
    //   filter: (val) => {
    //     return _hostConfig[val];
    //   }
    // }]

    const configList =[{
      type:'checkbox',
      name:'hostList',
      message:'选择要使用的host列表',
      default: selectedList || [],
      choices: hostList,
    }]

    return new Promise((resolve, reject) => {
      inquirer.prompt(configList).then((answers) => {
        resolve(answers);
      }).catch(err => {
        reject(err);
      });
    });

  }

  // 获取配置项
  async getConfig() {
    // 筛选当前命令所在的目录下的json、js文件，用于 使用当前目录文件 时，进行选择
    const file = await utils.file.getFile('./', ['json', 'js']);
    const configList = [{
      type: 'list',
      name: 'type',
      message: '选择操作类型',
      choices: [ {
        name: '当前目录导入至工具',
        value: 'import'
      }, {
        name: '导出至当前目录(备份)',
        value: 'export'
      }, {
        name:'生成配置文件',
        message: '根据当前目录的txt文件，创建Host配置文件（不直接导入）',
        value:'createConfig'
      }
      // {
      //   name: '自定义配置项目录',
      //   value: 'userDefined'
      // },
      //  {
      //   name: '使用当前目录文件',
      //   value: 'thisRoot'
      // }
    ],
    }, {
      type: 'list',
      name: 'fileName',
      message: '选择要导入的文件',
      choices: file || [],
      when: (answers) => {
        if (answers.type === 'import') {
          return answers.type;
        }
      },
      filter: (val) => {
        return val;
      }
    }]

    return new Promise((resolve, reject) => {
      inquirer.prompt(configList).then((answers) => {
        resolve(answers);
      }).catch(err => {
        reject(err);
      });
    });

  }




}

module.exports = new question();