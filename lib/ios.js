#!/usr/bin/env node

const inquirer = require('inquirer');
const process = require('child_process');


const list = [{
	type: 'list',
	name: 'iphone',
	message: 'choose a iphone',
	choices: [
		'iPhone 5s (11.2)',
		'iPhone 8 (11.2)',
		'iPhone 6 (11.2)',
		'iPhone 8 Plus (11.2)',
		'iPhone 7 (11.2)',
		'iPhone X (11.2)'
	],
	filter: function(val) {
		return val;
	}
}];


module.exports = function(cmd, options) {

	if (options.init === true) {
		inquirer.prompt(list).then(function(answers) {
			// console.log(answers.iphone);
			process.exec(`xcrun instruments -w '${answers.iphone}'`);
		});
	} else {
		console.log('试一下 -i')
	}
}
