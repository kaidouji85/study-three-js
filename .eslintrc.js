module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:flowtype/recommended"
    ],
    "env": {
        browser: true,
        node: true,
        es6: true,
    },
    "plugins": [
        "flowtype"
    ],
    "rules": {
        "no-undef":　"error"
    },
    "globals": {
        // webpack.config.js Webpack Define Pluginで定義したグローバル変数
        GBRAVER_BURST_RESOURCE_HASH: true,
        GBRAVER_BURST_HOW_TO_PLAY: true,
        GBRAVER_BURST_IS_PERFORMANCE_STATS_VISIBLE: true,
        GBRAVER_BURST_IS_SERVICE_WORKER_USED: true,
        GBRAVER_BURST_API_SERVER_URL: true,
        GBRAVER_BURST_CAN_CASUAL_MATCH: true,

        // webpack.sw.js Webpack Define Pluginで定義したグローバル変数
        GBRAVER_BURST_SW_BUILD_HASH: true,
    }
};