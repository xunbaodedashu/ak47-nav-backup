/**
 * 多源更新检查 —— GitHub 打不开时自动切备用源
 *
 * 设计原则：
 *   1. 只依赖 fetch + JSON，没有任何第三方库；
 *   2. 每个源都有超时，逐个尝试，第一个解析成功且带 version 字段的胜出；
 *   3. 源列表是数据，不是代码，加一个备用源 = 往数组里加一行。
 *
 * 用法：
 *   import { checkUpdate } from './update-check.js';
 *   const r = await checkUpdate({ currentVersion: '1.3.0' });
 *   if (r.hasUpdate) showUpdateDialog(r.info, r.downloadUrl);
 */

/** 默认候选源：按顺序尝试，成功即停。name 只用于日志/上报。 */
export const DEFAULT_SOURCES = [
  {
    name: 'github-pages',
    url: 'https://<用户名>.github.io/<仓库>/version.json',
  },
  {
    // 国内直连可用；带 ?t= 时间戳绕过 CDN 缓存，永远拿到最新
    name: 'gitcode',
    url: 'https://api.gitcode.com/api/v5/repos/<用户名>/<仓库>/raw/version.json?ref=main',
    appendTimestamp: true,
  },
  {
    // jsDelivr 走 CDN，@main 有最长 12 小时缓存，只适合当第二备胎
    name: 'jsdelivr',
    url: 'https://cdn.jsdelivr.net/gh/<用户名>/<仓库>@main/version.json',
  },
  {
    // 万能代理：把任意 raw.githubusercontent 地址套上即可
    name: 'ghproxy',
    url: 'https://ghfast.top/https://raw.githubusercontent.com/<用户名>/<仓库>/main/version.json',
  },
];

const DEFAULT_TIMEOUT = 6000;

async function fetchJson(url, { timeout = DEFAULT_TIMEOUT, appendTimestamp = true } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    // 加时间戳避免浏览器 / 中间层缓存旧版本
    const finalUrl = appendTimestamp
      ? url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
      : url;
    const res = await fetch(finalUrl, {
      signal: ctrl.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json,text/plain,*/*' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    // 有的源返回 application/octet-stream，但正文仍是 JSON，所以直接 parse 文本
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

/** 语义化版本比较：remote > current 返回 true。只处理 1.2.3 这种数字段。 */
export function isNewer(remote, current) {
  const a = String(remote || '').replace(/^v/i, '').split(/[.-]/).map(Number);
  const b = String(current || '').replace(/^v/i, '').split(/[.-]/).map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (Number.isNaN(x) || Number.isNaN(y)) break;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

/**
 * 尝试所有源，返回第一个成功的结果。
 * @returns {{info: object, source: string, failed: Array<{name: string, error: string}>}}
 */
export async function fetchVersionInfo(sources = DEFAULT_SOURCES, { onSourceFail } = {}) {
  const failed = [];
  for (const src of sources) {
    try {
      const info = await fetchJson(src.url, src);
      if (!info || !info.version) throw new Error('响应缺少 version 字段');
      if (failed.length) {
        console.info('[update] 已降级到备用源:', src.name, '（前面失败的:', failed.map((f) => f.name).join(',') + '）');
      }
      return { info, source: src.name, failed };
    } catch (e) {
      const err = String((e && e.message) || e);
      failed.push({ name: src.name, error: err });
      if (onSourceFail) onSourceFail(src, err);
    }
  }
  throw new Error('所有更新源都不可用: ' + JSON.stringify(failed));
}

/**
 * 选下载地址：优先用当前源的同类镜像，其次按 info.downloads 顺序挑第一个 http(s) 的。
 * version.json 里建议写成：
 *   "downloads": [
 *     { "name": "github",  "url": "https://github.com/.../releases/download/v1.3.0/xxx.apk" },
 *     { "name": "gitcode", "url": "https://gitcode.com/.../releases/download/v1.3.0/xxx.apk" }
 *   ]
 */
export function pickDownloadUrl(info, preferredNames = ['gitcode', 'github']) {
  const list = Array.isArray(info && info.downloads) ? info.downloads : [];
  for (const want of preferredNames) {
    const hit = list.find((d) => d.name === want && d.url);
    if (hit) return hit.url;
  }
  // 兼容老格式
  if (info && info.apkUrl) return info.apkUrl;
  const any = list.find((d) => d.url);
  return any ? any.url : '';
}

/** 一步到位：检查 + 判断是否有新版 + 选出下载地址 */
export async function checkUpdate({ currentVersion, sources = DEFAULT_SOURCES, onSourceFail } = {}) {
  const { info, source, failed } = await fetchVersionInfo(sources, { onSourceFail });
  const hasUpdate = isNewer(info.version, currentVersion);
  return {
    hasUpdate,
    info,
    source,
    failed,
    downloadUrl: hasUpdate ? pickDownloadUrl(info) : '',
  };
}
