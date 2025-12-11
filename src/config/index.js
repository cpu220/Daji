const path = require('path');
const fs = require('fs').promises;
const utils = require('../../utils/lib/common/utils');

const log = utils.msg;
const _defaultConfigFileName = 'gitConfig.json';

// 递归遍历目录，获取所有JSON文件
async function getJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  let files = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await getJsonFiles(fullPath);
      files = [...files, ...subFiles];
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  
  return files;
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
    const { options } = this.state;
    const { install, backup } = options;
    
    if (install) {
      console.log('导入备份');
      this.doImportBack();
    } else if (backup) {
      this.doBackUp();
    }
  }

  // 备份
  async doBackUp() {
    try {
      const dataDir = path.resolve(__dirname, '../data');
      const fileList = await getJsonFiles(dataDir);

      for (const filePath of fileList) {
        const parsedPath = path.parse(filePath);
        if (parsedPath.name.indexOf('_') < 0) {
          const relativeDir = path.relative(dataDir, parsedPath.dir);
          const backupDir = path.join('./backup', relativeDir);
          const backupPath = path.join(backupDir, parsedPath.base);
          
          // 确保备份目录存在
          await fs.mkdir(backupDir, { recursive: true });
          
          // 读取并写入文件
          const data = await fs.readFile(filePath, 'utf8');
          await fs.writeFile(backupPath, data, 'utf8');
        }
      }
      
      log.success('备份完成');
    } catch (error) {
      log.error(`备份失败: ${error.message}`);
    }
  }

  // 导入备份数据
  async doImportBack() {
    try {
      const backupDir = path.resolve('./backup');
      const fileList = await getJsonFiles(backupDir);
      
      for (const filePath of fileList) {
        const parsedPath = path.parse(filePath);
        const relativeDir = path.relative(backupDir, parsedPath.dir);
        const dataPath = path.join(__dirname, '../data', relativeDir, parsedPath.base);
        
        // 确保数据目录存在
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        
        // 读取并写入文件
        const data = await fs.readFile(filePath, 'utf8');
        await fs.writeFile(dataPath, data, 'utf8');
      }
      
      log.success('导入完成');
    } catch (error) {
      log.error(`导入失败: ${error.message}`);
    }
  }
}

module.exports = (cmd, options) => {
  const app = new App({ cmd, options });
  app.init();
}