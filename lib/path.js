// 获取当前工作目录路径
function pathTools(cmd, options) {
  // 使用process.cwd()替代pwd命令，更高效安全
  console.log(process.cwd());
}

module.exports = pathTools;