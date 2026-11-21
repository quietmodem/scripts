# 小熊油耗去开屏广告（Quantumult X）

去除小熊油耗 iOS 版的开屏广告。

## 原理

小熊油耗（包名 `com.momomobile.butterfly`，北京么么互联）的开屏广告由内嵌的穿山甲（Pangle）SDK 投放，广告主轮换（实测见过美团）。App 启动时 SDK 会先请求自己的配置接口：

```
https://webcast-open.douyin.com/webcast/openapi/pangle/setting/?app_id=374059&package_name=com.momomobile.butterfly&device_platform=ios
```

本插件按 URL 中的 `package_name=com.momomobile.butterfly` 精确匹配，只拦小熊油耗这一份 SDK 配置请求，返回空响应使 SDK 拿不到投放配置。`webcast-open.douyin.com` 同时是抖音等 App 的正常接口，规则不按域名整段拦截，不影响其它 App。

## 安装

在 Quantumult X 中添加远程重写，地址：

```
https://raw.githubusercontent.com/quietmodem/scripts/refs/heads/main/quanx/rewrite/xiaoxiong/xiaoxiong.snippet
```

并确认 MITM 已启用（snippet 末尾已带 `hostname = webcast-open.douyin.com`，QuanX 需要解密该域名才能看到完整 URL 并匹配参数）。

## 验证

添加后彻底关闭小熊油耗再重新打开，反复冷启动几次：

- 开屏广告不再出现 = 生效（第一次仍出现多半是本地缓存的旧素材，再开一次即可）
- 若 App 启动明显变慢或卡住，把反馈发回，改用 reject 方式再试
- 若广告仍稳定出现，说明 SDK 用了缓存配置或备用接口，需要再抓一次包看它的广告请求接口

## 说明

- 仅去除开屏广告，不修改 App 任何业务数据（油耗记录、排行等接口不在拦截范围内）
- 小熊油耗更新版本后若更换广告 SDK 或包名，本规则会失效，需要重新抓包定位
