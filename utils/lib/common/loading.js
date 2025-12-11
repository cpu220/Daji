
const ora = require('ora');

function loader() {
  this.spinner = null;
  this.state = {
    timer: null,
    loaderList: ['/ ', '| ', '\\ ', '- '],
    currentIndex: 0,
    isRunning: false
  };

  // 初始化
  this.init = (options = {}) => {
    this.state = {
      ...this.state,
      ...options,
      loaderList: options.loaderList || this.state.loaderList
    };
    
    // 使用ora创建spinner，保持原有API兼容
    this.spinner = ora({
      text: '',
      spinner: {
        frames: this.state.loaderList
      }
    });
  };

  // 启动加载动画
  this.start = () => {
    if (this.state.isRunning) {
      return;
    }

    this.state.isRunning = true;
    
    // 初始化spinner如果还没有初始化
    if (!this.spinner) {
      this.init();
    }
    
    this.spinner.start();
  };

  // 结束加载动画
  this.end = () => {
    if (this.spinner) {
      this.spinner.stop();
    }
    this.state.isRunning = false;
    // 清除当前行，保持原有行为
    process.stdout.write('\r');
    process.stdout.write('  '); // 清除动画效果
    process.stdout.write('\r');
  };
}

module.exports = loader;
 