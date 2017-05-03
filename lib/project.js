#!/usr/bin/env node

const inquirer = require('inquirer');
const process = require('child_process');

const list=[{
	type:'list',
	name:'project',
	message:'which project you want to create',
	choices:[
		'HTML5',
		'PC'
	]
},{
	type:'list',
	name:'frame',
	message:'choose a frame you want to use',
	choices:[
		'jQuery',
		'Zepto',
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
