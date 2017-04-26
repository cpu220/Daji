#!/usr/bin/env node
var program = require('commander');
program
    // .allowUnknownOption()//不报错误
    .version('1.0.0')
    .usage('hello daji [options] <package>')
    .parse(process.argv);

program
    .command('resume [cmd]')
    .alias('rs')
    .description('hello Daji '.x29)
    .option("-b, --basicinfo [type]", "测试")
    .action(function(cmd, options){
       
    }).on('--help', function() {
 			console.log('welcome Daji');

    });

//默认不传参数输出help
if (!process.argv[2]) {
    program.help();
    console.log();
}

program.parse(process.argv);
