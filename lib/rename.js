const fs = require('fs').promises;
const path = require('path');
const utils = require('../common/utils');

const log = utils.msg;

/**
 * 重命名当前目录下的文件
 * @param {string} cmd - 命令参数
 * @param {object} options - 命令选项
 */
async function renameTools(cmd, options) {
  const { prefix = 'P' } = options;
  
  try {
    // 获取当前目录
    const currentDir = process.cwd();
    log.info(`当前目录: ${currentDir}`);
    
    // 获取当前目录下的所有文件
    const files = await fs.readdir(currentDir, { withFileTypes: true });
    
    // 过滤出文件（排除目录）
    const fileList = files
      .filter(file => file.isFile())
      .map(file => file.name)
      .sort(); // 按文件名排序
    
    if (fileList.length === 0) {
      log.tip('当前目录下没有文件需要重命名');
      return;
    }
    
    log.info(`找到 ${fileList.length} 个文件，准备重命名...`);
    console.log('==============================');
    
    // 开始重命名
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < fileList.length; i++) {
      const oldName = fileList[i];
      const ext = path.extname(oldName);
      const newName = `${prefix}${String(i + 1).padStart(5, '0')}${ext}`;
      
      try {
        await fs.rename(path.join(currentDir, oldName), path.join(currentDir, newName));
        log.success(`${oldName} → ${newName}`);
        successCount++;
      } catch (error) {
        log.error(`重命名 ${oldName} 失败: ${error.message}`);
        failCount++;
      }
    }
    
    console.log('==============================');
    log.info(`重命名完成！成功: ${successCount} 个，失败: ${failCount} 个`);
    
  } catch (error) {
    log.error(`重命名过程中发生错误: ${error.message}`);
  }
}

module.exports = renameTools;