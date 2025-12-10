/*
 * 通用方法合集
 */
const msg = require('./msgColor');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const process = require('child_process');

const common = function () {

}

// 文件处理
common.prototype.file = {
  // 追加文件内容
  set: async function (file, message) {
    const dir = path.resolve(__dirname, file);
    await fs.appendFile(dir, message);
  },
  
  // 写入文件内容（覆盖）
  reset: async function (file, message) {
    const dir = path.resolve(__dirname, file);
    await fs.writeFile(dir, message, 'utf8');
  },

  // 读取文件内容
  read: async function (file) {
    const dir = path.resolve(__dirname, file);
    return await fs.readFile(dir, 'utf8');
  },
  
  // 读取目录内容
  readdir: async function (dirPath) {
    return await fs.readdir(dirPath);
  },
  
  // 同步读取目录内容
  readdirSync: function (dirPath) {
    return fsSync.readdirSync(dirPath);
  },

  // 获取指定目录下指定文件合集
  getFile: async function (root, fileType) {
    const files = await fs.readdir(root);
    return files.filter((name) => {
      const arr = name.split('.');
      return fileType.includes(arr[arr.length - 1]);
    });
  },
  
  // 打开文件
  open: async function (file) {
    await fs.open(file, 0o666);
  },
  
  // 创建文件
  async create(file, message) {
    const array = file.split('/');
    const name = array[array.length - 1];
    
    if (name.indexOf('.') < 0) {
      console.error('当前目录地址格式错误');
      return false;
    }

    const root = file.substring(0, file.indexOf(name));
    
    try {
      // 检查文件是否存在
      await fs.access(file);
      console.error(`${file}对应目录文件已存在,创建失败`);
    } catch (err) {
      // 文件不存在，创建目录和文件
      await fs.mkdir(root, { recursive: true });
      await this.reset(file, message);
    }
  },
  
  // 创建目录
  mkdirSync: function (root) {
    try {
      fsSync.mkdirSync(root, { recursive: true });
    } catch (err) {
      // 目录已存在，忽略错误
    }
  },
  
  // 判断文件是否存在 
  hasFile: async (obj) => {
    try {
      return await fs.stat(obj.path);
    } catch (err) {
      throw err;
    }
  },
  
  // 读取文件
  readFile: async (obj) => {
    let dir = obj.path;
    if (obj.isAbsolute) {
      dir = path.resolve(__dirname, obj.path);
    }
    return await fs.readFile(dir, obj.encode || 'utf8');
  },

};

// json 处理
common.prototype.JSON = {
  get: function (file) {
    const dir = path.resolve(__dirname, file);
    const fileStr = fsSync.readFileSync(dir, 'utf8');
    return JSON.parse(fileStr);
  }
};

// 工具类
common.prototype.tools = {
  formatDate: function (date, type, format) {
    const arr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    const D = date.getDate(),
      M = date.getMonth() + 1,
      Y = date.getFullYear(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();

    const _date = `${Y}-${arr[M] || M}-${arr[D] || D}`.split('-').join(format),
      _time = `${arr[h] || h}:${arr[m] || m}:${arr[s] || s}`
    return {
      date: _date,
      time: _time,
      fullDate: `${_date} ${_time}`
    };
  },
  formatData: function (obj, type) {
    const _this = this,
      data = decodeURI(obj.toString());
    if (type === 'json') {
      data = _this.dataToObj(data);
    }
    return data;
  },
  dataToObj: function (url) {
    var obj = {};
    var keyvalue = [];
    var key = '',
      value = '';

    var paraString = url.substring(0, url.length).split('&');
    for (var i in paraString) {
      keyvalue = paraString[i].split('=');
      key = keyvalue[0];
      value = keyvalue[1];
      obj[key] = value;
    }
    return JSON.stringify(obj);
  },
  getDir: function () {
    return new Promise((resolve, reject) => {
      process.exec(`pwd`, (err, stdout, stderr) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      })
    });
  }
};

common.prototype.template = {
  templateReg: /\{\{(.*?)\}\}/g,
  render: function (template, context) {
    reg = this.templateReg;
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const arr = key.split('.'); // 判断是否携带功能参数
      let str = '';
      const _key = arr[0]
      if (arr.length > 1) {
        const type = arr[1];
        const _val = context[_key];
        if (type === 'encode') {
          str = encodeURIComponent(_val);
        } else if (type === 'decode') {
          str = decodeURIComponent(_val);
        }
      } else {
        str = context[_key];
      }
      return str;
    });
  },
  getTemplateKey: function (template) {
    reg = this.templateReg;
    const str = reg.exec(template)[1];
    if (str.indexOf('.')) {
      return str.split('.')[0]
    } else {
      return str;
    }
  }
}

// 打印日志
common.prototype.msg = msg;

const utils = new common();
module.exports = utils;