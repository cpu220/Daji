const chalk = require('chalk');

const msg = {
  error: (text) => {
      console.log(chalk.red(text));
  },
  log: (text) => {
      console.log(chalk.blue(text));
  },
  warn: (text) => {
      console.log(chalk.yellow(text));
  },
  tip: (text) => {
      console.log(chalk.cyan(text));
  },
  info: (text) => {
      console.log(chalk.cyan(text));
  },
  success:(text)=>{
      console.log(chalk.green(text));
  },
  hide:(text)=>{
      console.log(chalk.gray(text));
  }
};
module.exports = msg;
