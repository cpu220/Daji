const question = require('./question');
const utilsModule = require('../../utils/lib/common/utils');
const process = require('child_process');

color = require('colors-cli/toxic');

const log = utilsModule.msg;

class common {
  constructor() {
    // 简化构造函数，只保留必要的绑定
  }

  // 根据设备名称打开模拟器
  openIphoneByName(deviceName, cb) {
    if (!deviceName) {
      console.error('设备名称不能为空');
      if (cb) {
        cb();
      }
      return;
    }
    
    // 先获取设备UDID
    process.exec(`xcrun simctl list devices --json`, (err, stdout, stderr) => {
      if (err) {
        console.error('获取设备UDID失败:', err);
        if (cb) {
          cb();
        }
        return;
      }
      
      try {
        const devicesData = JSON.parse(stdout);
        let deviceUDID = null;
        
        // 遍历所有设备类型，找到匹配的设备
        Object.keys(devicesData.devices).forEach(deviceType => {
          const devices = devicesData.devices[deviceType];
          devices.forEach(device => {
            // 检查设备是否可用，没有availabilityError，并且名称包含输入的设备名（支持模糊匹配）
            if (device.isAvailable === true && 
                !device.availabilityError &&
                device.name.includes(deviceName)) {
              deviceUDID = device.udid;
            }
          });
        });
        
        if (!deviceUDID) {
          console.error(`未找到设备 ${deviceName} 的UDID`);
          if (cb) {
            cb();
          }
          return;
        }
        
        // 启动模拟器
        process.exec(`xcrun simctl boot ${deviceUDID}`, (bootErr, bootStdout, bootStderr) => {
          if (bootErr) {
            console.error('启动模拟器失败:', bootErr);
            if (cb) {
              cb();
            }
            return;
          }
          
          // 打开模拟器应用
          process.exec(`open -a Simulator`, (openErr, openStdout, openStderr) => {
            console.log('\n== 正在启动模拟器 == \n'.x34)
            if (cb) {
              cb();
            }
          });
        });
      } catch (parseError) {
        console.error('解析设备列表失败:', parseError);
        if (cb) {
          cb();
        }
      }
    });
  }

  // 打开iphone（交互式选择设备）
  openIphone(cb) {
    // 选择设备
    question.chooseDevice((answers) => {
      const deviceNameWithRuntime = answers.iphone;
      
      if (!deviceNameWithRuntime) {
        console.error('未选择设备或设备不可用');
        if (cb) {
          cb();
        }
        return;
      }
      
      // 从设备名称中提取纯设备名，例如从 "iPad Air 11-inch (M3) (iOS-26-0)" 提取 "iPad Air 11-inch (M3)"
      // 使用正则表达式匹配最后一个括号部分，例如 " (iOS-26-0)"
      const deviceName = deviceNameWithRuntime.replace(/\s*\(iOS-\d+-\d+\)\s*$/, '');
      
      // 调用根据名称启动模拟器的方法
      this.openIphoneByName(deviceName, cb);
    });
  }
  async openUrl(url, cb) {
    const _this = this;
    
    try {
      const result = await new Promise((resolve, reject) => {
        process.exec(`xcrun simctl openurl booted '${url}'`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });
      
      log.success('== success ==');
      if (cb) {
        cb();
      }
      return result;
    } catch (error) {
      if (error.code === 163 || error.message.includes('No devices are booted')) {
        // 模拟器还未启动，尝试启动一次
        log.info('启动模拟器');
        
        let deviceStarted = false;
        await new Promise((resolve) => {
          _this.openIphone(() => {
            // 检查设备是否真正启动
            process.exec(`xcrun simctl list devices booted --json`, (err, stdout, stderr) => {
              if (!err) {
                try {
                  const bootedDevices = JSON.parse(stdout);
                  let hasBootedDevice = false;
                  
                  Object.keys(bootedDevices.devices).forEach(deviceType => {
                    if (bootedDevices.devices[deviceType].length > 0) {
                      hasBootedDevice = true;
                    }
                  });
                  
                  deviceStarted = hasBootedDevice;
                } catch (parseError) {
                  console.error('解析已启动设备列表失败:', parseError);
                }
              }
              resolve();
            });
          });
        });
        
        if (deviceStarted) {
          // 设备已启动，再次尝试打开URL
          return _this.openUrl(url, cb);
        } else {
          // 设备未启动成功，返回错误
          log.error('== 无法启动模拟器设备 ==');
          log.error('请确保已安装Xcode并创建了可用的模拟器设备');
          if (cb) {
            cb(new Error('无法启动模拟器设备'));
          }
          return;
        }
      } else {
        log.error('== 打开URL失败 ==');
        log.error(error);
        if (cb) {
          cb(error);
        }
        return;
      }
    }
  }
}

module.exports = new common();