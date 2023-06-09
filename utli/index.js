//数据加密
import CryptoJS from 'crypto-js'
function crt(msg) {
  return CryptoJS.AES.encrypt( 
    CryptoJS.enc.Utf8.parse(JSON.stringify(msg))
    , {
      sigBytes: 16,
      words: [1262761322, 1148663617, 1798521712, 1380743270]
    }, {
    iv: {
      sigBytes: 16,
      words: [859977553, 1464218166, 911756624, 1127694913]
    },
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext.toString().toUpperCase()
}

function debounce(fn, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}
export {
	crt,
	debounce
}