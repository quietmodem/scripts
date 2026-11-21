# 小熊油耗去开屏广告（Quantumult X）

去除小熊油耗 iOS 版的开屏广告。

## 原理

小熊油耗（包名 `com.momomobile.butterfly`，北京么么互联）的开屏广告是**三家广告 SDK 聚合投放**，广告主轮换（实测见过美团）。2026-11-21 用 Stream 抓冷启动全程（81 条连接）确认，启动后数秒内：

| SDK | 拉广告域名 | 次数 |
| --- | --- | --- |
| 快手 | `open.e.kuaishou.com` | 20 |
| 优量汇（腾讯） | `sdk.e.qq.com`、`mi.gdt.qq.com` | 12 + 7 |
| 穿山甲（Pangle） | `api-access.pangolin-sdk-toutiao.com`、`api-access.pangolin-sdk-toutiao1.com`、`webcast-open.douyin.com`（配置） | 各 1 |

外加各家的素材 CDN（`*.pglstatp-toutiao.com`、`lf-cdn-tos.bytescm.com`、`p66-ad.adkwai.com` 等）。只拦穿山甲一家不够，另外两家会自己拉到广告——这是 v1 只拦穿山甲配置接口的教训。

本插件的规则：

1. 穿山甲配置请求按 URL 中的 `package_name=com.momomobile.butterfly` 精确拦截（只作用于小熊油耗）；
2. 域名级拦三家的拉广告接口：`pangolin-sdk` 关键词、`mi.gdt.qq.com`、`sdk.e.qq.com`、`open.e.kuaishou.com`。这四个都是纯广告域名，不承载任何 App 的业务功能。

注意：QuanX 的分流规则无法按 App 区分，第 2 组规则对全机生效。已知副作用：其它 App 里"看广告领奖励"的激励视频可能加载不出来；遇到时把对应域名放行即可。

## 安装

在 Quantumult X 中添加远程重写，地址：

```
https://raw.githubusercontent.com/quietmodem/scripts/refs/heads/main/quanx/rewrite/xiaoxiong/xiaoxiong.snippet
```

并确认 MITM 已启用（snippet 末尾已带 `hostname = webcast-open.douyin.com`，QuanX 需要解密该域名才能看到完整 URL 并匹配参数）。

## 验证

添加后彻底关闭小熊油耗再重新打开，反复冷启动几次：

- 开屏广告不再出现 = 生效（第一次仍出现多半是 SDK 缓存的旧素材，再开一次即可；还不行就卸载重装清掉缓存再测）
- 若 App 启动明显变慢或卡住，把反馈发回再调整

## 说明

- 仅去除开屏广告，不修改 App 任何业务数据（油耗记录、排行等接口不在拦截范围内）
- 小熊油耗更新版本后若更换广告 SDK，本规则可能失效，需要重新抓包定位
