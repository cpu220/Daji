#!/usr/bin/env node

const { Command } = require('commander');
const appInfo = require('./../package.json');
// 引入ios模块
const ios = require('../src/ios');
const host = require('../src/host');
const ip = require('../src/ip');
const git = require('../src/git');
const _path = require('../src/path');
const config = require('../src/config');
const date = require('../src/date');
const password = require('../src/password');
const rename = require('../src/rename');
const color = require('colors-cli/toxic');

// 创建 commander 实例
const program = new Command();

// 配置程序信息
program
  .name('daji')
  .version(`daji@${appInfo.version}`, '-v, --version')
  .usage('妲己是个小能手,什么都可以做,目前还正在学习ing'.x31 + ' [options] <package>')
  .description(`目前正在测试ing，而且此工具基本不对外`.x33 + `当前版本${appInfo.version}`);

// ios 模拟器命令
program
  .command('ios')
  .description('这个是基于xcode的模拟器，用来快速在对应iphone上调试H5页面'.x29)
  .option('-s, --start [device]', '启动模拟器，可指定设备名称快速启动')
  .option('-u, --url <type>', '直接使用Safari打开指定的H5地址')
  .option('-l, --list', '查看本地已安装的模拟器列表')
  .action((options, command) => {
    // 获取额外的参数作为cmd
    const cmd = command.args[0];
    ios(cmd, options);
  });

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
    try {
      // 直接导入并使用解析函数
      const { parseInput, formatDate } = require('../src/date/index.js');
      
      let date, timestamp, input;
      
      // 优先使用options中的Timestamp值
      if (options.Timestamp !== undefined) {
        // 合并options.Timestamp和command.args中的所有参数，处理带时间的日期格式
        input = [options.Timestamp, ...command.args].filter(arg => arg !== undefined).join(' ');
      } else {
        // 否则使用命令参数数组
        const inputArgs = command.args;
        if (inputArgs.length === 0) {
          // 无参数时返回当前时间
          date = new Date();
          timestamp = date.getTime();
          const formattedDate = formatDate(date);
          console.log(`当前日期: ${formattedDate}`);
          console.log(`时间戳: ${timestamp}`);
          return;
        } else if (inputArgs.length === 1) {
          // 单个参数
          input = inputArgs[0];
        } else {
          // 多个参数（如带时间的日期）
          input = inputArgs.join(' ');
        }
      }
      
      if (input !== undefined) {
        // 尝试解析输入
        const result = parseInput(input);
        
          if (!result) {
            throw new Error('无效的输入。请提供有效的日期格式或时间戳。');
          }
        
          date = result.date;
          timestamp = result.timestamp;
        }
      
      // 格式化日期并输出
      const formattedDate = formatDate(date);
      console.log(`日期: ${formattedDate}`);
      console.log(`时间戳: ${timestamp}`);
      
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
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