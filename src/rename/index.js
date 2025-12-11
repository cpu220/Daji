const fs = require('fs').promises;
const path = require('path');
const utils = require('../../utils/lib/common/utils');

const log = utils.msg;

/**
 * 递归获取目录下的所有文件和文件夹
 * @param {string} dirPath - 目录路径
 * @param {boolean} recursive - 是否递归处理子目录
 * @returns {Promise<Object>} 包含文件和文件夹的对象
 */
async function getAllFilesAndDirs(dirPath, recursive) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  let result = {
    files: [],
    dirs: []
  };

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.dirs.push(fullPath);
      if (recursive) {
        const subResult = await getAllFilesAndDirs(fullPath, recursive);
        result.files = [...result.files, ...subResult.files];
        result.dirs = [...result.dirs, ...subResult.dirs];
      }
    } else {
      result.files.push(fullPath);
    }
  }

  return result;
}

/**
 * 按目录分组文件
 * @param {string[]} filePaths - 文件路径列表
 * @returns {Object} 按目录分组的文件
 */
function groupFilesByDir(filePaths) {
  const groups = {};
  
  for (const filePath of filePaths) {
    const dir = path.dirname(filePath);
    if (!groups[dir]) {
      groups[dir] = [];
    }
    groups[dir].push(filePath);
  }
  
  return groups;
}

/**
 * 重命名文件或文件夹
 * @param {string} oldPath - 原路径
 * @param {string} newPath - 新路径
 * @returns {Promise<boolean>} 重命名是否成功
 */
async function renameItem(oldPath, newPath) {
  try {
    await fs.rename(oldPath, newPath);
    log.success(`${path.basename(oldPath)} → ${path.basename(newPath)}`);
    return true;
  } catch (error) {
    log.error(`重命名 ${path.basename(oldPath)} 失败: ${error.message}`);
    return false;
  }
}

/**
 * 重命名目录下的文件
 * @param {string} dirPath - 目录路径
 * @param {string[]} filePaths - 该目录下的文件路径
 * @param {Object} options - 命令选项
 * @returns {Promise<Object>} 重命名结果
 */
async function renameFilesInDir(dirPath, filePaths, options) {
  const { prefix = 'P', number = 5 } = options;
  
  // 按文件名排序
  const sortedFiles = filePaths.sort();
  
  if (sortedFiles.length === 0) {
    log.tip(`${dirPath} 目录下没有需要重命名的文件`);
    return { success: 0, fail: 0 };
  }
  
  log.info(`\n处理目录: ${dirPath}`);
  log.info(`找到 ${sortedFiles.length} 个文件，准备重命名...`);
  
  let successCount = 0;
  let failCount = 0;
  
  // 开始重命名
  for (let i = 0; i < sortedFiles.length; i++) {
    const oldPath = sortedFiles[i];
    const ext = path.extname(oldPath);
    const newName = `${prefix}${String(i + 1).padStart(number, '0')}${ext}`;
    const newPath = path.join(dirPath, newName);
    
    if (await renameItem(oldPath, newPath)) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  return { success: successCount, fail: failCount };
}

/**
 * 重命名文件夹
 * @param {string[]} dirPaths - 文件夹路径列表
 * @returns {Promise<Object>} 重命名结果
 */
async function renameDirs(dirPaths) {
  // 按路径长度排序，确保先处理子目录
  const sortedDirs = dirPaths.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);
  
  let successCount = 0;
  let failCount = 0;
  
  log.info(`\n准备重命名 ${sortedDirs.length} 个文件夹...`);
  
  for (let i = 0; i < sortedDirs.length; i++) {
    const oldPath = sortedDirs[i];
    const parentDir = path.dirname(oldPath);
    const newName = String(i + 1);
    const newPath = path.join(parentDir, newName);
    
    if (await renameItem(oldPath, newPath)) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  return { success: successCount, fail: failCount };
}

/**
 * 过滤文件类型
 * @param {string[]} filePaths - 文件路径列表
 * @param {string[]} types - 文件类型数组
 * @returns {string[]} 过滤后的文件路径
 */
function filterFilesByType(filePaths, types) {
  if (!types || types.length === 0) {
    return filePaths;
  }
  
  // 处理类型：统一转为小写，合并jpg和jpeg
  const normalizedTypes = types.map(type => {
    const lowerType = type.toLowerCase();
    return lowerType === 'jpeg' ? 'jpg' : lowerType;
  });
  
  return filePaths.filter(filePath => {
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const normalizedExt = ext === 'jpeg' ? 'jpg' : ext;
    return normalizedTypes.includes(normalizedExt);
  });
}

/**
 * 重命名当前目录下的文件
 * @param {string} cmd - 命令参数
 * @param {object} options - 命令选项
 */
async function renameTools(cmd, options) {
  const { 
    prefix = 'P', 
    dir: recursive = false, 
    number = 5, 
    type: types = [],
    forceDir = false
  } = options;
  
  try {
    // 获取当前目录
    const currentDir = process.cwd();
    log.info(`当前工作目录: ${currentDir}`);
    
    // 显示处理的文件类型
    if (types && types.length > 0) {
      log.info(`只处理以下类型的文件: ${types.join(', ')}`);
    }
    
    // 获取所有文件和文件夹
    const allItems = await getAllFilesAndDirs(currentDir, recursive);
    
    // 过滤文件类型
    const filteredFiles = filterFilesByType(allItems.files, types);
    
    if (filteredFiles.length === 0 && !forceDir) {
      log.tip('没有找到符合条件的文件需要重命名');
      return;
    }
    
    // 按目录分组文件
    const filesByDir = groupFilesByDir(filteredFiles);
    
    console.log('==============================');
    
    // 开始重命名文件
    let totalSuccess = 0;
    let totalFail = 0;
    
    if (filteredFiles.length > 0) {
      log.info(`找到 ${filteredFiles.length} 个文件，分布在 ${Object.keys(filesByDir).length} 个目录中`);
      
      for (const [dirPath, filePaths] of Object.entries(filesByDir)) {
        const result = await renameFilesInDir(dirPath, filePaths, options);
        totalSuccess += result.success;
        totalFail += result.fail;
      }
    }
    
    // 重命名文件夹
    if (forceDir && allItems.dirs.length > 0) {
      const dirResult = await renameDirs(allItems.dirs);
      totalSuccess += dirResult.success;
      totalFail += dirResult.fail;
    }
    
    console.log('==============================');
    log.info(`重命名完成！总成功: ${totalSuccess} 个，总失败: ${totalFail} 个`);
    
  } catch (error) {
    log.error(`重命名过程中发生错误: ${error.message}`);
  }
}

module.exports = renameTools;