os = require("os");

function aa (cmd, opations) {
  // console.log(opations.ip)
  // console.log(123);
  // if (opations.ip === true) {
    var hostName = os.hostname();
    var ifaces = os.networkInterfaces();
    var ip = [];
    for (var x in ifaces) {

      for (var y in ifaces[x]) {
        var object = ifaces[x][y];
        if (object["family"] === 'IPv4') {
          ip.push(object.address);
        }
      }

    }
    var json = {
      ip: ip,
      host: hostName,
      system: os.type(),
      release: os.release(),

    };

    return console.log( JSON.stringify(json) );
  // } else {
  //   console.log('123')
  // }

}

module.exports = aa;