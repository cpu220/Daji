# Git账号管理模块 (git.js)

## 1. 模块概述

Git账号管理模块用于管理和切换Git用户账号，方便开发者在不同项目间快速切换Git身份。

## 2. 功能说明

| 功能 | 描述 |
|------|------|
| 查看Git账号信息 | 查看当前Git账号的用户名和邮箱 |
| 切换Git账号 | 从配置的账号列表中选择并切换Git账号 |
| 管理Git账号配置 | 导入、导出和更新Git账号配置 |

## 3. 命令格式

```bash
daji gitConfig [cmd] [options]
# 或
daji git [cmd] [options]
```

## 4. 选项说明

| 选项 | 缩写 | 参数 | 描述 |
|------|------|------|------|
| --info | 无 | all 或 无 | 查看Git账号信息，all表示查看所有配置 |
| --switchGit | -s | 无 | 切换Git账号 |
| --config | 无 | 无 | 配置Git账号 |

## 5. 使用示例

### 5.1 查看当前Git账号信息

```bash
daji git --info
# 或
daji git
```

执行此命令后，工具会输出当前Git账号的用户名和邮箱。

### 5.2 查看所有Git账号配置

```bash
daji git --info all
# 或
daji gitConfig --info all
```

执行此命令后，工具会输出所有已配置的Git账号信息。

### 5.3 切换Git账号

```bash
daji git --switchGit
# 或
daji git -s
# 或
daji gitConfig -s
```

执行此命令后，工具会显示已配置的Git账号列表，用户可以选择要切换的账号。

### 5.4 配置Git账号

```bash
daji git --config
# 或
daji gitConfig --config
```

执行此命令后，工具会提供以下配置选项：
- 导入Git账号配置
- 导出Git账号配置
- 更新Git账号配置

## 6. 实现原理

1. **查看Git账号信息**：
   - 使用 `git config user.name` 和 `git config user.email` 命令获取当前Git账号信息
   - 如果指定了 `all` 参数，则输出所有已配置的Git账号

2. **切换Git账号**：
   - 读取 `data/git/config.json` 中的账号配置
   - 显示账号列表供用户选择
   - 使用 `git config --global user.name` 和 `git config --global user.email` 命令更新Git配置

3. **管理Git账号配置**：
   - **导入配置**：从本地文件导入Git账号配置
   - **导出配置**：将当前Git账号配置导出到本地文件
   - **更新配置**：修改已配置的Git账号信息

## 7. 数据结构

Git账号配置存储在 `data/git/config.json` 文件中，格式如下：

```json
{
  "账号1": {
    "name": "用户名1",
    "email": "邮箱1"
  },
  "账号2": {
    "name": "用户名2",
    "email": "邮箱2"
  }
}
```

## 8. 依赖关系

- `../common/utils` - 通用工具函数
- `../common/_gitQuestion` - Git相关交互问题
- `../common/appListManage` - App列表管理
- `../data/git/config.json` - Git账号配置
