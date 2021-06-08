module.exports = {
    base: '/vuepress/',
    title: '前端',
    description: '前端知识集成',
    themeConfig: {
        logo: '/assets/img/hero.png',
        nav: [
            { text: 'axios', link: '/axios/' },
            { text: 'External', link: 'https://google.com' },
        ],
    },
    // 指定额外的需要被监听的文件。
    extraWatchFiles: [
        // '.vuepress/config.js', // 使用相对路径
        //'/path/to/bar.js'   // 使用绝对路径
    ]
}