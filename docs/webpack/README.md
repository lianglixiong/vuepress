# 核心概念

## Loader
webpack 自身只能识别、打包 js 文件，通过 loader 可以识别、处理各种类型文件，下面将介绍对图片、样式、字体、js（es6、react）文件的打包配置

### 一、图片文件打包

#### file-loader 
作用是将指定类型文件移动到打包目录，并返回文件路径。用于处理各种不需要其他操作（比如转译）的文件。
```js
module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            //placeholder:占位符
              //name:源文件名称，ext:文件类型
            name: "[name].[ext]", 
            //打包后文件存放路径
            outputPath: "images/",
          },
        }
      }
    ]
 }
 ```

 #### url-loader
 `url-loader`与 `file-loader` 都可以进行图片类型打包，但是 `url-loader` 可以将部分图片以 `base64` 的形式打包到js中（ `file-loader` 只有移动文件的作用)。这就需要 `limit` 进行大小控制，图片大小小于 `limit` 指定的值（单位字节）图片将以 `base64` 形式打包到 `js` 中，大于限定值将还是按照图片形式打包。
 ```js
 module: {
    rules: [
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
            limit: 2048, //2048字节 2K，小与2K以base64的形式打包到js中，大于两K,以图片形式打包。
          },
        }
    ],
 }
 ```

### 二、样式文件打包
样式文件包括css、scss、less文件等，需要用到的 loader 如下：
- **css-loader**:分析css中几个css之间的关系，并将他们合并成一个
- **style-loader**:将合并好的css样式，以style标签的形式挂载到html 的header头中 
- **sass-loader**:解析sass文件
- **postcss-loader**:增加厂商前缀

1. css文件配置：
```js
module:{
  rules:[{
      test:/\.css$/,
      use:["style-loader","css-loader","sass-loader"]
  }]
}
```
2. 为 css3 标签增加浏览器厂商前缀：
```js
{
  test: /\.scss$/,
  use: [
    "style-loader",
    "css-loader",
    "sass-loader",
    "postcss-loader",
  ],
},
```
配置postcss配置 文件：postcss.config.js
```js
module.exports = {
  plugins: [require("autoprefixer")],
};
```
3. 为了避免不同模块间的样式冲突问题，可以开启css module
```js
{
  test: /\.scss$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        modules: true,
      },
    },
    "sass-loader",
    "postcss-loader",
  ],
},
```

:::warning
loader执行顺序是从下到上，从右到左的执行顺序～～
:::


### 三、字体文件打包
字体文件打包通过 file-loader (只需要进行文件移动即可)。  
```js
{
  test: /\.(eot|ttf|svg)$/,
  use: {
    loader: "file-loader",
  },
},
```
[更多loader:](https://www.webpackjs.com/loaders/)


## Plugin
`plugin` 可以在 `webpack` 运行到某一时刻的时候帮你做一些事情，就像`vue` 与 `react` 中的生命周期函数

### html-webpack-plugin
使用该插件会自动生成 html 模版，并自动引入打包好的 js 文件（执行时期在打包之后）。也可以通过 template 配置生成 html 的模版
```js
plugins: [
  new HtmlWebpackPlugin({
    template: "src/index.html",
  }),
],
```

### clean-webpack-plugin
清除上次打包的内容，执行时期在打包之前
```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
 plugins: [
  new CleanWebpackPlugin()
],
```
[更多插件：](https://www.webpackjs.com/plugins/)


## entry与output
entry 与 output 是 webpack 中最基础的两个配置属性。entry 用于配置打包的入口文件，output 对打包文件的生成位置、名称等进行配置。

当对一个文件进行打包时，entry可以为： 
```js
entry: {
  main: "./src/index.js",
},
```
或者
```js
entry: "./src/index.js",
```

可以通过output指定打包后的文件名：
```js
output: {
  filename: "bundle.js",
  path: path.resolve(__dirname, "dist"),
},
```

但是当需要打包成多个文件的时候，output 就不能指定死打包的文件名了（多个文件不可能重名嘛），就需要用到占位符 （下面的"name"就是占位符代表源文件名称，这样的占位符还有很多）
```js
output: {
  filename: "[name].js",
  path: path.resolve(__dirname, "dist"),
},
```

为了加快资源的加载速度，我们往往将静态资源放到 cdn 上，将 html 放到服务端。html 需要拉取 cdn 上的静态资源。这就需要修改 html 中引用的 js 的路径。可通过配置 output 的 publicPath 设定：
```js
output: {
  filename: "[name].js",
  path: path.resolve(__dirname, "dist"),
  publicPath: "https://cdn.example.com/assets/"
},
```

## sourcemap
当发生了异常为了能够快速定位到异常发生的位置，需要用到sourcemap。使用devtool控制sourcemap类型,sourcemap 的类型中有一些关键词，他们分别的含义如下：
- **line**:代表打包后的map文件会合并到打包的js文件中
- **cheap**:代表只能定位到行，定位不到那一列，但是性能更快
- **eval**:一种sourcemap的方式，打包速度最快，但是提示出来的内容可能并不全面，同时也不会生成 .map 文件
- **module**:添加module之后不仅负责业务代码的错误，同时第三方模块的错误也会展示。

最佳实践：开发环境
```js
{
    mode: "development",
    devtool: "cheap-module-eval-source-map",
}
```
最佳实践：生产环境
```js
{
    mode: "production",
    devtool: "cheap-module-source-map",
}
```
[更多配置](https://www.webpackjs.com/configuration/devtool/)

## devserver
为了简化开发，当 src 下的代码变动之后希望能够对新的代码进行自动的打包编译，有几种方式：
1. **webpack --watch**：在npm script中借助webpack的 --watch指令 能够监听文件变化重新打包，但是不可以打开浏览器，开启服务（还是以文件的形式打开页面）。
2. 借助 **webpack-dev-tool**，通过 webpack-dev-tool 能够帮你开启一个服务，帮你实现：自动打开浏览器、代码更改后重新编译并刷新页面、提供服务端代理等等的功能，这是比较常用的一种方式 

配置如下：
```js
devServer: {
    contentBase: './dist',//打包后的文件夹
    open: true,//自动打开浏览器
    port: 8080 //服务运行端口
},
```
[更多devserver配置](https://www.webpackjs.com/configuration/dev-server/)

## HMR
当我们希望某一模块的变化不影响其他模块的方法，，不是每次变化都页面重新加载。这个功能叫做HMR（hot-module-replacement）。

官方说法是：
> 在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面

HMR配置方式：
```js
const webpack = require("webpack");
```
在plugin中新增：
```js
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```
devServer 增加 `hot` 与 `hotOnly` 配置项：
```js
devServer: {
  contentBase: "./dist",//启动devserver的路径
  open: true,//默认打开浏览器
  port: 8080,//启动浏览器端口
  hot: true,//是否启动热更新（HMR）
  hotOnly: true,//即使不启动HMR（或者HMR有问题）也不刷新浏览器
},
```
对于样式文件：当样式修改的时候，我们样式变化不会影响页面 js 渲染的渲染结果（css-loader已经帮我们完成了HMR的处理）。

对于js文件：当我们希望某一模块的 js 变动不影响其他的模块，我们需要使用代码控制,如下所示：（如果项目中使用了 babel-presets ，就不用再写这段逻辑了，babel-presets 已帮你完成配置）：
```js
if (module.hot) {
  //支持hmr
  module.hot.accept("xxx.js", () => {//某一个模块的js发生了变化执行逻辑
    //...自定义执行逻辑
  });
}
```

## babel
1. 安装 loader:
```
npm install --save-dev babel-loader @babel/core
```
2. 添加 webpack module配置：
```js
module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}
```
3. @babel/preset-env 包含了所有转es5的语法规则,并将高级语法转换为es5语法，增加配置：
```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: "babel-loader",
  options: {
    presets: ["@babel/preset-env"],
  },
},
```
4. @babel/polyfill 为了兼容各大浏览器还需要引入 `babel-pollify` 对低版本浏览器进行补充（抹平了各个浏览器版本间的差异）,比如帮助低版本浏览器实现 `promise` 、实现 `map` 方法等等

安装：
```
npm install --save @babel/polyfill
```
使用（在js中引用）：
```js
import "@babel/polyfill";
```
5. 如果不加配置，默认会将 @babel/polyfill 中所有的高级在低版本浏览器的实现都打进包里，这个包会变得非常大，我们只需要将用到的语法打进包里就可以了，通过 useBuiltIns 配置，配置方式如下：
```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            useBuiltIns: "usage", //用到的才打包
                        },
                    ],
                ],
            },
        }
    ]
}
```
6. 更近一步，如果说可以限定支持的浏览器的版本号（比如项目只支持 IE10 以上），IE10 部分方法已经支持了，那么 pollify 包的大小就可以再进一步减小。示例配置如下：
```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: {
                                edge: "17",
                                firefox: "60",
                                chrome: "67",
                                safari: "11.1",
                            },
                            useBuiltIns: "usage", //用到的才打包
                        },
                    ],
                ],
            },
        }
    ]
}
```
7. @babel/polyfill 会污染全局环境，如果是写业务代码是没有问题的，但是如果是写类库，为了不污染引用者的全局环境使用 preset 的方式就不可取了，为了不污染全局环境可以使用引入 runtime 插件的方式：

安装：
```
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime  
npm install --save @babel/runtime-corejs2
```
webpack.config.js配置如下：
```js

module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                plugins: [
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            absoluteRuntime: false,
                            corejs: 2,
                            helpers: true,
                            regenerator: true,
                            useESModules: false,
                            version: "7.0.0-beta.0",
                        },
                    ],
                ],
            },
        }
    ]
}
```
[更多babel内容参看](https://babeljs.io/docs/en/babel-plugin-transform-runtime)


## 打包react代码
使用webpack打包react代码：@babel/predset 是将 `es6` 语法转换为 `es5` 语法，想要使用 `webpack` 打包 `react` 代码，除了要将 `es6` 语法转换为 `es5` 语法之外，还需要将 `react` 的 `JSX` 语法进行转换，这需要另外一个 preset：`@babel/preset-react`

安装：
```
npm install --save-dev @babel/preset-react
```
可以使用 .babelrc 配置：
```js

{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                },
                "useBuiltIns": "usage" //用到的才打包
            }
        ],
        "@babel/preset-react" //从下往上，先转换react代码，再转换es6代码
    ]
}
```
[更多参看](https://babeljs.io/docs/en/babel-preset-react)