const path = require('path');
const utils = require('../common/utils');

const log = utils.msg;

// 格式化日期
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

class App {
  constructor(props) {
    const { cmd, options } = props;
    this.state = {
      cmd, 
      options
    };
  }

  init() {
    const { options, cmd } = this.state;
    const { Timestamp } = options;
    const now = new Date();
    const currentTimestamp = now.getTime();

    // 如果cmd是数字字符串，视为时间戳
    if (cmd && /^\d+$/.test(cmd)) {
      try {
        const timestamp = parseInt(cmd, 10);
        const date = new Date(timestamp);
        log.info(formatDate(date));
      } catch (error) {
        log.error('时间戳格式不对');
      }
    } else if (Timestamp) {
      // 将日期字符串转换为时间戳
      let timeStr = '00:00:00';
      if (cmd) {
        timeStr = cmd;
      }
      
      const dateStr = `${Timestamp} ${timeStr}`;
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        log.error('日期格式不对，请使用YYYY-MM-DD HH:mm:ss格式');
      } else {
        log.info(date.getTime());
      }
    } else {
      // 输出当前时间戳和格式化日期
      log.info(currentTimestamp);
      log.info(formatDate(now));
    }
  }
}

module.exports = (cmd, options) => {
  const app = new App({ cmd, options });
  app.init();
}