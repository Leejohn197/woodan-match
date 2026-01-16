// ===== Level Configurations =====
export const LEVEL_CONFIGS = {
    1: {
        theme: 'livingRoom',
        themeKey: 'level1Theme',
        nameKey: 'level1Name',
        descKey: 'level1Desc',
        types: 3,
        tilesPerType: 6,
        layers: 2,
        gridWidth: 4,
        gridHeight: 3,
        rewardType: 'consolation', // 安慰奖
        timeLimit: 30
    },
    2: {
        theme: 'outdoor',
        themeKey: 'level2Theme',
        nameKey: 'level2Name',
        descKey: 'level2Desc',
        types: 4,
        tilesPerType: 9,
        layers: 3,
        gridWidth: 5,
        gridHeight: 4,
        rewardType: 'small', // 小奖品
        timeLimit: 60
    },
    3: {
        theme: 'bedroom',
        themeKey: 'level3Theme',
        nameKey: 'level3Name',
        descKey: 'level3Desc',
        types: 6,
        tilesPerType: 12,
        layers: 4,
        gridWidth: 6,
        gridHeight: 5,
        rewardType: 'spinWheel', // 幸运转盘
        timeLimit: 90
    }
};

export const MAX_LEVEL = 3;
