#!/usr/bin/env node

const inquirer = require('inquirer');
const process = require('child_process');
const common = require('../common/index');



const openIphone = (cb) => {
	common.getIphoneList().then(data => {
		const list = [{
			type: 'list',
			name: 'iphone',
			message: 'choose a iphone',
			choices: data,
			filter: function (val) {
				return val;
			}
		}];
		inquirer.prompt(list).then(function (answers) {
			process.exec(`xcrun instruments -w '${answers.iphone}'`, (error, stdout, stderr) => {
				if (!!cb) {
					cb();
				}
			});
		});
	});
}


module.exports = function(cmd, options) {

	if (options.init === true) {
		openIphone();
		// inquirer.prompt(list).then(function(answers) {
		// 	// console.log(answers.iphone);
		// 	process.exec(`xcrun instruments -w '${answers.iphone}'`);
		// });
	} else {
		console.log('试一下 -i')
	}
}
