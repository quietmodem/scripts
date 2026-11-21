/*
 * 小熊油耗会员状态改写
 * 借鉴 owl38383 的 Loon 插件（github.com/owl38383/cdn.io），适配 Quantumult X / Loon。
 * 仅本地改写，停用即恢复。
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
