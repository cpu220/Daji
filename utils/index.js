// 主导出文件，导出所有工具
const lib = require('./lib');
const commonUtils = require('./lib/common/utils');

module.exports = {
  // 导出通用库模块
  ...lib,
  
  // 导出工具函数
  msg: require('./lib/common/msgColor'),
  file: commonUtils,
  utils: commonUtils
};

// Question 工具已迁移到对应模块目录下
