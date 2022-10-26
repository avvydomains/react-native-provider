const fs = require('fs')

//let ff = btoa(unescape(encodeURIComponent(fs.readFileSync('./dist/index.html', 'utf8'))))
let ff = btoa(unescape(encodeURIComponent(fs.readFileSync('./dist/webview.js', 'utf8'))))
fs.writeFileSync("./dist/index.js", `
  var cache
  var chars = {
    ascii: function () {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    },
    indices: function () {
      if (!cache) {
        cache = {};
        var ascii = chars.ascii();

        for (var c = 0; c < ascii.length; c++) {
          var chr = ascii[c];
          cache[chr] = c;
        }
      }
      return cache;
    }
  };

  function atob (b64) {
    var indices = chars.indices(),
      pos = b64.indexOf('='),
      padded = pos > -1,
      len = padded ? pos : b64.length,
      i = -1,
      data = '';

    while (i < len) {
      var code = indices[b64[++i]] << 18 | indices[b64[++i]] << 12 | indices[b64[++i]] << 6 | indices[b64[++i]];
      if (code !== 0) {
        data += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255);
      }
    }

    if (padded) {
      data = data.slice(0, pos - b64.length);
    }

    return data;
  };
` + 'module.exports=function(){return decodeURIComponent(escape(atob("' + ff + '")))}')
