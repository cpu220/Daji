const utils = require('../common/utils');

const log = utils.msg;

/**
 * 生成随机密码
 * @param {string} cmd - 命令参数
 * @param {object} options - 命令选项
 */
function passwordTools(cmd, options) {
  let { numbers: includeNumbers, symbols: includeSymbols, length = 12, uppercase: includeUppercase, lowercase: includeLowercase, all: includeAll } = options;
  
  // 如果指定了all选项，覆盖其他选项，包含所有字符类型
  if (includeAll) {
    includeNumbers = true;
    includeSymbols = true;
    includeUppercase = true;
    includeLowercase = true;
    length = includeAll;
  }
  
  // 定义字符集
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // 根据参数构建字符集
  let charSet = '';
  
  // 将includeLowercase转换为布尔值
  const shouldIncludeLowercase = includeLowercase !== false && includeLowercase !== 'false';
  
  // 默认包含小写字母
  if (shouldIncludeLowercase) {
    charSet += lowercaseLetters;
  }
  
  // 如果指定了大写字母，添加到字符集
  if (includeUppercase) {
    charSet += uppercaseLetters;
  }
  
  // 如果指定了数字，添加到字符集
  if (includeNumbers) {
    charSet += numbers;
  }
  
  // 如果指定了符号，添加到字符集
  if (includeSymbols) {
    charSet += symbols;
  }
  
  // 如果字符集为空，使用默认字符集
  if (!charSet) {
    charSet = lowercaseLetters;
  }
  
  // 生成指定长度的密码
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }
  
  // 输出密码
  log.info(password);
}

module.exports = passwordTools;