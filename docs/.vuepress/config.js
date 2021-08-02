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
        //displayAllHeaders: true, // 显示所有页面的标题链接 默认值：false
        nav: [
            { 
                text: 'axios', 
                link: '/axios/',
            },
            { 
                text: 'vuex(3.6.2)', 
                link: '/vuex/',
            },
            {
                text: 'JavaScript', 
                ariaLabel: 'JavaScript Menu',
                items: [
                    { text: 'JavaScript基础', link: '/JavaScript/basics/' },
                    { text: 'HTTP', link: '/JavaScript/http/' },
                    { text: 'js正则', link: '/regular/' },
                    { text: 'es6标准入门', link: '/es6/' }
                ] 
            },
            { 
                text: 'mysql', 
                link: '/mysql/',
            },
            // {
            //     text: 'js正则', 
            //     link: '/regular/',
            // },
            // {
            //     text: 'es6标准入门', 
            //     link: '/es6/',
            // },
            {
                text: 'TypeScript', 
                link: '/typeScript/',
            },
            {
                text: 'webpack', 
                link: '/webpack/',
            },
            {
                text: 'React', 
                link: '/react/',
            },
            // {
            //     text: '操作系统指南', 
            //     ariaLabel: 'system Menu',
            //     items: [
            //         { text: '操作系统入门', link: '/system/introduction/' },
                    
            //     ]
            // },
            { 
                text: 'java', 
                ariaLabel: 'Language Menu',
                items: [
                    { text: '常见的DOS命令', link: '/java/dos/' },
                    { text: '设计模式', link: '/java/designPattern/' }
                ] 
            },
            { text: '组件', link: '/subassembly/' },
            { text: 'github', link: 'https://github.com/lianglixiong' },
        ],
        sidebar: {
            '/axios/': getThemeSidebar('axios', '介绍'),
            '/vuex/': [{
                title: 'vuex',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'Store',
                    'mapGetters',
                    'mapState',
                    // 'generic-paradigm',
                    // 'module',
                    // 'decorator'
                ]
            }],
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
                    '',
                    'let-const',
                    'symbol',
                    'proxy',
                    'module-grammar',
                    'module-load'
                ]
            }],
            //TypeScript
            '/typeScript/': [{
                title: 'TypeScript',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'config',
                    'class',
                    'interface',
                    'generic-paradigm',
                    'module',
                    'decorator'
                ]
            }],
            '/webpack/': [{
                title: 'webpack',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'high-order',
                    'analysis',
                    // 'interface',
                    // 'generic-paradigm',
                    // 'module',
                    // 'decorator'
                ]
            }],
            '/react/': [{
                title: 'React',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'react-router'
                ]
            }],
            '/JavaScript/basics/': [{
                title: 'JavaScript基础',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'prototype',
                    'parseInt',
                    'handwritten',
                    'cross-domain',
                    'http'
                ]
            }],
            '/JavaScript/http/': [{
                title: 'HTTP',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'cookies',
                    'cache',
                    'https',
                    'other'
                ]
            }],
            '/mysql/': [{
                title: 'mysql',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'JDBC'
                ]
            }],
            '/system/introduction/': [{
                title: '操作系统入门',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'computer-hardware'
                ]
            }],
            '/java/designPattern/': [{
                title: '设计模式',
                collapsable: false,
                sidebarDepth: 2,
                children: [
                    '',
                    'JDBC'
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