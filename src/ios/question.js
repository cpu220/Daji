// ios配置文件
const path = require('path');
// const fs = require('fs');
const utilsModule = require('../../utils/lib/common/utils');

// inquirer v12.0.0 使用 createPromptModule 方法
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const _config = require('../../data/ios/config.json');
const configPath = path.resolve(__dirname, '../../data/ios/config.json');
const configDir = path.dirname(configPath);
const listJSONRoot = path.resolve(configDir, _config.panJSON);
const appJson = require(listJSONRoot);
const process = require('child_process');

class question {
  constructor() {
    this.state = {

    }
    this.getAppName = this.getAppName.bind(this);
    this.getIphoneList = this.getIphoneList.bind(this);

    this.chooseApp = this.chooseApp.bind(this);
    this.chooseDevice = this.chooseDevice.bind(this);
    this.inputAppInfo = this.inputAppInfo.bind(this);

    this.confirm = this.confirm.bind(this);

  }
  // 获取appName 列表 
  getAppName() {
    let result = [];
    const listLength = appJson.list.length;
    for (let i = 0; i < listLength; i++) {
      result.push(appJson.list[i].cname);
    }
    return result;
  }
  //  获取当前设备的模拟器list
  getIphoneList() {
    return new Promise((resolve, reject) => {
      console.log('== 正在获取本地设备清单 =='.x34);
      console.log('ps: 首次启动时间较长，请耐心等待... \n');
      process.exec("xcrun simctl list devices --json", (err, stdout, stderr) => {
        if (err) {
          console.error('获取模拟器列表失败:', err);
          reject(err);
          return;
        }
        
        try {
          const devicesData = JSON.parse(stdout);
          const iphoneList = [];
          
          // 遍历所有设备类型
          Object.keys(devicesData.devices).forEach(deviceType => {
            const devices = devicesData.devices[deviceType];
            devices.forEach(device => {
              // 只添加可用的iPhone和iPad模拟器
              // 检查设备是否可用，并且没有availabilityError
              if (device.isAvailable === true && 
                  !device.availabilityError &&
                  (device.name.startsWith('iPhone') || device.name.startsWith('iPad'))) {
                // 提取运行时版本，如 iOS-26-0
                const runtime = deviceType.split('.').pop();
                // 将设备名称和运行时版本结合，如 "iPhone 17 (iOS-26-0)"
                iphoneList.push(`${device.name} (${runtime})`);
              }
            });
          });
          
          // 去重并排序
          const uniqueDevices = [...new Set(iphoneList)].sort();
          resolve(uniqueDevices);
        } catch (parseError) {
          console.error('解析模拟器列表失败:', parseError);
          reject(parseError);
        }
      });
    })
  }
  /**
   * 获取本地的applist，并给与选择
   * 
   * @memberof question
   */
  chooseApp(callback) {
    const list = this.getAppName();
    
    // 如果没有回调，返回Promise
    if (!callback) {
      return new Promise((resolve) => {
        this.chooseApp(resolve);
      });
    }
    
    if (list.length === 0) {
      console.log('当前未添加任何app信息,如想添加请查阅文档');
      callback(false);
    } else {
      const appList = [{
        type: 'list',
        name: 'app',
        message: 'choose a app',
        choices: this.getAppName() || [],
        filter: function (val) {
          return val;
        }
      }];

      inquirer.prompt(appList).then(function (answers) {
        callback(answers);
      });
    }
  }
  /**
   * 获取本地设备清单，并给与选择
   * 
   * @param {any} callback 
   * @memberof question
   */
  chooseDevice(callback) {
    this.getIphoneList().then(data => {
      if (!data || data.length === 0) {
        console.log('未找到可用的模拟器设备，请确保已安装Xcode并创建了模拟器。');
        if (callback) {
          callback({ iphone: null });
        }
        return;
      }
      
      const list = [{
        type: 'list',
        name: 'iphone',
        message: '选择设备',
        choices: data,
        filter: function (val) {
          return val;
        }
      }];
      prompt(list).then(function (answers) {
        if (!!callback) {
          callback(answers);
        }
      });
    }).catch(err => {
      console.error('获取设备列表失败:', err);
      if (callback) {
        callback({ iphone: null });
      }
    });
  }
  inputAppInfo() {
    const _this = this;

    return new Promise((resolve, reject) => {
      const list = _this.formatInfoList({});

      prompt(list).then(function (answers) {
        const result = _this.formatInfoListForResult(answers);
        resolve(result);
      });
    });

  }
  /**
   * 用于条件判断
   * 
   * @param {any} msg 
   * @memberof question
   */
  confirm(msg, callback) {
    const list = [{
      type: 'confirm',
      name: 'flag',
      message: msg
    }];

    return new Promise((resolve, reject) => {

      prompt(list).then(function (answers) {
        resolve(answers);
      });
    })
  }
  /**
   * 更新app，并获取更新后的数据
   * 
   * @param {any} appInfo 
   * @returns 
   * @memberof question
   */
  updateApp(appInfo) {
    const _this = this;
    // console.log(appInfo);
    return new Promise((resolve, reject) => {
      const list = _this.formatInfoList(appInfo);

      prompt(list).then(function (answers) {
        const result = _this.formatInfoListForResult(answers);
        result.name = appInfo.name; // name为主键，不允许修改
        resolve(result);
      });
    })

  }
  formatInfoList(appInfo) {
    const name = [{
      type: 'input',
      name: 'name',
      message: 'app的英文名(用于启动指令)',
      validate: (val) => {
        if (val.trim() === '') {
          return '请填写app的英文名';
        }
        return true;
      }
    }]
    const list = [{
        type: 'input',
        name: 'cname',
        default: appInfo.cname || null,
        message: 'app的中文名(用于list展示)',
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写app的中文名';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'packageName',
        message: 'app文件名(xxx.app)',
        default: appInfo.packageName || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写正确的packageName';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'boundId',
        message: '请填写boundId',
        default: appInfo.boundId || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写boundId';
          }
          return true;
        }
      }, {
        type: 'input',
        name: 'scheme',
        message: '请填写scheme(用于调用对应app打开H5页面,如:xxx://webview?url=)',
        default: appInfo.scheme || null,
        validate: (val) => {
          if (val.trim() === '') {
            return '请填写scheme';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'url',
        message: 'app包仓库地址(git地址),用于存放对应app包，如果不需要安装可以不填写直接回车',
        default: !!appInfo.repository ? appInfo.repository.url : null,
        // validate: (val) => {
        //   if (!/^git/.test(val)) {
        //     return '请填写正确的仓库地址,如 git@xxx';
        //   }
        //   return true;
        // }
      }
    ];
    if (!!appInfo.name) {
      return list;
    } else {
      return [].concat(name, list);
    }

  }
  formatInfoListForResult(answers) {
    return Object.assign({}, {
      "name": answers.name || '',
      "cname": answers.cname,
      "packageName": answers.packageName,
      "boundId": answers.boundId,
      "scheme": answers.scheme,
      "repository": {
        "type": "git",
        "url": answers.url
      }
    });
  }
  // 输入地址
  async getConfig() {
    // 筛选当前命令所在的目录下的json、js文件，用于 使用当前目录文件 时，进行选择
    const file = await utilsModule.file.getFile('./', ['json', 'js']);
    const configList = [{
      type: 'list',
      message: '请选择操作类型',
      name: 'type',
      choices: [{
        name: '导出',
        value: 'export'
      }, {
        name: '导入',
        value: 'import'
      }, {
        name: '自定义配置项目录',
        value: 'userDefined'
      }, {
        name: '重置',
        value: 'reset'
      }, {
        name: '使用当前目录文件',
        value: 'thisRoot'
      }],
    }, {
      type: 'input',
      name: 'url',
      message: "请输入地址",
      when: (answers) => {
        if (answers.type !== 'reset' && answers.type !== 'thisRoot') {
          return answers.type;
        }
      },
      validate: (val) => {
        let _urlObj = path.parse(val);
        if (!!_urlObj.ext.trim() === false) {
          return '请填写准确的文件地址(xxx/xxx/xxx.xx)';
        }
        return true;
      }
    }, {
      type: 'list',
      name: 'fileName',
      message: '输选择文件名',
      choices:file||[],
      when: (answers) => {
        if (answers.type === 'thisRoot') {
          return answers.type;
        }
      },
      filter: function (val) {
        return val;
      }
    }];

    return new Promise((resolve, reject) => {

      prompt(configList).then((answers) => {
        resolve(answers);
      }).catch(err => {
        reject(err);
      });
    });

  }


}
// const a = new question();
module.exports = new question();

// a.chooseApp()