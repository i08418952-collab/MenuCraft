/* QR kutubxonasi: asosiy CDN ishlamasa, zaxira CDN ishlatiladi */
/* QR kutubxonasi: asosiy CDN ishlamasa, zaxira CDN ishlatiladi */
(function(){
  var urls=['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js','https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'];
  window.__qrReady=new Promise(function(res){
    (function next(i){
      if(window.qrcode||i>=urls.length){res(!!window.qrcode);return}
      var s=document.createElement('script');s.src=urls[i];
      s.onload=function(){res(!!window.qrcode)};
      s.onerror=function(){next(i+1)};
      document.head.appendChild(s);
    })(0);
  });
})();
