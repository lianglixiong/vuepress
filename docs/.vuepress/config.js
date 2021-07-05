const path = require('path');
console.log(path.resolve(__dirname, "assets"))
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@assets': path.resolve(__dirname, "assets"),
            }
        }
    },
    // base: '/vuepress/',
    base: '/',
    title: '梁木子雄',
    description: '前端知识集成',
    themeConfig: {
        // logo: './assets/img/hero.png',
        displayAllHeaders: true, // 显示所有页面的标题链接 默认值：false
        nav: [
            { 
                text: 'axios', 
                link: '/axios/',
            },
            {
                text: 'js正则', 
                link: '/regular/',
            },
            {
                text: 'es6标准入门', 
                link: '/es6/',
            },
            { 
                text: 'java', 
                ariaLabel: 'Language Menu',
                items: [
                    { text: '常见的DOS命令', link: '/java/dos/' },
                    { text: 'Japanese', link: '/language/japanese/' }
                ] 
            },
            { text: 'github', link: 'https://github.com/lianglixiong' },
        ],
        sidebar: {
            '/axios/': getThemeSidebar('axios', '介绍'),
            '/regular/': [{
                title: 'js正则',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    ['', 'javascript的正则表达式'],
                    // 'project-entrance',
                    //   'writing-a-theme',
                    //   'option-api',
                    //   'default-theme-config',
                    //   'blog-theme',
                    //   'inheritance'
                ]
            }],
            '/es6/': [{
                title: 'es6标准入门',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    ['', 'ECMAScript6简介'],
                    ['let-const', 'let和const命令'],
                    ['symbol', '第10章 Symbol'],
                    ['proxy', '第12章 Proxy']
                ]
            }],
            // '/axios/': [
            //     {
            //         title: 'axios',
            //         path: '/axios/',
            //         sidebarDepth: 2,
            //         children: [
            //             {text: 'API解读', text: '/axios/a'}
            //         ]
            //     },
            // ]
        }
    },
    // 指定额外的需要被监听的文件。
    extraWatchFiles: [
        // '.vuepress/config.js', // 使用相对路径
        //'/path/to/bar.js'   // 使用绝对路径
    ]
}


function getThemeSidebar (groupA, introductionA) {
    return [
      {
        title: groupA,
        collapsable: false,
        sidebarDepth: 2,
        children: [
          ['', introductionA],
          'project-entrance',
        //   'writing-a-theme',
        //   'option-api',
        //   'default-theme-config',
        //   'blog-theme',
        //   'inheritance'
        ]
      }
    ]
  }