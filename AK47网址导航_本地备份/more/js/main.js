!(function () {
  let yaerDom = document.getElementsByClassName("get-year")[0];
  let year = new Date().getFullYear();
  yaerDom.innerHTML = year;
  //   document.onselectstart = function (e) {
  //     return false;
  //   };
  //   window.onload = function () {
  //     document.onkeydown = function () {
  //       var e = window.event || arguments[0];
  //       if (e.keyCode == 123) {
  //         return false;
  //       } else if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
  //         return false;
  //       }
  //     };
  //     document.oncontextmenu = function () {
  //       return false;
  //     };
  //   };
})();
