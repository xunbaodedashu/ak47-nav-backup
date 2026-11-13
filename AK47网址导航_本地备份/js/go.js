/**
 * AK47网址导航 外链跳转安全提示脚本 (已去混淆 & 移除域名锁)
 */
var query = window.location.search.substring(1).replace("target=", "");
var goUrl = "./index.html";
if (query) {
  try {
    var queryUrl = decodeURIComponent(window.atob(query));
    goUrl = queryUrl;
    document.getElementById("goBtn").href = queryUrl;
    document.querySelector(".urlColor").textContent = queryUrl;
  } catch (e) {}
} else {
  document.getElementById("goBtn").href = "./index.html";
}

function CheckGoUrl() {
  if (document.getElementById("isOk").checked) {
    document.location.href = goUrl;
    return true;
  } else {
    alert("请先打钩左侧【本人已知晓风险】项!");
    return false;
  }
}
