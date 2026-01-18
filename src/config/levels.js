/**
 * ===== 关卡配置文件 =====
 * 
 * 本文件定义了游戏中所有关卡的难度配置
 * 关卡难度通过调整以下维度来控制：
 *   - 方块种类数量 (types)
 *   - 每种方块数量 (tilesPerType)  
 *   - 堆叠层数 (layers)
 *   - 游戏区域大小 (gridWidth × gridHeight)
 */

export const LEVEL_CONFIGS = {
    /**
     * ===== 第1关：简单难度 =====
     * 
     * 设计理念：新手入门关卡，让玩家熟悉游戏玩法
     * 总方块数：3种 × 6个 = 18个方块
     */
    1: {
        // ---------- 主题相关 ----------
        theme: 'livingRoom',      // 家具主题：客厅 (对应 FURNITURE_THEMES 中的键名)
        themeKey: 'level1Theme',  // 翻译键：主题名称 (用于多语言显示)
        nameKey: 'level1Name',    // 翻译键：关卡名称 (如 "第1关")
        descKey: 'level1Desc',    // 翻译键：关卡描述 (如 "客厅 - 简单")

        // ---------- 难度参数 ----------
        types: 3,                 // 方块种类数：3种不同的家具图案
        tilesPerType: 6,          // 每种数量：每种家具生成6个 (必须是3的倍数，因为3个消除)
        layers: 2,                // 堆叠层数：2层叠放 (层数越多，被遮挡的方块越多)
        gridWidth: 4,             // 网格宽度：4列
        gridHeight: 3,            // 网格高度：3行

        // ---------- 奖励相关 ----------
        rewardType: 'consolation', // 奖励类型：安慰奖 (consolation/small/spinWheel)

        // ---------- 预留配置 (暂未实现) ----------
        timeLimit: 30             // 时间限制：30秒 (目前未启用倒计时功能)
    },

    /**
     * ===== 第2关：中等难度 =====
     * 
     * 设计理念：增加挑战，需要更多策略思考
     * 总方块数：4种 × 9个 = 36个方块
     */
    2: {
        // ---------- 主题相关 ----------
        theme: 'outdoor',         // 家具主题：户外
        themeKey: 'level2Theme',
        nameKey: 'level2Name',
        descKey: 'level2Desc',

        // ---------- 难度参数 ----------
        types: 4,                 // 方块种类数：4种 (比第1关多1种)
        tilesPerType: 9,          // 每种数量：9个 (比第1关多3个)
        layers: 3,                // 堆叠层数：3层 (比第1关多1层)
        gridWidth: 5,             // 网格宽度：5列
        gridHeight: 4,            // 网格高度：4行

        // ---------- 奖励相关 ----------
        rewardType: 'small',      // 奖励类型：小奖品

        // ---------- 预留配置 (暂未实现) ----------
        timeLimit: 60             // 时间限制：60秒
    },

    /**
     * ===== 第3关：困难难度 =====
     * 
     * 设计理念：终极挑战，需要仔细规划每一步
     * 总方块数：6种 × 12个 = 72个方块
     */
    3: {
        // ---------- 主题相关 ----------
        theme: 'bedroom',         // 家具主题：卧室
        themeKey: 'level3Theme',
        nameKey: 'level3Name',
        descKey: 'level3Desc',

        // ---------- 难度参数 ----------
        types: 6,                 // 方块种类数：6种 (最多)
        tilesPerType: 12,         // 每种数量：12个 (最多)
        layers: 4,                // 堆叠层数：4层 (最多，遮挡最严重)
        gridWidth: 6,             // 网格宽度：6列
        gridHeight: 5,            // 网格高度：5行

        // ---------- 奖励相关 ----------
        rewardType: 'spinWheel',  // 奖励类型：幸运转盘 (最高奖励)

        // ---------- 预留配置 (暂未实现) ----------
        timeLimit: 90             // 时间限制：90秒
    }
};

/**
 * 最大关卡数
 * 用于判断是否通关全部关卡
 */
export const MAX_LEVEL = 3;
