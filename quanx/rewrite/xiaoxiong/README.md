# 小熊油耗去开屏（VIP 解锁）

小熊油耗（包名 `com.momomobile.butterfly`，北京么么互联）的开屏广告受**会员状态字段 `vip_state` 门控**：App 在启动时查询会员状态，当 `vip_state` 为 2 时不再加载任何开屏广告。本插件拦截会员查询接口 `/api/vip/index.php?a=query_membership` 的响应，把 `vip_state` 改写为 2（脚本在 `js/xiaoxiong-vip.js`），开屏随之消失——没有拦截、没有等待、没有白屏，也不影响任何其他 App。

机制借鉴 [owl38383](https://github.com/owl38383) 的 Loon 插件（其 `cdn.io` 仓库 `Loon/xiaoxiongyouhao`），此处适配为 Quantumult X 的 `script-response-body` 形式。

## 背景（为什么不用拦截规则）

开屏实际有两条投放通道：小熊自营推广（自家接口 `api/zytg.php` 下发、素材存自家 CDN）与穿山甲聚合 GroMore 调度的穿山甲/快手/优量汇三家 SDK。2026-11-21 曾逐条定位并拦截全部通道（zytg 接口、聚合配置、三家 SDK 接口与六个素材 CDN），QuanX 活动记录确认广告请求已全数被拦，但因 SDK 域名轮换与本地缓存，开屏仍偶有漏出。最终通过对照实验确认：单独改写 `vip_state` 即可让 App 完全不加载开屏，两条通道都不再触发。早期的拦截规则版保存在本仓库 git 历史中（v9，提交 `2218207`），如 App 改版使本方法失效，可从中恢复继续维护。

## 使用

在 Quantumult X 中添加本 snippet 为远程重写资源即可，无需删除重装 App、无需清缓存。

## 注意

- 改写只发生在本地，服务器上的真实会员状态、有效期均不受影响；停用或删除本资源即恢复原状。
- 改写同时会让 App 按 VIP 状态呈现（会员功能解锁是同一机制的附带效果）。
- 若小熊改版后 `vip_state` 的语义变化，本方法可能失效，届时参考 git 历史中的拦截规则版。
