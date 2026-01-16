在浏览器开发者控制台中测试每日重置功能：

方法：模拟"昨天"的日期

按 F12 或 Cmd+Option+I 打开开发者工具
切换到 Console 标签
输入以下命令：
javascript
// 把保存的日期改成昨天
localStorage.setItem('woodmatch_prizeDate', '2026-01-14');
// 刷新页面，系统会检测到日期变化并重置
location.reload();
测试流程：

先正常抽几个奖品 → 显示"已获得"
执行上面的命令（改日期为昨天）
页面刷新后 → 所有奖品重新可抽！
验证是否生效：

javascript
// 查看当前存储的数据
console.log('日期:', localStorage.getItem('woodmatch_prizeDate'));
console.log('已获奖品:', localStorage.getItem('woodmatch_wonPrizes'));
刷新后应该看到日期变成今天（2026-01-15），已获奖品变成 null 或空数组。🎉