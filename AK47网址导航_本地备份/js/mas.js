/**
 * AK47网址导航 主页核心交互脚本 (已去混淆 & 移除域名锁 & 本地化资源)
 */
var timer = null;
var sxText = document.querySelector(".sx-text");
var sxClear = document.querySelector(".search-clear");
var autocomplete = document.querySelector(".autocomplete-container");
var suggest = document.querySelector(".addsuggest");
var stypelist = document.querySelector(".s-type-list");

(function () {
  // 移动端设备自适应跳转相对路径 ./m/index.html
  var mobileAgents = ["iPhone", "Android", "Windows Phone"];
  var ua = window.navigator.userAgent;
  for (var i = 0; i < mobileAgents.length; i++) {
    if (ua.indexOf(mobileAgents[i]) !== -1) {
      window.location.href = "./m/index.html";
      break;
    }
  }

  if (sxText) {
    sxText.onblur = function () {
      setTimeout(function () {
        if (autocomplete) autocomplete.style.display = "none";
      }, 200);
    };
  }
})();

function searchExpand() {
  if (stypelist) stypelist.style.display = "block";
}

function mouseover() {
  if (stypelist) stypelist.style.display = "block";
}

function mouseout() {
  if (stypelist) stypelist.style.display = "none";
}

function onInput() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(function () {
    fetchAssociationalWord();
  }, 500);
}

function moreWeather() {
  window.open("https://tianqi.qq.com/", "_blank");
}

function onClear() {
  if (sxText) {
    sxText.value = "";
    sxText.focus();
  }
  if (sxClear) sxClear.style.display = "none";
  if (autocomplete) autocomplete.style.display = "none";
}

function fetchAssociationalWord() {
  if (!sxText) return;
  var val = sxText.value;
  if (val.length) {
    if (sxClear) sxClear.style.display = "block";
    $.ajax({
      url:
        "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd=" +
        encodeURIComponent(val),
      type: "GET",
      dataType: "jsonp",
      success: function (res) {
        if (autocomplete) autocomplete.style.display = "block";
        var html = "";
        if (res && res.g) {
          res.g.forEach(function (item, idx) {
            html +=
              '<li><i class="auto-raq auto-1">' +
              (idx + 1) +
              "</i><span>" +
              item.q +
              "</span></li>";
          });
          suggest.innerHTML = html;
          setInput();
        } else {
          suggest.innerHTML =
            '<li><span style="margin-left:200px">T_T暂无搜索词联想结果T_T</span></li>';
        }
      },
      error: function (err) {
        if (autocomplete) autocomplete.style.display = "none";
      },
    });
  } else {
    if (sxClear) sxClear.style.display = "none";
    if (autocomplete) autocomplete.style.display = "none";
  }
}

var index = -1;
if (sxText) {
  sxText.onkeydown = function (e) {
    var items = suggest ? suggest.childNodes : [];
    items.forEach(function (node, i) {
      if (items[i] && items[i].style) {
        items[i].style.backgroundColor = "#fff";
      }
    });
    if (e.keyCode === 8 && items.length) {
      index = -1;
    }
    if (e.keyCode === 40 && items.length) {
      index < items.length - 1 ? ++index : (index = 0);
      if (items[index] && items[index].childNodes[1]) {
        items[index].style.backgroundColor = "#E5E8E8";
        sxText.value = items[index].childNodes[1].innerText;
      }
    }
    if (e.keyCode === 38 && items.length) {
      index > 0 ? --index : (index = items.length - 1);
      if (items[index] && items[index].childNodes[1]) {
        items[index].style.backgroundColor = "#E5E8E8";
        sxText.value = items[index].childNodes[1].innerText;
      }
    }
    if (e.keyCode === 13) {
      if (autocomplete) autocomplete.style.display = "none";
    }
  };
}

function setInput() {
  var items = suggest ? suggest.childNodes : [];
  items.forEach(function (node, idx) {
    items[idx].onclick = function () {
      var allItems = suggest.childNodes;
      allItems.forEach(function (n, j) {
        allItems[j].style.backgroundColor = "#fff";
      });
      allItems[idx].style.backgroundColor = "#E5E8E8";
      sxText.value = items[idx].childNodes[1].innerText;
    };
  });
}

// 超级搜索栏初始化与分类切换
(function () {
  var radios = document.querySelectorAll('input[name="type"]');
  var form = document.querySelector("#super-search-fm");
  var input = document.querySelector("#search-text");
  var blankCheckbox = document.querySelector("#set-search-blank");
  var groups = document.querySelectorAll(".search-group");
  var currentRadio = radios[0];

  function getStore(key) {
    try {
      return window.localStorage.getItem("superSearch" + key);
    } catch (e) {
      return null;
    }
  }

  function setStore(key, val) {
    try {
      window.localStorage.setItem("superSearch" + key, val);
    } catch (e) {}
  }

  function isNewWindow() {
    var v = getStore("newWindow");
    return v ? 1 == v : true;
  }

  function getCheckedAction() {
    var checked = document.querySelector('input[name="type"]:checked');
    return checked ? checked.value : radios[0].value;
  }

  function getCheckedPlaceholder() {
    var checked = document.querySelector('input[name="type"]:checked');
    return checked ? checked.getAttribute("data-placeholder") : "";
  }

  function updatePlaceholder(text) {
    if (input) input.setAttribute("placeholder", text);
  }

  function updateFormAction(url) {
    if (form) form.action = url;
  }

  function updateFormTarget(openInBlank) {
    if (!form) return;
    if (openInBlank) {
      form.target = "_blank";
    } else {
      form.removeAttribute("target");
    }
  }

  function activateGroup(radioEl) {
    for (var i = 0; i < groups.length; i++) {
      groups[i].classList.remove("s-current");
    }
    if (
      radioEl &&
      radioEl.parentNode &&
      radioEl.parentNode.parentNode &&
      radioEl.parentNode.parentNode.parentNode
    ) {
      radioEl.parentNode.parentNode.parentNode.classList.add("s-current");
    }
  }

  function getSavedType() {
    var saved = getStore("type");
    return saved || radios[0].value;
  }

  function initSearch() {
    if (blankCheckbox) blankCheckbox.checked = isNewWindow();
    var targetRadio = document.querySelector(
      'input[name="type"][value="' + getSavedType() + '"]'
    );
    if (targetRadio) {
      targetRadio.checked = true;
      activateGroup(targetRadio);
    }
    updatePlaceholder(getCheckedPlaceholder());
    updateFormAction(getCheckedAction());
  }

  function onRadioChange(e) {
    if (stypelist) stypelist.style.display = "none";
    currentRadio = e.target;
    updatePlaceholder(getCheckedPlaceholder());
    updateFormAction(e.target.value);
    setStore("type", e.target.value);
    if (input) input.focus();
    activateGroup(e.target);
  }

  function onBlankChange(e) {
    setStore("newWindow", e.target.checked ? 1 : -1);
    updateFormTarget(e.target.checked);
  }

  function onFormSubmit(e) {
    if (autocomplete) autocomplete.style.display = "none";
    e.preventDefault();
    if (!input || input.value === "") {
      if (input) input.focus();
      return false;
    }
    updateFormAction(getCheckedAction() + input.value);
    updateFormTarget(isNewWindow());
    if (isNewWindow()) {
      window.open(form.action, +new Date());
    } else {
      location.href = form.action;
    }
  }

  initSearch();
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", onRadioChange);
  }
  if (blankCheckbox) {
    blankCheckbox.addEventListener("change", onBlankChange);
  }
  if (form) {
    form.addEventListener("submit", onFormSubmit);
  }
})();

// 常用站点展开/收起开关（使用本地化图标 ./img/switch_on.png 和 ./img/switch_off.png）
var swith = document.querySelector(".kai");
var unitInfo = null;
try {
  unitInfo = localStorage.getItem("laoyee");
} catch (e) {}
var list = document.querySelector(".list");
var section = document.querySelector(".section");
var btntext = "";

if (swith && list && section) {
  if (unitInfo === "duang") {
    swith.style.backgroundImage = "url(./img/switch_off.png)";
    list.style.display = "none";
    section.style.borderBottom = "none";
    btntext = "展开";
  } else {
    swith.style.backgroundImage = "url(./img/switch_on.png)";
    list.style.display = "block";
    section.style.borderBottom = "solid 1px #d6d6d6";
    btntext = "关闭";
  }

  swith.onclick = function () {
    if (btntext === "展开") {
      this.style.backgroundImage = "url(./img/switch_on.png)";
      list.style.display = "block";
      section.style.borderBottom = "solid 1px #d6d6d6";
      btntext = "关闭";
      try {
        localStorage.setItem("laoyee", "happy");
      } catch (e) {}
    } else {
      this.style.backgroundImage = "url(./img/switch_off.png)";
      list.style.display = "none";
      section.style.borderBottom = "none";
      btntext = "展开";
      try {
        localStorage.setItem("laoyee", "duang");
      } catch (e) {}
    }
  };
}

// 顶部实时时钟
var time = document.querySelector("#time");
function updateClock() {
  if (!time) return;
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  time.innerHTML = h + ":" + m;
}
if (time) {
  updateClock();
  setInterval(updateClock, 1000);
  time.addEventListener("click", function () {
    window.open("https://time.is/zh/", "_blank");
  });
}

// 回到顶部猫咪按钮
var tops = document.querySelector(".tops");
var istop = true;
var scrollTimer = null;

window.onscroll = function () {
  var scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop || 0;
  if (tops) {
    if (scrollTop > 600) {
      tops.style.display = "block";
    } else {
      tops.style.display = "none";
    }
  }
  if (!istop) {
    clearInterval(scrollTimer);
  }
  istop = false;
};

function returnTop() {
  scrollTimer = setInterval(function () {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    var step = Math.floor(-scrollTop / 10);
    document.documentElement.scrollTop = document.body.scrollTop =
      scrollTop + step;
    istop = true;
    if (scrollTop === 0) {
      clearInterval(scrollTimer);
    }
  }, 30);
}

// 自定义站点导入与本地缓存管理
var dialog = document.querySelector(".dialog");
var dialogCache = null;
try {
  dialogCache = localStorage.getItem("link");
} catch (e) {}
var linkValue = "";

if (dialogCache && list) {
  list.innerHTML = dialogCache;
}

function userDiy() {
  var textarea = document.querySelector(".dialog textarea");
  if (textarea && list) {
    textarea.value = list.innerHTML;
  }
  if (dialog) {
    dialog.style.display = "block";
  }
}

function dialogClose() {
  if (dialog) {
    dialog.style.display = "none";
  }
}

function dialogSave() {
  var textarea = document.querySelector(".dialog textarea");
  if (textarea && list) {
    linkValue = textarea.value;
    try {
      localStorage.setItem("link", linkValue);
    } catch (e) {}
    list.innerHTML = linkValue;
  }
  if (dialog) {
    dialog.style.display = "none";
  }
}

function cleanCache() {
  try {
    localStorage.setItem("link", "");
  } catch (e) {}
  if (dialog) {
    dialog.style.display = "none";
  }
  window.location.reload();
}
