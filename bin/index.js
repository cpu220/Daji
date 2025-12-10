#!/usr/bin/env node

const { Command } = require('commander');
const appInfo = require('./../package.json');
// 暂时注释掉ios模块，因为它依赖于已移除的through模块
// const ios = require('../lib/ios.js');
const host = require('../lib/host.js');
const ip = require('../lib/ip.js');
const git = require('../lib/git.js');
const _path = require('../lib/path.js');
const config = require('../lib/config');
const date = require('../lib/date');
const password = require('../lib/password');
const rename = require('../lib/rename');
const color = require('colors-cli/toxic');

// 创建 commander 实例
const program = new Command();

// 配置程序信息
program
  .name('daji')
  .version(`daji@${appInfo.version}`, '-v, --version')
  .usage('妲己是个小能手,什么都可以做,目前还正在学习ing'.x31 + ' [options] <package>')
  .description(`目前正在测试ing，而且此工具基本不对外`.x33 + `当前版本${appInfo.version}`);

// ios 模拟器命令 - 暂时注释，因为依赖已移除的through模块
/*
program
  .command('ios')
  .description('这个是基于xcode的模拟器，用来快速在对应iphone上调试H5页面，初期启动需要1分钟左右来安装客户端'.x29)
  .option('-s, --start [type]', '启动模拟器')
  .option('-i, --install [type]', '安装客户端（每个simulator的安装包是独立的，所以需要保持simulator的激活状态）')
  .option('-y, --yanxuan [type]', '启动模拟器并打开严选app')
  .option('-u, --url [type]', '必须跟参数，直接打开参数所带的H5地址')
  .option('-t, --translate [type]', 'encode url地址，用于生成更直接在客户端内执行的命令')
  .option('--add [type]', '对本地list添加app信息')
  .option('--info [type]', '获取指定app的信息')
  .option('--remove [type]', '移除指定app')
  .option('--update [type]', '更新指定app信息')
  .option('--config [type]', '同步配置项')
  .action((options, command) => {
    // 获取额外的参数作为cmd
    const cmd = command.args[0];
    ios(cmd, options);
  });
*/

// host 切换命令
program
  .command('switchHost')
  .alias('host')
  .description('简易host切换工具'.x29)
  .option('-s, --switchHost [type]', '选择切换Host')
  .option('-r, --reset [type]', '清空 Host 文件内容（重置）')
  .option('--info [type]', '查看当前Host信息')
  .option('--config [type]', '配置文件操作')
  .action((options, command) => {
    const cmd = command.args[0];
    host(cmd, options);
  });

// git 配置命令
program
  .command('gitConfig')
  .alias('git')
  .description('git相关指令'.x29)
  .option('--info [type]', '查看git当前账户信息')
  .option('-s, --switchGit [type]', '切换账户')
  .option('--config [type]', '操作配置')
  .action((options, command) => {
    const cmd = command.args[0];
    git(cmd, options);
  });

// ip 命令
program
  .command('ip')
  .description('get this mac\'s ip'.x29)
  .option('-p, --ip [type]', '获取ip')
  .action((options, command) => {
    const cmd = command.args[0];
    ip(cmd, options);
  });

// path 命令
program
  .command('path')
  .description('当前路径信息'.x29)
  .action((options, command) => {
    const cmd = command.args[0];
    _path(cmd, options);
  });

// config 命令
program
  .command('config')
  .description('配置项的相关操作'.x29)
  .option('-i, --install [type]', '将当前目录记录的配置文件全部导入工具')
  .option('-b, --backup [type]', '将当前配置项全部进行备份')
  .action((options, command) => {
    const cmd = command.args[0];
    config(cmd, options);
  });

// date 命令
program
  .command('Date')
  .alias('d')
  .description('时间戳转换工具'.x29)
  .option('-t, --Timestamp [type]', '获取当前时间戳')
  .action((options, command) => {
    const cmd = command.args[0];
    date(cmd, options);
  });

// password 命令
program
  .command('password')
  .alias('pwd')
  .description('密码生成工具'.x29)
  .option('-n, --numbers', '包含数字')
  .option('-s, --symbols', '包含符号')
  .option('-l, --length <number>', '密码长度，默认12位', 12)
  .option('-u, --uppercase', '包含大写字母')
  .option('-d, --lowercase <boolean>', '包含小写字母，默认true', true)
  .option('-a, --all <number>', '包含所有字符类型（数字、符号、大小写字母）并指定长度')
  .action((options, command) => {
    const cmd = command.args[0];
    password(cmd, options);
  });

// rename 命令
program
  .command('rename')
  .alias('rn')
  .description('文件重命名工具'.x29)
  .option('-p, --prefix <string>', '自定义前缀，默认P', 'P')
  .option('-d, --dir', '递归处理子目录')
  .option('-num, --number <number>', '序号位数，默认5位', 5)
  .option('-type, --type <types...>', '文件类型，支持多个类型，如: jpg png gif')
  .option('-forceDir, --forceDir', '强制重命名文件夹，从1开始自增')
  .action((options, command) => {
    const cmd = command.args[0];
    rename(cmd, options);
  });

// 默认显示帮助
if (!process.argv[2]) {
  program.help();
}

// 解析命令行参数
program.parse(process.argv);