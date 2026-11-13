# 多源更新接口模板

给你的软件加一个「GitHub 打不开也能更新」的检查接口。核心就一句话：
**`version.json` 放在多个地方，客户端按顺序试，谁先响应就用谁。**

## 1. 接入（三行）

```js
import { checkUpdate, pickDownloadUrl } from './update-check.js';

const r = await checkUpdate({ currentVersion: '1.3.0' });
if (r.hasUpdate) {
  console.log('发现新版本', r.info.version, '来源:', r.source);
  location.href = pickDownloadUrl(r.info);   // 自动挑可用的下载镜像
}
```

把 `update-check.js` 里 `DEFAULT_SOURCES` 的 `<用户名>` / `<仓库>` 换成你自己的即可。

## 2. 源怎么排（2026-11-05 实测）

| 顺序 | 源 | 取 JSON | 跨域 | 新鲜度 | 备注 |
|---|---|---|---|---|---|
| 1 | GitHub Pages `xxx.github.io/repo/version.json` | ✅ | `*` | 推送后 1~2 分钟 | 主线路，最快 |
| 2 | **GitCode API** `api.gitcode.com/api/v5/repos/{owner}/{repo}/raw/version.json?ref=main` | ✅ | **反射任意 Origin** | 实时 | 国内可直连，**最可靠的备胎** |
| 3 | jsDelivr `cdn.jsdelivr.net/gh/{owner}/{repo}@main/version.json` | ✅ | `*` | 最长 12 小时缓存 | 只能当第二备胎 |
| 4 | ghfast.top 代理 `ghfast.top/https://raw.githubusercontent.com/...` | ✅ | `*` | 实时 | 万能兜底 |

**别用 `raw.gitcode.com`**：它能返回文件，但响应里没有 `Access-Control-Allow-Origin`，网页里 `fetch` 会被浏览器拦掉。要用就用 `api.gitcode.com` 那个接口。

## 3. 三个坑

**① 缓存。** 备选源必须带时间戳（`?_t=Date.now()`），否则 CDN / 浏览器会返回旧版本，用户永远收不到更新。模板里 GitCode 源已开 `appendTimestamp`。

**② jsDelivr 的 `@main` 有缓存。** 分支引用最长 12 小时才刷新。要它当实时源，就把版本号写进路径（`@v1.3.0`），但那意味着每次发版都要改 URL —— 所以只建议当末位兜底。

**③ 下载地址也要多份。** `version.json` 里的 `downloads` 数组按镜像列出来，客户端挑第一个能用的。GitHub Releases 和 GitCode Releases 可以放同一个安装包（两边都传一份，字节完全一致）。

## 4. 怎么验证一次

```bash
# 看状态码 + 跨域头，重点是有没有 Access-Control-Allow-Origin
curl -sI -H "Origin: https://example.com" "你的源地址" | grep -Ei "HTTP/|access-control|content-type"
```

有 `Access-Control-Allow-Origin`（`*` 或回显你的 Origin）才算能用。

## 5. 顺带

- GitCode 的 Release 附件也能放安装包，下载直链形如
  `https://gitcode.com/{owner}/{repo}/releases/download/{tag}/{文件名}`
- GitCode API 匿名访问有频率限制，别把轮询间隔设得太短（建议 ≥ 1 小时一次，或只在用户手动点「检查更新」时查）。
