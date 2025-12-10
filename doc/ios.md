# iOS模拟器管理模块 (ios.js)

## 1. 模块概述

iOS模拟器管理模块用于管理和操作iOS模拟器，支持启动模拟器、安装应用、打开指定URL等功能。

## 2. 功能说明

| 功能 | 描述 |
|------|------|
| 启动模拟器 | 启动iOS模拟器 |
| 安装应用 | 在模拟器上安装应用 |
| 启动指定应用 | 启动模拟器并打开指定应用 |
| 打开URL | 在模拟器上打开指定URL |
| 转换URL | 转换URL格式 |
| 管理应用列表 | 添加、查看、移除和更新应用列表 |
| 配置管理 | 导入、导出和重置配置 |

## 3. 命令格式

```bash
daji ios [cmd] [options]
```

## 4. 选项说明

| 选项 | 缩写 | 参数 | 描述 |
|------|------|------|------|
| --start | -s | 应用名称或none | 启动模拟器，可指定应用或none表示仅启动模拟器 |
| --install | -i | 无 | 安装应用 |
| --yanxuan | -y | 无 | 启动模拟器并打开严选app |
| --url | -u | URL地址 | 在模拟器上打开指定URL |
| --translate | -t | URL地址 | 转换URL格式 |
| --add | 无 | 无 | 添加应用到列表 |
| --info | 无 | 应用名称 | 查看应用信息 |
| --remove | 无 | 应用名称 | 从列表中移除应用 |
| --update | 无 | 应用名称 | 更新应用信息 |
| --config | 无 | 无 | 配置管理 |

## 5. 使用示例

### 5.1 启动模拟器

```bash
# 启动模拟器并选择应用
daji ios --start
# 或
daji ios -s

# 仅启动模拟器，不打开应用
daji ios --start none
# 或
daji ios -s none

# 启动模拟器并打开指定应用
daji ios --start 应用名称
# 或
daji ios -s 应用名称
```

### 5.2 安装应用

```bash
daji ios --install
# 或
daji ios -i
```

执行此命令后，工具会显示应用列表，用户可以选择要安装的应用。

### 5.3 启动严选app

```bash
daji ios --yanxuan
# 或
daji ios -y
```

执行此命令后，工具会启动模拟器并打开严选app。

### 5.4 打开URL

```bash
# 在选择的应用中打开URL
daji ios --url https://example.com
# 或
daji ios -u https://example.com

# 在Safari中打开URL
daji ios safari --url https://example.com
# 或
daji ios safari -u https://example.com

# 在指定应用中打开URL
daji ios 应用名称 --url https://example.com
# 或
daji ios 应用名称 -u https://example.com
```

### 5.5 转换URL

```bash
daji ios --translate https://example.com
# 或
daji ios -t https://example.com

# 使用指定应用转换URL
daji ios 应用名称 --translate https://example.com
# 或
daji ios 应用名称 -t https://example.com
```

### 5.6 管理应用列表

```bash
# 添加应用
daji ios --add

# 查看应用信息
daji ios --info 应用名称

# 移除应用
daji ios --remove 应用名称

# 更新应用
daji ios --update 应用名称
```

### 5.7 配置管理

```bash
daji ios --config
```

执行此命令后，工具会提供以下配置选项：
- 导出配置
- 导入配置
- 自定义配置
- 重置配置
- 使用当前目录文件

## 6. 实现原理

1. **启动模拟器**：
   - 使用 `xcrun simctl` 命令启动iOS模拟器
   - 根据参数决定是否打开应用
   - 如果指定了应用名称，则启动该应用

2. **安装应用**：
   - 显示已配置的应用列表
   - 用户选择要安装的应用
   - 使用 `xcrun simctl install` 命令安装应用

3. **打开URL**：
   - 根据参数决定在哪个应用中打开URL
   - 转换URL格式（如果需要）
   - 使用 `xcrun simctl openurl` 命令打开URL

4. **管理应用列表**：
   - 添加应用：将应用信息添加到配置文件
   - 查看应用：显示指定应用的信息
   - 移除应用：从配置文件中移除应用
   - 更新应用：修改配置文件中的应用信息

5. **配置管理**：
   - 导出配置：将当前配置导出到本地文件
   - 导入配置：从本地文件导入配置
   - 自定义配置：手动编辑配置
   - 重置配置：恢复默认配置
   - 使用当前目录文件：使用当前目录的配置文件

## 7. 依赖关系

- `../common/iosTools` - iOS工具函数
- `../common/_IOSQuestion` - iOS相关交互问题
- `../common/appListManage` - App列表管理
- `../common/utils` - 通用工具函数
