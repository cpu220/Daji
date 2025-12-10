#!/usr/bin/env node

const process = require('child_process');
const color = require('colors-cli/toxic');
const iosTools = require('./tools');
const question = require('./question');
const utilsModule = require('../../utils/lib/common/utils');
const log = utilsModule.msg;


class App {
  constructor(props) {
    const {
      cmd,
      options
    } = props;
    this.state = {
      cmd,
      options
    };
  }

  init() {
    const { options } = this.state;
    const { start, url, list } = options;
    
    if (!!list) {
      this.onList()
    } else if (!!start) {
      this.onStart(start)
    } else if (url) {
      this.onUrl(url);
    } else {
      console.log('试试 -h?')
    }
  }

  onList() {
    // 查看本地已安装的模拟器列表
    question.getIphoneList().then(devices => {
      console.log('\n== 本地已安装的模拟器列表 ==\n'.x34);
      devices.forEach((device, index) => {
        console.log(`${index + 1}. ${device}`);
      });
      console.log('\n');
    }).catch(err => {
      console.error('获取模拟器列表失败:', err);
    });
  }

  onStart(param) {
    // 支持两种模式：
    // 1. 提供设备名称时，直接启动对应设备
    // 2. 未提供设备名称时，显示列表选择设备
    if (param && param !== true) {
      // 提供了设备名称，直接启动
      iosTools.openIphoneByName(param);
    } else {
      // 未提供设备名称，显示列表选择
      iosTools.openIphone();
    }
  }

  onUrl(url) {
    if (!/^http(s){0,1}:\/\//.test(url)) {
      log.warn('检测到url 没有带http|https ,请确认是否为遗漏');
    }
    // 直接使用safari打开url
    iosTools.openUrl(url);
  }

}


module.exports = (cmd, options) => {
  
  const app = new App({
    cmd,
    options
  });
  app.init();
};



 