#!/usr/bin/env node
const program = require('commander'),
 appInfo = require('./../package.json'),
 project = require('../lib/project.js'),
 ios = require('../lib/ios.js'),
 color = require('colors-cli/toxic');


program
    // .allowUnknownOption()//不报错误
    .version(appInfo.version)
    .usage('妲己是个小能手,什么都可以做,目前还正在学习ing'.x31+' [options] <package>')
    .parse(process.argv);

program
    .command('project [cmd]')
    .alias('p')
    .description('this is my test project '.x29)
    .option('-i, --init [type]', '创建工程')
    .option('-t, --test [type]', '测试')
    .action(function(cmd, options){
      const a = typeof options.name === 'string'?options.name:''
      project(cmd,options);
    }).on('--help', function() {
 			console.log('welcome Daji');

    });

program
  .command('ios [cmd]')
  .alias('i')
  .description('this is my ios simulator'.x29)
  .option('-i --init [type]','测试一下')
  .action(function(cmd,options){
    ios(cmd,options);
  }).on('--help',function(){
    console.log('ios simulator'.x29);
  })


//默认不传参数输出help
if (!process.argv[2]) {
    program.help();
    console.log('test 木有参数');
}

program.parse(process.argv);
