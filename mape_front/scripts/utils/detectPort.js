

'use strict';

var net = require('net');

var inject = function(port) {
  var options = global.__detect ? global.__detect.options : {};

  if (options.verbose) {
    console.log('port %d was occupied', port);
  }
};

function detect(port, fn) {

  var _detect = function(port) {
    return new Promise(function(resolve, reject) {
      var socket = new net.Socket();
      socket.once('error', function() {
        socket.removeAllListeners('connect');
        socket.removeAllListeners('error');
        socket.end();
        socket.destroy();
        socket.unref();
        var server = new net.Server();
        server.on('error', function() {
          inject(port);
          port++;
          resolve(_detect(port));
        });

        server.listen(port, function() {
          server.once('close', function() {
            resolve(port);
          });
          server.close();
        });
      });
      socket.once('connect', function() {
        inject(port);
        port++;
        resolve(_detect(port));
        socket.removeAllListeners('connect');
        socket.removeAllListeners('error');
        socket.end();
        socket.destroy();
        socket.unref();
      });
      socket.connect({
        port: port
      });
    });
  }

  var _detect_with_cb = function(_fn) {
    _detect(port)
      .then(function(result) {
        _fn(null, result);
      })
      .catch(function(e) {
        _fn(e);
      });
  };

  return fn ? _detect_with_cb(fn) : _detect(port);
}

module.exports = detect;
