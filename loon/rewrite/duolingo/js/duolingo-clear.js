/*
 * Duolingo 直接通关（清空关卡题目池）
 * 原作者：Takagivegeta（TAKAGIVEGETA）
 * 来源：https://github.com/TAKAGIVEGETA/MyScripts/tree/main/lingoDuo 中的 lingoDuo-clear.js
 * 本文件为移植到 quietmodem/scripts 的自托管副本，脚本逻辑未改动；由 Loon 插件参数 instant_clear 开关控制。
 */
try {
  let obj = JSON.parse($response.body);
  const type = obj.type;
  const skipTypes = ["SIDE_QUEST_RAMP_UP_PRACTICE", "MATCH_PRACTICE"];
  if (type && !skipTypes.includes(type)) {
    const pools = [
        'challenges',
        'adaptiveChallenges',
        'adaptiveInterleavedChallenges',
        'mistakesReplacementChallenges'
    ];
    pools.forEach(pool => {
        if (obj[pool] && obj[pool].length > 0) obj[pool] = [];
    });
  }
  if (obj.elements && obj.elements.length > 0) obj.elements = [];
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done({});
}
