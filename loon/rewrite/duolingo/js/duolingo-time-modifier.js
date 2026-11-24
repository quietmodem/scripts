/*
 * Duolingo 限时挑战时长修改
 * 原作者：Takagivegeta（TAKAGIVEGETA）
 * 来源：https://github.com/TAKAGIVEGETA/MyScripts/tree/main/lingoDuo 中的 lingoDuo-time-modifier.js
 * 本文件为移植到 quietmodem/scripts 的自托管副本，脚本逻辑未改动；时长由 Loon 插件参数 timer_mins 传入。
 */
try {
    let obj = JSON.parse($response.body);
    let seconds = parseInt($argument.timer_mins) * 60;
    if (!isNaN(seconds) && seconds > 0 && obj.liveOpsChallenges)
        obj.liveOpsChallenges.forEach(challenge => {
            if (challenge.initialTime) challenge.initialTime = seconds;
            if (challenge.initialLevelTimes) challenge.initialLevelTimes = challenge.initialLevelTimes.map(() => seconds);
            if (challenge.initialSessionTimes) challenge.initialSessionTimes = challenge.initialSessionTimes.map(() => seconds);
        });
    $done({ body: JSON.stringify(obj) });
} catch (e) {
    $done({});
}
