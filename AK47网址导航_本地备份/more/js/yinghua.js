// 保护代码
// 字符串转ASCII码-十进制
// https://www.asciim.cn/m/tools/convert_string_to_ascii.html
!(function () {
  var local = window.location.host;
  if (local.indexOf("127.0.0.1") === -1) {
    var host_arr = [97, 107, 52, 55, 115, 46, 99, 110]; // ak47s.cn
    var http_arr = [104, 116, 116, 112, 115, 58, 47, 47]; // https://
    var my_url = [];
    var my_http = [];
    for (var item in host_arr) {
      my_url.push(String.fromCharCode(host_arr[item]));
    }
    for (var item in http_arr) {
      my_http.push(String.fromCharCode(http_arr[item]));
    }
    if (local.indexOf(my_url.join("")) === -1) {
      location.href = my_http.join("") + my_url.join("") + "/";
    }
  } else {
    console.log(
      "%c 本地调试模式打开 ",
      "color:white;background:#6ba263;padding:8px 0;"
    );
  }
})();
// time
var time = document.querySelector("#time");
time.innerHTML = "00:00:00";
setInterval(function () {
  var dd = new Date();
  var hh = dd.getHours();
  var mm = dd.getMinutes();
  var ss = dd.getSeconds();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  time.innerHTML = hh + ":" + mm + ":" + ss;
}, 500);
