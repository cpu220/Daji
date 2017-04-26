#!/usr/bin/env node
const program = require('commander'),
 appInfo = require('./../package.json'),
 action = require('../lib/index.js');
 color = require('colors-cli/toxic');
program
    // .allowUnknownOption()//不报错误
    .version(appInfo.version)
    .usage('啊~~~被玩坏了..... [options] <package>')
    .parse(process.argv);

program
    .command('action [cmd]')
    .alias('rs')
    .description('this is my test project '.x29)
    .option("-b, --basicinfo [type]", "测试1")
    .option("-t, --test [type]", "测试2")
    .action(function(cmd, options){
      const a = typeof opations.name === 'string'?opations.name:''
      action(cmd,opation);
      console.log('开始执行action')
    }).on('--help', function() {
 			console.log('welcome Daji');

    });

//默认不传参数输出help
if (!process.argv[2]) {
    program.help();
    console.log('test 木有参数');
}

program.parse(process.argv);
