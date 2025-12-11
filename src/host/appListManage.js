const _fileList = require('../../data/_fileList.json');
const utils = require('../../utils');

class AppListManage {
  constructor() {}

  // 使用当前目录文件
  async useThisDirFile(param, _filePath) {
    const { path } = param;
    const _config = await utils.file.read(path);
    await utils.file.reset(_filePath, _config);
  }

  // 导出配置
  async exportsConfig(param, _filePath) {
    const { url } = param;
    const _config = await utils.file.read(_filePath);
    await utils.file.reset(url, _config);
    return _config;
  }
}

module.exports = AppListManage;