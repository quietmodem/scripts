# 小熊油耗去开屏广告（Quantumult X）

去除小熊油耗 iOS 版的开屏广告。

## 原理

小熊油耗（包名 `com.momomobile.butterfly`，北京么么互联）的开屏广告由**穿山甲聚合（GroMore）**统一调度，穿山甲、快手、优量汇三家 SDK 竞价投放，广告主轮换。2026-11-21 用 Stream 两次抓包（第二次开 HTTPS 解密，含响应体）确认：

- 启动先请求聚合配置 `api-access.pangolin-sdk-toutiao.com/api/ad/union/mediation/config/`，再经 `mediation/exchange/` 竞价，各家并行拉广告（穿山甲 `sdk/get_ads/`、快手 `rest/e/v3/open/univ` 等）；
- 当次开屏是**快手投放的美团外卖广告**：素材图从快手 CDN `p66-ad.adkwai.com` 下载，已从抓包中提取原图核对；
- 优量汇当次未见独立的拉广告请求（其填充走聚合交换），故未单独拦它的域名。

本插件的规则（全部在重写层，用 `reject-200` **即时空回**，不让 SDK 干等重试，避免开屏白屏——与虎扑插件不用 REJECT 干等的同一考虑）：

1. 穿山甲配置请求按 URL 中的 `package_name=com.momomobile.butterfly` 精确拦截（只作用于小熊油耗）；
2. 聚合配置与竞价交换（总开关）、穿山甲 `get_ads`、快手 `config`/`univ` 接口即时空回；
3. 素材层兜底：穿山甲素材/试玩组件、快手与优量汇的广告素材 CDN 路径一并即时空回——SDK 会在上一次运行时预取下一次的广告素材（抓包中开屏播出后仍在下载滴滴素材与试玩包），只断接口时缓存素材仍能播一两次，这层是给缓存兜底的。

影响范围：QuanX 规则无法按 App 区分，第 2 组规则对其它使用穿山甲聚合/快手广告 SDK 的 App 同样生效，但**只影响广告投放，不影响任何 App 的功能与数据**；其它 App 里"看广告领奖励"的激励视频可能因此加载不出来，遇到时把对应规则删掉即可。v2 曾用域名级全局 REJECT，因影响面大且连接被掐断会引发 SDK 重试干等，已弃用。

## 安装

在 Quantumult X 中添加远程重写，地址：

```
https://raw.githubusercontent.com/quietmodem/scripts/refs/heads/main/quanx/rewrite/xiaoxiong/xiaoxiong.snippet
```

并确认 MITM 已启用（snippet 末尾已带所需 `hostname`）。

## 验证

添加后彻底关闭小熊油耗再重新打开，反复冷启动几次：

- 开屏广告不再出现、且启动不白屏干等 = 生效。注意：SDK 会把素材（包括整套试玩广告包）缓存在 App 数据里，换规则后先**删除 App 重装**清掉存量，再测第一次启动；不清缓存时旧素材仍可能播一两次
- 若某次开屏换成优量汇投放且仍出现，需要再抓一次包定位优量汇的拉广告接口

## 说明

- 仅去除开屏广告，不修改 App 任何业务数据（油耗记录、排行等接口不在拦截范围内）
- 小熊油耗更新版本后若更换广告 SDK 或聚合方式，本规则可能失效，需要重新抓包定位
