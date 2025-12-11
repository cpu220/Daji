const utils = require('../../utils/lib/common/utils');
const { parse, format, isValid } = require('date-fns');
const { zhCN } = require('date-fns/locale');

const log = utils.msg;

// 使用date-fns格式化日期
function formatDate(date, formatStr = 'yyyy-MM-dd HH:mm:ss') {
  if (!isValid(date)) {
    return null;
  }
  return format(date, formatStr, { locale: zhCN });
}

// 使用date-fns解析输入的日期或时间戳
function parseInput(input) {
  // 处理日期字符串输入
  if (typeof input === 'string' && input.trim()) {
    const dateStr = input.trim();
    
    // 尝试使用原生Date构造函数（最宽松的方式）直接解析
    try {
      let date = new Date(dateStr);
      
      // 验证是否为有效日期
      if (!isNaN(date.getTime())) {
        return {
          date,
          timestamp: date.getTime()
        };
      }
    } catch (e) {
      // 原生构造函数解析失败，继续尝试其他方法
    }
    
    // 尝试多种日期格式解析
    const formatsToTry = [
      // 标准日期格式
      'yyyy-MM-dd',
      'yyyy/MM/dd',
      'yyyyMMdd',
      // 带时间的格式
      'yyyy-MM-dd HH:mm:ss',
      'yyyy/MM/dd HH:mm:ss',
      'yyyyMMdd HH:mm:ss',
      // 其他常见格式
      'yyyy-MM-dd HH:mm',
      'yyyy/MM/dd HH:mm'
    ];
    
    // 尝试每种格式解析，使用非严格模式以提高兼容性
    for (const formatStr of formatsToTry) {
      try {
        const parsedDate = parse(dateStr, formatStr, new Date(), { locale: zhCN, strict: false });
        if (isValid(parsedDate) && !isNaN(parsedDate.getTime())) {
          return {
            date: parsedDate,
            timestamp: parsedDate.getTime()
          };
        }
      } catch (e) {
        // 当前格式解析失败，继续尝试下一个格式
        continue;
      }
    }
    
    // 对于YYYYMMDD格式的特殊处理
    if (/^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.slice(0, 4), 10);
      const month = parseInt(dateStr.slice(4, 6), 10) - 1; // 月份从0开始
      const day = parseInt(dateStr.slice(6, 8), 10);
      const date = new Date(year, month, day);
      
      // 验证日期是否有效
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return {
          date,
          timestamp: date.getTime()
        };
      }
    }
  }
  
  // 处理时间戳输入
  if (typeof input === 'number' || /^\d+$/.test(input)) {
    const timestamp = typeof input === 'number' ? input : parseInt(input, 10);
    const date = new Date(timestamp);
    
    if (isValid(date)) {
      return { date, timestamp };
    }
  }
  
  return null;
}

class App {
  constructor() {}

  /**
   * 格式化日期或输出当前时间
   * @param {string|number|undefined} input - 输入参数（可选）：日期字符串、时间戳或无参数
   * @returns {object} - 包含日期字符串和时间戳的对象
   */
  handleDate(input) {
    let date;
    let timestamp;
    
    // 无参数时返回当前时间
    if (input === undefined || input === null || input === '') {
      date = new Date();
      timestamp = date.getTime();
    } else {
      // 尝试解析输入
      const result = parseInput(input);
      
      if (!result) {
        throw new Error('无效的输入。请提供有效的日期格式或时间戳。');
      }
      
      date = result.date;
      timestamp = result.timestamp;
    }
    
    // 格式化日期
    const formattedDate = formatDate(date);
    
    return {
      date: formattedDate,
      timestamp: timestamp
    };
  }

  /**
   * 命令行工具入口
   * @param {Array} args - 命令行参数
   */
  run(args) {
    try {
      // 简化命令行参数处理：只取第一个参数作为输入
      const input = args.length > 1 ? args[1] : undefined;
      const result = this.handleDate(input);
      
      log.info(`日期: ${result.date}`);
      log.info(`时间戳: ${result.timestamp}`);
    } catch (error) {
      log.error(error.message);
      process.exit(1);
    }
  }
}

module.exports = App;

// 同时导出工具函数供其他模块使用
module.exports.formatDate = formatDate;
module.exports.parseInput = parseInput;