#!/usr/bin/env node
const os = require("os");
const process = require('child_process');


// TODO 这里同样要改成可配置的
function gitConfig(cmd, opations) {

  if (opations.get === true) {
    exec.get('name');
    exec.get('email');

  } else if (opations.my) {
    exec.set('name', 'Belial');
    exec.set('email', '102864814@qq.com');
  } else if (opations.work) {
    exec.set('name', 'hzchenpengwei');
    exec.set('email', 'hzchenpengwei@corp.netease.com');
  } else {
    console.log('2333')
  }
}
var exec = {
  set: function (type,value) {
    process.exec(`git config --global user.${type} ${value}`, (error, stdouts, stderr) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(`${type}:${value} is set success`);
      }
    });
  },
  get: function (type) {
    process.exec(`git config user.${type}`, (error, stdouts, stderr) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log(stdouts);
      }
    });
  }
}



module.exports = gitConfig;