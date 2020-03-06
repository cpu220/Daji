 
const os = require("os");

function ipTools (cmd, opations) {
 
    const hostName = os.hostname();
    const ifaces = os.networkInterfaces();
    const ipv4 = [];
    const ipv6=[];
    for (var x in ifaces) {

      for (var y in ifaces[x]) {
        var object = ifaces[x][y];
         
        if (object["family"] === 'IPv4') {
          ipv4.push(object.address);
        } else if (object["family"] === 'IPv6'){
          ipv6.push(object.address);
        }
      }

    }
    var json = {
      ipv4,
      ipv6,
      hostName,
      system: os.type(),
      release: os.release(),

    };

    return console.log( JSON.stringify(json,'',4) );
   
}

module.exports = ipTools;