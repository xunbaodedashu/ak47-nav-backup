function siteTime() {
  window.setTimeout("siteTime()", 1000);
  var seconds = 1000;
  var minutes = seconds * 60;
  var hours = minutes * 60;
  var days = hours * 24;
  var years = days * 365;
  var today = new Date();
  var todayYear = today.getFullYear();
  var todayMonth = today.getMonth() + 1;
  var todayDate = today.getDate();
  var todayHour = today.getHours();
  var todayMinute = today.getMinutes();
  var todaySecond = today.getSeconds();
  var t1 = Date.UTC("2017", "07", "12", "08", "00", "00");
  var t2 = Date.UTC(
    todayYear,
    todayMonth,
    todayDate,
    todayHour,
    todayMinute,
    todaySecond
  );
  var diff = t2 - t1;
  var diffYears = Math.floor(diff / years);
  var diffDays = Math.floor(diff / days - diffYears * 365);
  var diffHours = Math.floor(
    (diff - (diffYears * 365 + diffDays) * days) / hours
  );
  var diffMinutes = Math.floor(
    (diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes
  );
  var diffSeconds = Math.floor(
    (diff -
      (diffYears * 365 + diffDays) * days -
      diffHours * hours -
      diffMinutes * minutes) /
      seconds
  );
  document.getElementById("sitetime").innerHTML =
    " 本站已安全运行 " +
    diffYears +
    " 年 " +
    diffDays +
    " 天 " +
    diffHours +
    " 小时 " +
    diffMinutes +
    " 分 " +
    diffSeconds +
    " 秒 ";
}

!(function () {
  setTimeout(() => {
    siteTime();
  }, 500);
})();

// live2d
L2Dwidget.init({
  model: {
    //jsonpath控制显示那个小萝莉模型，
    //(切换模型需要改动)
    jsonPath:
      "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
    scale: 1,
  },
  display: {
    position: "right", //看板娘的表现位置
    width: 140, //小萝莉的宽度
    height: 280, //小萝莉的高度
    hOffset: 35,
    vOffset: -20,
  },
  mobile: {
    show: true,
    scale: 0.5,
  },
  react: {
    opacityDefault: 0.7,
    opacityOnHover: 0.2,
  },
});

// copy
document.body.oncopy = function () {
  swal("复制成功", "若要转载或引用请务必保留原文链接，并申明来源");
};
