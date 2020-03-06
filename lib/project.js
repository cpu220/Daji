#!/usr/bin/env node

// 此功能作废，考虑到现如今脚手架泛滥，没必要再做个轮子出来
const inquirer = require('inquirer');
const process = require('child_process');

const list=[{
	type:'list',
	name:'project',
	message:'选择创建项目类型',
	choices:[
		'HTML5',
		'PC'
	]
},{
	type:'list',
	name:'frame',
	message:'选择使用的框架',
	choices:[
		'jQuery',
		'Zepto',
		'WEEX',
		'React',
		'VUE'
	]
}];


module.exports = function(cmd,options){

	if(options.init === true){
		inquirer.prompt(list).then(function (answers) {
		   console.log(answers);
			 if(answers.project === 'HTML5'){
				 if(answers.frame === 'VUE'){
					 console.log('开始创建工程');
					//  process.exec('git clone git@git.coding.net:q25865/wechat-mall.git'); 

				 }
			 }else if(answers.frame === 'PC'){
				 console.log('待更新');
			 }else{
				 console.log('待更新');
			 }
	  });
	}else if(options.test){
		console.log('测试代码');
	}else{
		console.log('没有参数');
	}
}
