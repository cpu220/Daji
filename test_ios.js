#!/usr/bin/env node

// 直接测试 ios 模块功能
const iosModule = require('./lib/ios');

// 测试查看模拟器列表功能
console.log('测试查看模拟器列表功能...');
iosModule('', { list: true });
