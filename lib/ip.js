const os = require("os");

/**
 * 获取当前设备的IP地址信息
 * @param {string} cmd - 命令参数
 * @param {object} options - 命令选项
 */
function ipTools(cmd, options) {
  const hostName = os.hostname();
  const ifaces = os.networkInterfaces();
  const ipv4 = [];
  const ipv6 = [];
  
  // 遍历所有网络接口
  for (const interfaceName in ifaces) {
    const interfaces = ifaces[interfaceName];
    for (const networkInterface of interfaces) {
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        ipv4.push(networkInterface.address);
      } else if (networkInterface.family === 'IPv6' && !networkInterface.internal) {
        ipv6.push(networkInterface.address);
      }
    }
  }
  
  // 构建结果对象
  const result = {
    ipv4,
    ipv6,
    hostName,
    system: os.type(),
    release: os.release()
  };
  
  // 输出格式化的JSON结果
  console.log(JSON.stringify(result, null, 4));
}

module.exports = ipTools;