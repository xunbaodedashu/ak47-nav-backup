$(document).ready(function () {
  var search_types = {
    types: [
      {
        name: "https://www.baidu.com/s?wd=",
        stype: "picture/baiduicon.png",
        type: "baidu",
      },
      {
        name: "http://www.google.com.hk/search?q=",
        stype: "picture/googleicon.png",
        type: "google",
      },
      {
        name: "https://cn.bing.com/search?q=",
        stype: "picture/bingicon.png",
        type: "bing",
      },
      {
        name: "https://www.sogou.com/web?query=",
        stype: "picture/sougouicon.png",
        type: "sogou",
      },
      {
        name: "https://www.so.com/s?q=",
        stype: "picture/360icon.png",
        type: "so",
      },
      {
        name: "https://lestore.lenovo.com/search?k=",
        stype: "picture/software.png",
        type: "ziyuan",
      },
      {
        name: "https://www.yinfans.me/?s=",
        stype: "picture/movie.png",
        type: "yingshi",
      },
      {
        name: "https://pclxx.yhzu.cn/index.php?r=/l&kw=",
        stype: "picture/igo.png",
        type: "acgsou",
      },
    ],
  };
  var checktype = $(".sChoiceBtn");
  var type = $(".scSmallBox");
  var seach_type = $(".scBigBox");
  var form = $("#searchCheck");
  var textb = $(".textb");
  var subb = $(".subb");
  var tbcolor = "#126AC1";
  var oSearchText = document.getElementById("search");
  var searchCheck = document.getElementById("searchCheck");
  searchCheck.addEventListener("submit", function (event) {
    var wordCheck = document.getElementsByClassName("textb")[0];
    if (wordCheck.value.length > 0) {
      window.open(
        textb[0].name +
          oSearchText.value
            .replace(/%/g, "%25")
            .replace(/#/g, "%23")
            .replace(/\+/g, "%2B")
      );
    }
    event.preventDefault();
    return false;
  });
  var selType = get_cookie("sel"),
    obj = null;
  search_types.types.forEach(function (e) {
    if (e.type == selType) {
      obj = e;
    }
  });
  if (obj != null) {
    textb.attr("name", obj.name);
    checktype.attr("src", obj.stype);
  }
  if (window.location.href.search(/ast/i) == -1) {
  }
  textb.focus();
  checktype.click(function () {
    seach_type.css({
      display: "block",
      height: 0,
    });
    seach_type.animate(
      {
        height: type.height() * type.length,
      },
      300
    );
  });
  type.click(function () {
    var type = search_types.types[$(this).index()].type,
      exp = null;
    exp = new Date();
    exp.setTime(exp.getTime() + 31536000 * 1000);
    document.cookie = "sel=" + type + ";path=/;expires=" + exp.toGMTString();
    textb.attr("name", search_types.types[$(this).index()].name);
    checktype.attr("src", search_types.types[$(this).index()].stype);
    seach_type.animate(
      {
        height: 0,
      },
      500,
      function () {
        seach_type.css({
          display: "none",
          height: 0,
        });
      }
    );
  });
  textb.focus(function () {
    seach_type.animate(
      {
        height: 0,
      },
      500,
      function () {
        seach_type.css({
          display: "none",
          height: 0,
        });
      }
    );
  });
  var textb = $(".textb");
  textb.keyup(function (event) {
    if (textb.val() == "" || textb.val() == " ") {
      return;
    }
    if (
      event.which != 39 &&
      event.which != 40 &&
      event.which != 37 &&
      event.which != 38 &&
      event.which != 13
    )
      $.ajax({
        url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
        type: "GET",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        async: false,
        timeout: 5000,
        data: {
          wd: textb.val(),
          cb: "keydata",
        },
        success: function (json) {},
        error: function (xhr) {
          return;
        },
      });
  });
});

function get_cookie(Name) {
  var search = Name + "=";
  var returnvalue = "";
  if (document.cookie.length > 0) {
    sd = document.cookie.indexOf(search);
    if (sd != -1) {
      sd += search.length;
      end = document.cookie.indexOf(";", sd);
      if (end == -1) end = document.cookie.length;
      returnvalue = unescape(document.cookie.substring(sd, end));
    }
  }
  return returnvalue;
}

function keydata(keys) {
  var len = keys.s.length;
  var keywordbox = $(".keyword");
  var textb = $(".textb");
  var subb = $(".subb");
  var oBg = document.getElementById("blackBg");
  if (window.location.href.search(/ji/i) == -1) {
  }
  var searchCheck = document.getElementById("searchCheck");
  subb.fadeIn(500);
  $("#searchBox").animate(
    {
      opacity: 1,
    },
    500
  );
  if (len == 0) {
    keywordbox.css({
      display: "none",
    });
  } else {
    keywordbox.css({
      display: "block",
    });
  }
  if (window.location.href.search(/\.c/i) != -1) {
    if (window.location.href.search(/anf/i) == -1) {
    }
  } else if (window.location.href.search(/\.n/i) != -1) {
    if (window.location.href.search(/ian/i) == -1) {
    }
  }
  var spans = "";
  for (var i = 0; i < len; i++) {
    spans += "<span>" + keys.s[i] + "</span>";
  }
  keywordbox.html(spans);
  keywordbox.animate(
    {
      height: (keywordbox.children().height() + 1) * len,
    },
    100
  );
  searchCheck.style.borderBottomLeftRadius = "0px";
  searchCheck.style.borderBottomRightRadius = "0px";
  if (spans) {
    searchCheck.style.borderBottomLeftRadius = "0px";
    searchCheck.style.borderBottomRightRadius = "0px";
  } else {
    searchCheck.style.borderBottomLeftRadius = "4px";
    searchCheck.style.borderBottomRightRadius = "4px";
  }
  var searchCheck = document.getElementById("searchCheck");
  keywordbox.children().click(function () {
    textb.val($(this).html());
    searchCheck.style.borderBottomLeftRadius = "4px";
    searchCheck.style.borderBottomRightRadius = "4px";
    keywordbox.animate(
      {
        height: 0,
      },
      10,
      function () {
        keywordbox.css({
          display: "none",
          height: "auto",
        });
        keywordbox.empty();
      }
    );
    textb.focus();
    var oSearchText = document.getElementById("search");
    if (textb[0].value) {
      window.open(
        textb[0].name +
          oSearchText.value
            .replace(/%/g, "%25")
            .replace(/#/g, "%23")
            .replace(/\+/g, "%2B")
      );
    }
  });
  subb.focus(function () {
    searchCheck.style.borderBottomLeftRadius = "4px";
    searchCheck.style.borderBottomRightRadius = "4px";
    keywordbox.animate(
      {
        height: 0,
      },
      10,
      function () {
        keywordbox.css({
          display: "none",
          height: "auto",
        });
        keywordbox.empty();
      }
    );
  });
  var numspan = 0;
  textb.keydown(function (event) {
    if (event.which == 13) {
      searchCheck.style.borderBottomLeftRadius = "4px";
      searchCheck.style.borderBottomRightRadius = "4px";
      keywordbox.animate(
        {
          height: 0,
        },
        10,
        function () {
          keywordbox.css({
            display: "none",
            height: "auto",
          });
          keywordbox.empty();
        }
      );
    }
    if (event.which == 40) {
      if (numspan == len) numspan = 0;
      for (var i = 0; i < len; i++) {
        if (numspan == i) {
          keywordbox.children().eq(i).css({
            "background-color": "#f1f1f1",
          });
        } else {
          keywordbox.children().eq(i).css({
            "background-color": "rgba(255,255,255,0.3)",
          });
        }
      }
      textb.val(keywordbox.children().eq(numspan).html());
      numspan++;
    }
    if (event.which == 38) {
      numspan--;
      if (numspan == len) numspan = 0;
      for (var i = 0; i < len; i++) {
        if (numspan == i) {
          keywordbox.children().eq(i).css({
            "background-color": "#f1f1f1",
          });
        } else {
          keywordbox.children().eq(i).css({
            "background-color": "rgba(255,255,255,0.3)",
          });
        }
      }
      textb.val(keywordbox.children().eq(numspan).html());
    }
  });
  keywordbox.children().mouseover(function () {
    numspan = $(this).index();
    for (var i = 0; i < len; i++) {
      if (numspan == i) {
        keywordbox.children().eq(i).css({
          "background-color": "#f1f1f1",
        });
      } else {
        keywordbox.children().eq(i).css({
          "background-color": "rgba(255,255,255,0.3)",
        });
      }
    }
  });
  var oBg = document.getElementsByTagName("body")[0];
  var oSearch = document.getElementById("search");
  oBg.onclick = function () {
    keywordbox.animate(
      {
        height: 0,
      },
      10,
      function () {
        keywordbox.css({
          display: "none",
          height: "auto",
        });
        keywordbox.empty();
      }
    );
  };
  oSearch.onclick = function (ev) {
    var oEvent = ev || event;
    oEvent.cancelBubble = true;
  };
}
