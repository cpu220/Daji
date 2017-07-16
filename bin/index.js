#!/usr/bin/env node

const program = require('commander'),
  appInfo = require('./../package.json'),
  project = require('../lib/project.js'),
  ios = require('../lib/ios.js'),
  ip = require('../lib/ip.js'),

  color = require('colors-cli/toxic');


program
  // .allowUnknownOption()//不报错误
  .version(appInfo.version)
  .usage('妲己是个小能手,什么都可以做,目前还正在学习ing'.x31 + ' [options] <package>')
  .description('目前正在测试ing，而且此工具基本不对外，呵呵'.x33)
  .parse(process.argv);

program
  .command('project [cmd]')
  .alias('p')
  .description('this is my test project '.x29)
  .option('-i, --init [type]', '创建工程')
  .option('-t, --test [type]', '测试')
  .action(function (cmd, options) {
    const a = typeof options.name === 'string' ? options.name : ''
    project(cmd, options);
  }).on('--help', function () {
    console.log('welcome for Daji');

  });

program
  .command('ios [cmd]') 
  .description('this is my ios simulator'.x29)
  .option('-i --init [type]', '测试一下')
  .action(function (cmd, options) {
    ios(cmd, options);
  }).on('--help', function () {
    console.log('ios simulator'.x29);
  })

program
  .command('ip [cmd]')
  .option('-p --ip [type]', '获取ip') 
  .description('get this mac\'s ip'.x29)
  .action(function (cmd, options) { 
    ip(cmd, options);
  }).on('--help', function () {
    console.log('获取ip');
  })

 



//默认不传参数输出help
if (!process.argv[2]) {
  // console.log('test 木有参数');
  program.help();

}
program.parse(process.argv);