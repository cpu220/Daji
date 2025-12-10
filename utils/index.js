// 主导出文件，导出所有工具
const common = require('./common');
const lib = require('./lib');

module.exports = {
  // 导出业务相关模块
  ...common,
  
  // 导出通用库模块
  ...lib,
  
  // 导出 Question 工具
  Question: {
    Git: require('./Question/Git'),
    Host: require('./Question/Host'),
    IOS: require('./Question/IOS')
  }
};
