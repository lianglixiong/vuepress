## 基础配置

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                         /* 启用增量编译。需要TypeScript 3.4或更高版本。 */
    "target": "es5",                                /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                                   /* Specify library files to be included in the compilation. */
    // "allowJs": true,                             /* 允许编译javascript文件。*/
    // "checkJs": true,                             /* 报告.js文件中的错误。 */
    // "jsx": "preserve",                           /* 指定JSX代码生成：“preserve”、“react native”、“react”、“react JSX”或“react jsxdev”。 */
    // "declaration": true,                         /* 生成相应的“.d.ts”文件。 */
    // "declarationMap": true,                      /* 为每个相应的“.d.ts”文件生成源映射。 */
    // "sourceMap": true,                           /* 生成相应的“.map”文件。 */
    // "outFile": "./",                             /* 将输出串联并发射到单个文件。 */
    // "outDir": "./",                              /* 将输出结构重定向到目录。 */
    // "rootDir": "./",                             /* 指定输入文件的根目录。用于使用--outDir控制输出目录结构。 */
    // "composite": true,                           /* 启用项目编译 */
    // "tsBuildInfoFile": "./",                     /* 指定文件以存储增量编译信息 */
    // "removeComments": true,                      /* 不要输出注释。 */
    // "noEmit": true,                              /* 不要发射输出。 */
    // "importHelpers": true,                       /* 从“tslib”导入emit帮助程序。 */
    // "downlevelIteration": true,                  /* 针对“ES5”或“ES3”，在“for of”、“spread”和“destructuring”中为iterables提供全面支持。 */
    // "isolatedModules": true,                     /* 将每个文件作为单独的模块进行传输（类似于“ts.transpileModule”）。 */

    /* Strict Type-Checking Options */
    "strict": true,                                 /* 启用所有严格类型检查选项。 */
    // "noImplicitAny": true,                       /* 对隐含“any”类型的表达式和声明引发错误。 */
    // "strictNullChecks": true,                    /* 启用严格的空检查。 */
    // "strictFunctionTypes": true,                 /* 启用对函数类型的严格检查。 */
    // "strictBindCallApply": true,                 /* 对函数启用严格的“bind”、“call”和“apply”方法。 */
    // "strictPropertyInitialization": true,        /* 启用类中属性初始化的严格检查。 */
    // "noImplicitThis": true,                      /* 对隐含“any”类型的“this”表达式引发错误。 */
    // "alwaysStrict": true,                        /* 在严格模式下解析，并为每个源文件发出“usestrict”。 */

    /* Additional Checks */
    // "noUnusedLocals": true,                      /* 报告未使用的局部变量的错误。 */
    // "noUnusedParameters": true,                  /* 报告未使用参数的错误。 */
    // "noImplicitReturns": true,                   /* 当函数中并非所有代码路径都返回值时报告错误。 */
    // "noFallthroughCasesInSwitch": true,          /* 在switch语句中报告错误。 */
    // "noUncheckedIndexedAccess": true,            /* 在索引签名结果中包含“未定义” */
    // "noImplicitOverride": true,                  /* 确保用“override”修饰符标记派生类中的重写成员。 */
    // "noPropertyAccessFromIndexSignature": true,  /* 需要索引签名中未声明的属性才能使用元素访问。 */

    /* Module Resolution Options */
    // "moduleResolution": "node",                  /* 指定模块解析策略：“node”（node.js）或“classic”（TypeScript pre-1.6）。 */
    // "baseUrl": "./",                             /* 用于解析非绝对模块名称的基目录。 */
    // "paths": {},                                 /* 将导入重新映射到相对于“baseUrl”的查找位置的一系列条目。 */
    // "rootDirs": [],                              /* 其组合内容在运行时表示项目结构的根文件夹列表。 */
    // "typeRoots": [],                             /* 包含类型定义的文件夹列表。 */
    // "types": [],                                 /* 要包含在编译中的类型声明文件。 */
    // "allowSyntheticDefaultImports": true,        /* 允许从没有默认导出的模块进行默认导入。这并不影响代码的发出，只是类型检查。 */
    "esModuleInterop": true,                        /* 通过为所有导入创建命名空间对象，实现CommonJS和ES模块之间的互操作性。表示“allowSyntheticDefaultImports”。 */
    // "preserveSymlinks": true,                    /* 不要解析符号链接的实际路径。 */
    // "allowUmdGlobalAccess": true,                /* 允许从模块访问UMD globals。 */

    /* Source Map Options */
    // "sourceRoot": "",                            /* 指定调试器应该定位TypeScript文件的位置，而不是源位置。 */
    // "mapRoot": "",                               /* 指定调试器应该定位映射文件的位置，而不是生成的位置。 */
    // "inlineSourceMap": true,                     /* 发射具有源贴图的单个文件，而不是具有单独的文件。 */
    // "inlineSources": true,                       /* 在单个文件中沿源地图发射源；需要设置'--inlineSourceMap'或'--sourceMap'。 */

    /* Experimental Options */
    "experimentalDecorators": true,              /* 启用对ES7装饰器的实验性支持。 */
    // "emitDecoratorMetadata": true,               /* 启用对为装饰器发射类型元数据的实验性支持。 */

    /* Advanced Options */
    "skipLibCheck": true,                           /* 跳过声明文件的类型检查。 */
    "forceConsistentCasingInFileNames": true        /* 不允许对同一文件的大小写不一致的引用。 */
  }
}
```