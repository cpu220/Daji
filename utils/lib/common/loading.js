
function loader() {
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
  };

  // 启动加载动画
  this.start = () => {
    if (this.state.isRunning) {
      return;
    }

    this.state.isRunning = true;
    const { loaderList } = this.state;
    const length = loaderList.length;
    let i = 0;

    // 清除之前的定时器
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }

    // 开始动画
    this.state.timer = setInterval(() => {
      // 清除当前行
      process.stdout.write('\r');
      // 写入新的动画帧
      process.stdout.write(loaderList[i % length]);
      i++;
    }, 300);
  };

  // 结束加载动画
  this.end = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.state.timer = null;
    }
    this.state.isRunning = false;
    // 清除当前行
    process.stdout.write('\r');
    process.stdout.write('  '); // 清除动画效果
    process.stdout.write('\r');
  };
}

module.exports = loader;
 