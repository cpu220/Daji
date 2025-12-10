# Daji 项目架构说明

## 1. 项目概述

妲己（Daji）是一个命令行工具，定位为开发助手脚本，用于快速创建项目、调试和执行各种开发相关任务。

### 核心功能
- host 切换
- git 账号切换
- 查看IP地址
- 启动iOS模拟器
- 时间戳转换
- 工具设置配置项操作（导入导出）

## 2. 目录结构

```
Daji/
├── bin/
│   └── index.js           # 项目入口文件
├── common/                # 通用组件和工具
│   ├── _GitQuestion.js    # Git相关交互问题
│   ├── _HostQuestion.js   # Host相关交互问题
│   ├── _IOSQuestion.js    # iOS相关交互问题
│   ├── appListManage.js   # App列表管理
│   ├── iosTools.js        # iOS工具函数
│   ├── loading.js         # 加载动画
│   ├── msgColor.js        # 消息颜色处理
│   └── utils.js           # 通用工具函数
├── data/                  # 配置数据存储
│   ├── git/               # Git配置数据
│   ├── host/              # Host配置数据
│   ├── ios/               # iOS配置数据
│   └── _fileList.json     # 文件列表
├── lib/                   # 核心功能模块
│   ├── config.js          # 配置管理
│   ├── date.js            # 日期时间处理
│   ├── git.js             # Git账号管理
│   ├── host.js            # Host切换功能
│   ├── ios.js             # iOS模拟器管理
│   ├── ip.js              # IP地址获取
│   ├── path.js            # 路径处理
│   ├── project.js         # 项目管理
│   └── test.js            # 测试模块
├── utils/                 # UI和交互工具
│   ├── baseUI.js          # 基础UI组件
│   ├── bottom-bar.js      # 底部栏组件
│   └── readline.js        # 命令行交互
├── .gitignore             # Git忽略文件
├── package.json           # 项目依赖配置
└── readme.md              # 项目说明文档
```

## 3. 核心模块说明

### 3.1 入口模块 (bin/index.js)

- 基于 Commander.js 实现命令行交互
- 定义所有可用命令和选项
- 导入并调用各个功能模块

### 3.2 功能模块 (lib/)

| 模块       | 主要功能                                 | 对应命令                |
|------------|------------------------------------------|-------------------------|
| config.js  | 配置项导入导出                           | `daji config`           |
| date.js    | 时间戳转换                               | `daji Date` 或 `daji d` |
| git.js     | Git账号切换与管理                        | `daji gitConfig` 或 `daji git` |
| host.js    | Host文件切换与管理                       | `daji switchHost` 或 `daji host` |
| ios.js     | iOS模拟器管理                            | `daji ios`              |
| ip.js      | IP地址获取                               | `daji ip`               |
| path.js    | 当前路径信息显示                         | `daji path`             |
| project.js | 项目管理（已作废）                       | -                       |
| test.js    | 测试模块（已作废）                       | -                       |

### 3.3 通用组件 (common/)

- 提供各种交互问题模板
- 实现加载动画和消息颜色处理
- 封装通用工具函数

### 3.4 数据存储 (data/)

- 按功能模块分类存储配置数据
- 支持配置项的导入导出
- 持久化保存用户设置

### 3.5 UI工具 (utils/)

- 实现命令行界面组件
- 处理用户输入和交互
- 提供底部状态栏等增强功能

## 4. 工作流程

1. 用户在命令行执行 `daji` 命令
2. `bin/index.js` 解析命令和选项
3. 根据命令调用对应的功能模块（如 `lib/ios.js`）
4. 功能模块调用通用组件和工具完成具体操作
5. 读取或写入数据到 `data/` 目录
6. 向用户返回结果或提示

## 5. 配置管理

- 所有配置数据存储在 `data/` 目录下
- 支持通过 `config` 命令导入导出配置
- 每个功能模块有独立的配置文件
- 配置文件采用 JSON 格式

## 6. 扩展机制

- 新增功能模块只需在 `lib/` 目录下创建新文件
- 在 `bin/index.js` 中注册新命令
- 配置数据自动存储到 `data/` 目录
- 可以复用 `common/` 和 `utils/` 中的工具函数

## 7. 技术栈

- Node.js
- Commander.js (命令行框架)
- 原生Node.js API
- 无其他外部依赖

## 8. 模块文档

详细的模块说明请参考各个模块的独立文档：

- [config.md](config.md) - 配置管理模块
- [date.md](date.md) - 日期时间处理模块
- [git.md](git.md) - Git账号管理模块
- [host.md](host.md) - Host切换功能模块
- [ios.md](ios.md) - iOS模拟器管理模块
- [ip.md](ip.md) - IP地址获取模块
- [path.md](path.md) - 路径处理模块
- [password.md](password.md) - 密码生成模块
