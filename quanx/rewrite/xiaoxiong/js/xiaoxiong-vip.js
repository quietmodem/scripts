/*
 * 小熊油耗 VIP 状态改写（实验性）
 * 借鉴 owl38383 的 Loon 插件（github.com/owl38383/cdn.io 中 Loon/xiaoxiongyouhao），适配 Quantumult X。
 * 原理：拦截 /api/vip/index.php?a=query_membership 的响应，把 vip_state 改为 2，
 * 验证开屏广告是否与会员状态字段有关。仅本地改写，服务器上的真实会员状态
 * 不受任何影响；停用对应重写规则即恢复原状。
 */

if (typeof $response !== "undefined" && $response.body) {
  try {
    var obj = JSON.parse($response.body);
    obj.vip_state = 2;
    obj.vip_valid_till_date = "9999年08月31日";
    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    $done({});
  }
} else {
  $done({});
}
