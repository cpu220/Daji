const path = require('path')
const moment = require('moment');
const process = require('child_process');

const utils = require('../common/utils');



const log = utils.msg;


// 选择设置、删除、清空

class App {
  constructor(props) {
    const { cmd, options } = props;
    this.state = {
      cmd, options
    }

  }

  init() {
    const { options, cmd } = this.state;
    const { Timestamp } = options;
    const _d = Date.parse(new Date())


    if (!!cmd && /^\d*$/.test(cmd)) {
      try {
        const _cmd = parseInt(cmd, 10)
        log.info(moment(_cmd).format('YYYY-MM-DD HH:mm:ss'))
      } catch (error) {
        log.error('时间戳格式不对')
      }
    } else {
      if (!!Timestamp) {
        let _time = '00:00:00';
        if (!!cmd) {
          _time = cmd;
        }
        console.log(`${Timestamp} ${_time}`)
        log.info(moment(`${Timestamp} ${_time}`).format('x'));
      } else {
        log.info(_d)
        log.info(moment(_d).format('YYYY-MM-DD HH:mm:ss'))
      }
    }

  }




}












module.exports = (cmd, options) => {

  const app = new App({ cmd, options });
  app.init();

}