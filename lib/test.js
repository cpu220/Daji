// #!/usr/bin/env node

// const dns = require("dns");

// function testTools(cmd, opations) {

//   dns.lookup('pub.mail.163.com', (err, address, family) => {
//     console.log('IP 地址: %j 地址族: IPv%s', address, family);
//   })

// }

// module.exports = testTools;

const process = require('child_process');
	process.exec(`xcrun instruments -w`);
// console.log(a);