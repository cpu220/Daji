// host


const utils = require('../../utils/lib/common/utils');

const inquirer = require('inquirer');
const _hostConfig = require('../../data/host/config.json');
const selectedList = require('../../data/host/selected.json');
// const listJSONRoot = _config.panJSON;


class question {
  constructor() {
    this.state = {

    }


  }
  async chooseHost(callback) {
    const hostList = [];

    // 确保获取所有配置项
    for (const i in _hostConfig) {
      hostList.push(i);
    }

    // 检查是否有可用的host配置
    if (hostList.length === 0) {
      console.log('警告：未找到任何host配置');
      return { hostList: [] };
    }

    const configList =[{
      type:'list',
      name:'hostList',
      message:'请选择要使用的host配置（单选）',
      default: (selectedList && selectedList[0]) || hostList[0],
      choices: hostList,
      // 将单选结果转换为数组格式以兼容现有代码
      filter: function(val) {
        return [val];
      }
    }]

    return new Promise((resolve, reject) => {
      inquirer.prompt(configList).then((answers) => {
        // 确保即使取消选择也返回一个有效对象
        if (!answers || !answers.hostList) {
          resolve({ hostList: [] });
        } else {
          resolve(answers);
        }
      }).catch(err => {
        console.error('选择过程中出错:', err);
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