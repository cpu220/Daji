#!/usr/bin/env node

const program = require('commander'),
  appInfo = require('./../package.json'),
  project = require('../lib/project.js'),
  ios = require('../lib/ios.js'),
  host = require('../lib/host.js');
ip = require('../lib/ip.js'),
  git = require('../lib/git.js'),
  test = require('../lib/test.js'),
  _path = require('../lib/path.js'),
  config = require('../lib/config'),
  date = require('../lib/date'),

  color = require('colors-cli/toxic');




program
  // .allowUnknownOption()//不报错误
  .version(`daji@${appInfo.version}`, '-v, --version')
  .usage('妲己是个小能手,什么都可以做,目前还正在学习ing'.x31 + ' [options] <package>')
  .description(`目前正在测试ing，而且此工具基本不对外`.x33 + `当前版本${appInfo.version}`)
  .parse(process.argv);

// 创建工程 作废
// program
//   .command('project [cmd]')
//   .alias('p')
//   .description('this is my test project '.x29)
//   .option('-i, --init [type]', '创建工程')
//   .option('-t, --test [type]', '测试')
//   .action(function (cmd, options) {
//     const a = typeof options.name === 'string' ? options.name : ''
//     project(cmd, options);
//   }).on('--help', function () {
//     console.log('welcome for Daji');

//   });

// ios 模拟器
program
  .command('ios [cmd]')
  .description('this is my ios simulator'.x29)
  .description('这个是基于xcode的模拟器，用来快速在对应iphone上调试H5页面，初期启动需要1分钟左右来安装客户端'.x29)
  .option('-s --start [type]', '启动模拟器')
  .option('-i --install [type]', '安装客户端（每个simulator的安装包是独立的，所以需要保持simulator的激活状态）')

  // .option('-d --delete [type]', '卸载客户端')
  .option('-y --yanxuan [type]', '启动模拟器并打开严选app')
  .option('-u --url [type]', '必须跟参数，直接打开参数所带的H5地址')
  .option('-t --translate [type]', 'encode url地址，用于生辰更直接在客户端内执行的命令')
  // .option('--init [type]', '初始化appList')
  .option('--add [type]', '对本地list添加app信息')
  .option('--update [type]', '更新指定app信息')
  .option('--remove [type]', '移除指定app')
  .option('--info [type]', '获取指定app的信息')
  .option('--config [type]', '同步配置项')

  .action(function (cmd, options) {
    ios(cmd, options);
  }).on('--help', function () {
    console.log('ios simulator'.x29);
  })

program
  .command('switchHost [cmd]')
  .description('简易host切换工具'.x29)
  .alias('host')
  .option('-s --switchHost [type]', '选择切换Host')
  .option('-r --reset [type]', '清空 Host 文件内容（重置）')
  .option('--info [type]', '查看当前Host信息')
  .option('--config [type]', '配置文件操作')
  .action((cmd, options) => {
    host(cmd, options);
  }).on('--help', () => {
    console.log('SwitchHost'.x29);
  })

program
  .command('gitConfig [cmd]')
  .alias('git')
  .option('--info [type]', '查看git当前账户信息')
  .option('-s --switchGit [type]', '切换账户')
  .option('--config [type]', '操作配置')

  .description('git相关指令'.x29)
  .action(function (cmd, options) {
    git(cmd, options);
  }).on('--help', function () {
    console.log('切换配置');
  })

program
  .command('ip [cmd]')
  .option('-p --ip [type]', '获取ip')
  .description('get this mac\'s ip'.x29)
  .action(function (cmd, options) {
    ip(cmd, options);
  }).on('--help', () => {
    console.log('获取ip');
  })

program
  .command('path [cmd]')
  .description('当前路径信息'.x29)
  .action((cmd, options) => {
    _path(cmd, options);
  }).on('--help', () => {
    // console.log('获取路径信息');
  })

program
  .command('config [cmd]')
  .description('配置项的相关操作'.x29)
  .option('-i --install [type]', '将当前目录记录的配置文件全部导入工具')
  .option('-b --backup [type]', '将当前配置项全部进行备份')
  .action((cmd, options) => {
    config(cmd, options);
  }).on('--help', () => {
    // console.log('获取路径信息');
  })

program
  .command('Date [cmd]')
  .alias('d')
  .description('时间戳转换工具'.x29)
  .option('-t --Timestamp [type]', '获取当前时间戳')
  .action((cmd, options) => {
    date(cmd, options)
  }).on('--help', () => {
    // console.log('获取路径信息');
  })
// program
//   .command('testCode [cmd]')
//   .alias('test')
//   .option('-i --init [type]', '查看当前信息')

//   .description('just test code'.x29)
//   .action(function (cmd, options) {
//     test(cmd, options);
//   }).on('--help', function () {
//     console.log('testCode');
//   })

//默认不传参数输出help
if (!process.argv[2]) {
  // console.log('test 木有参数');
  program.help();

}
program.parse(process.argv);