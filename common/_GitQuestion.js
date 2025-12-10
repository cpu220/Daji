// host


const utils = require('./utils');

const inquirer = require('inquirer');
const _gitConfig = require('../data/git/config.json');
// const listJSONRoot = _config.panJSON;


class question {
  constructor() {
    this.state = {

    }


  }
  async chooseGitAccount() {


    const gitList = [];
     

    for (const i in _gitConfig) {
      gitList.push(i);
    }

    const list = [{
      type: 'list',
      name: 'gitConfig',
      message: '请选择要切换的账户',
      choices: gitList || [],
      filter: (val) => {
        return _gitConfig[val];
      }
    }]


    return new Promise((resolve, reject) => {
      inquirer.prompt(list).then((answers) => {
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
      choices: [{
        name: '当前目录导入至工具',
        value: 'import'
      }, {
        name: '导出至当前目录(备份)',
        value: 'export'
      }, {
        name: '修改',
        value: 'update'
      }],
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

  async updateGitConfig(json) {
    const gitKey = [];
     

    for (const i in _gitConfig) {
      gitKey.push(i)
    }
    const configList = [{
      type: 'list',
      name: 'gitKey',
      message: '选择要需改的git账号',
      choices: gitKey || [],
      validate: (val) => {
       return val
      }, 
    }, {
      type: 'input',
      name: 'name',
      default: json.name || null,
      message: '请输入git.name',
      validate: (val) => {
        if (val.trim() === '') {
          return '账号不能为空';
        }
        return true;
      }
    }, {
      type: 'input',
      name: 'email',
      default: json.email || null,
      message: '请输入git.email',
      validate: (val) => {
        if (val.trim() === '') {
          return 'email不能为空';
        }
        return true;
      }
    }];
    
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