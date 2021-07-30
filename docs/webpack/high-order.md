# 高阶概念
上文介绍了 webpack 的核心基础概念，本文将对webpack的一些高阶概念进行说明，包括：`treeShaking`、`codeSpliting`、`chunk`、`lazyLoading`、`Prefetching`等等。

## Tree Shaking
顾名思义：“摇树”，这是一个非常象形的比喻，只有跟树没有关联的果子才会被摇晃掉。`treeShaking` 的作用就是将代码中没有使用到的部分剔除掉。

`threeShaking` 只支持ES Module的方式进行模块引入。因为 `ES Module` 底层为静态引入的方式，而 `commonJS` 底层是动态引入的方式。three shaking的配置可以分生产环境(mode:production)与开发环境(mode:development )。

> 开发环境配置  threeShaking：
1. 在webpack.config.js中添加该配置：
```js
optimization: {
  usedExports: true, //哪些文件被使用了才进行打包
},
```
2. 在 package.json 中添加 sideEffects 配置项：

sideEffects 配置项的作用，如果使用 treeShaking 的形式进行打包，会对每个 js 文件进行 treeShaking 处理，而在 js 中有的模块是没有导出任何东西的，但是确实有用的,就比如样式文件的引入或者第三方库的引入： 
```js
import './style.css'
import '@babel/polly-fill'
```
sideEffects 就是指出哪些文件不需要进行 treeShaking 处理。例（ css 文件和 @babel/polly-fill 这种第三方库文件就不需要 treeShaking 处理）配置如下：
```js
{
    "sideEffects": ['@babel/polly-fill','*.css'],
}
```

> 生产环境配置：

生产环境 threeShaking 是自动配置的，不需要进行 optimization 的配置，但需要 sideEffects 配置


## code Spliting
> 概念解释

codeSpliting ,顾名思义“代码分割”。如果没有代码分割，业务代码跟引用的第三方的包的代码在打包的时候会混在一起，代码分割就是将业务代码与库代码进行分离。

不用 codeSpliting 的问题：
1. 包的体积非常大
2. 如果业务代码修改，打包的文件整体发生变化，客户端需要重新拉取整个包文件。代码分割是将业务逻辑代码与第三方组件代码进行分离，

使用 codeSpliting 的优势：
1. 拆成多个文件，加载速度可能会更快
2. 如果业务代码变动，只需要变化业务代码部分内容，第三方的包内容没有变化，可以将这部分内容放到客户端缓存中，这样第二次加载的时候可以读取缓存中内容，不需要重新拉取。

代码分割跟 `webpack` 没有关系，但是 `webpack` 的一些插件（ `split-chunks-plugin` ）可以帮助 `webpack` 非常方便的实现代码分割，并且webpack内部已经集成了split-chunks-plugin插件。

> 配置说明：

对于同步的代码与异步代码 代码分割的配置方式是不同的：

同步代码分割：只需要在webpack.common.js中做optimization的配置
```js
optimization: {
  splitChunks: {
    chunks:'all'
  }, 
},
```
异步代码分割：无需做任何配置，webpack会自动做代码分割。

那你可能就会问了，为什么异步代码不需要配置，而同步代码需要配置呢？是因为webpack内部默认集成了 `split-chunks-plugin` 插件，如果对 `split-chunks-plugin` 插件不做配置，会有一些默认配置，默认配置方式如下：
```js
splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```
各个参数的含义如下(这一部分很重要！)：

- **chunks**: 打包的类型，枚举值为：initial、async、all。 其中：initial 代表对同步代码做代码分割, async 代表只对异步代码进行分割，all 代表都进行代码分割
- **minSize**:引入的模块或者库 大于指定的字节才会做代码分割，如果小于minSize 的值 不会做代码分割
- **maxSize**: maxSize 代表打包后的文件大小如果大于 maxSize 设置的值 那么尝试进行二次代码分割 。
- **minChunks**:当一个模块被用了至少多少次的时候才会对他进行代码分割
- **maxAsyncRequests**:同时加载的模块库最多的数量，当大量引用外部包的时候，控制打包出来的包的数量
- **maxInitialRequests**: 代表整个网站首页或者入口文件进行代码分割的时候可以拆分的包的数量
- **automaticNameDelimiter**:文件生成的时候文件名的链接符
- **name**: true, cacheGroups 的 name 生效
- **cacheGroups**：缓存组：当打包文件的时候，会把符合某个组要求的所有文件都打包到一个文件里，就比如 npm 安装了 lodash 和 jquery ,这两个文件都符合第一个缓存组的要求，那么 lodash 和 jquery 都会被打包进在一个文件中

每个缓存组中：

- **test**：表示该组的规则，`/[\\/]node_modules[\\/]/` 表示该文件来自与node_modules
- **priority**:优先级,如果一个文件满足多个组的要求，哪个组的优先级最高，会按照哪个组的要求打包的。
- **filename**: 可以指定打包后的文件名称，filename 配合 chunks=initial 使用
- **name**: 可以指定打包后的文件名称，name 配合 chunks=all 使用
- **reuseExistingChunk**:如果一个模块已经被打包过了，那么就忽略这个模块直接使用之前打包过的模块
- **default组**：代表默认的组

如果你仔细阅读了上一部分内容，并且理解了这部分内容。那恭喜你，你现在就可以很轻松的理解各大脚手架打出来的包为什么叫 “vendors”, "main"，打包的规则是什么，甚至可以轻松的自定义打包规则了！～

[更多内容：https://www.webpackjs.com/plugins/split-chunks-plugin](https://www.webpackjs.com/plugins/split-chunks-plugin)

## 模块懒加载
模块懒加载就是通过 `import` 语法动态的引入模块（或者库），当组件调用到这部分语法的时候模块才会被载入，这叫懒加载。

优势：因为不需要一下把所有的js全局加载出来，可以让页面加载速度更快，在单页面应用中，就可以按照不同的页面分别做代码分割，在路由切换时，利用懒加载，动态加载不同的模块进来。提高加载速度。

## chunk
打包后的 js 文件，每个 js 文件都是一个 chunk 。

## 打包分析
可以通过对 webpack 的打包过程进行分析，了解现有 webpack 配置中打包存在的问题。从而进行优化。webpack 的分析工具就可以帮我们做到这一点。

webpack 分析工具的git库 ：https://github.com/webpack/analyse

操作方式：
1. 生成webpack打包过程的描述文件：
```
//shell
webpack --profile --json > stats.json
```
2. 打开 http://webpack.github.com/analyse

传入第一步打包好的文件，就能看到整个打包的内容分析，从而进行优化

更多打包分析工具：

https://www.webpackjs.com/guides/code-splitting/#bundle-%E5%88%86%E6%9E%90-bundle-analysis-

## Prefetching
webpack 将 lodash、jquery 这些库文件和业务代码分开打包，更多的是加快第二次的访问的速度（因为库文件不会发生变动，从而可以利用浏览器缓存）,但是对于首次加载速度的提升是有限的（将一个大文件分成几个文件加载，网页的加载速度可能会提高）而 `webpack` 是希望打包之后的页面首次的打开速度就是最快的，另一方面，`webpack` 默认的打包方式是 “async”：
```js
{
    splitChunks: {
        chunks: "async",
    }
}
```
为什么会这样呢？

我们打开页面加载的js中，这些js代码的利用率越高，就越能够提高首屏的加载速度。

查看代码使用率的方式：

commend+shift+p ，输入show Coverage 可以查看代码的使用率

如何提高打包代码的使用率呢？

案例一：代码中交互操作同步执行：
```js
document.addEventListener("click", () => {
  const element = document.createElement("div");
  element.innerHTML = "codeww";
  document.body.appendChild(element);
});
```
案例二：代码中的交互操作异步加载执行：
```js
document.addEventListener("click", () => {
  import("./click.js").then(({ default: func }) => {
    func();
  });
});
```

```js
//click.js 文件：
function handleClick() {
  const element = document.createElement("div");
  element.innerHTML = "hello world";
  document.body.appendChild(element);
}
export default handleClick;
```
**结论**：同步加载的代码使用率是71.6，异步加载的代码使用率是72.9。异步加载代码使用率更高一些，速度更快，因此 webpack 默认的异步打包方式。

但是存在另外一个问题，当用到的时候才异步加载，如果网络加载比较慢就会出现卡顿的情况，就需要用到预加载,即 `webpackPrefetch`。

`webpackPrefetch` 会等到页面加载完成后，页面带宽空闲的时候才加载异步加载的内容，具体使用方式就是添加 魔法注释 "webpackPrefetch"：
```js
document.addEventListener("click", () => {
  import(/* webpackPrefetch: true */ "./click.js").then(({ default: func }) => {
    func();
  });
});
```
**思考**：在进行前段代码性能优化的时候，缓存其实不是最重要的点，最重要的是code Coverage 也就是代码覆盖率！！

PS:上文中一共用到两个magic comment:
- **webpackChunkName**：指定打包的文件名称
- **webpackPrefetch**：指定该模块使用预加载


## 对css文件进行代码分割
上文说的都是对 js 文件进行代码分割，也可以对css文件进行代码分割。需通过 `mini-css-extract-plugin` 插件。

> mini-css-extract-plugin ：

使用该插件就需要修改 `webpack` 配置文件中 `module` 的配置，具体是用 `MiniCssExtractPlugin.loader` 替换 `styleLoader`，因为不再是以 `style` 标签的形式加载到页面中，而是打包成单独的 `css` 文件
```js
{
    module: {
        rules:[{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader, 
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ]
        }]
    }
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        })
    ]
}
```
`filename` 、`chunkFilename`    选项用于设置打包之后的文件的名字,如果打包后的文件直接被 html 引用 那么采用 `filename` 的命名规则,如果打包后的文件间接被 `html` 引用 那么采用 `chunkFilename` 的命名规则,同时该插件有默认有将多个 `css` 文件合并在一起的功能。

mini-css-extract-plugin 插件不会对css文件进行压缩和内容合并，这就需要用到另一个插件：optimize-css-assets-webpack-plugin 。

> optimize-css-assets-webpack-plugin：

使用方式：
```js
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
};
```
更多功能：
- 存在多个入口文件，想将多个入口文件的样式文件打包到一个文件里
- 存在多个入口文件，想将每个入口文件对应的样式文件分开打包

这些需求需要借助到 splitChunksPlugin 插件的 cacheGroup 配置

[更多详情查看：https://webpack.js.org/plugins/mini-css-extract-plugin/](https://webpack.js.org/plugins/mini-css-extract-plugin/)


## 浏览器缓存
当浏览器加载同一个文件多次，在浏览器本地有缓存这是个时候就会走本地的问题，前提是保证当文件内容相同的时候文件名一致。实现这一点非常简单，只需要在 webpack 的 output 中给打包的文件名增加 contenthash 的占位符即可
```js
output: {
  filename: "[name].[contenthash].js",
  chunkFilename: "[name].[contenthash].js",
  path: path.resolve(__dirname, "../dist"),
},
```
业务代码打包进 main 文件中,第三方库的代码打包进 vendors 文件中，如果只是对业务逻辑修改，只有 main 的 hash 值会发生变化，客户端只需要加载文件名变化的文件即可。