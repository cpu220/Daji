# Host切换功能模块 (host.js)

## 1. 模块概述

Host切换功能模块用于管理和切换系统的Host文件，方便开发者在不同的开发环境间快速切换。

## 2. 功能说明

| 功能 | 描述 |
|------|------|
| 查看Host信息 | 查看当前Host文件内容或所有已配置的Host |
| 切换Host | 从配置的Host列表中选择并切换Host |
| 重置Host | 清空Host文件内容 |
| 管理Host配置 | 导入、导出和创建Host配置 |

## 3. 命令格式

```bash
daji switchHost [cmd] [options]
# 或
daji host [cmd] [options]
```

## 4. 选项说明

| 选项 | 缩写 | 参数 | 描述 |
|------|------|------|------|
| --info | 无 | all 或 无 | 查看Host信息，all表示查看所有配置 |
| --switchHost | -s | 无 | 切换Host |
| --reset | -r | 无 | 重置Host文件内容 |
| --config | 无 | 无 | 配置Host |

## 5. 使用示例

### 5.1 查看当前Host信息

```bash
daji host --info
# 或
daji host
```

执行此命令后，工具会输出当前Host文件的内容。

### 5.2 查看所有Host配置

```bash
daji host --info all
# 或
daji switchHost --info all
```

执行此命令后，工具会输出所有已配置的Host信息。

### 5.3 切换Host

```bash
daji host --switchHost
# 或
daji host -s
# 或
daji switchHost -s
```

执行此命令后，工具会显示已配置的Host列表，用户可以选择要切换的Host。

### 5.4 重置Host

```bash
daji host --reset
# 或
daji host -r
# 或
daji switchHost -r
```

执行此命令后，工具会清空Host文件内容。

### 5.5 配置Host

```bash
daji host --config
# 或
daji switchHost --config
```

执行此命令后，工具会提供以下配置选项：
- 导入Host配置
- 导出Host配置
- 创建Host配置

## 6. 实现原理

1. **查看Host信息**：
   - 读取系统Host文件内容并输出
   - 如果指定了 `all` 参数，则输出所有已配置的Host

2. **切换Host**：
   - 读取 `data/host/config.json` 中的Host配置
   - 显示Host列表供用户选择
   - 将选中的Host内容写入系统Host文件

3. **重置Host**：
   - 将系统Host文件内容清空，只保留基本说明
   - 清空已选择的Host记录

4. **管理Host配置**：
   - **导入配置**：从本地文件导入Host配置
   - **导出配置**：将当前Host配置导出到本地文件
   - **创建配置**：从当前目录的txt文件创建Host配置

## 7. 数据结构

Host配置存储在 `data/host/config.json` 文件中，格式如下：

```json
{
  "配置名称1": "Host内容1",
  "配置名称2": "Host内容2"
}
```

已选择的Host记录存储在 `data/host/selected.json` 文件中，格式如下：

```json
["配置名称1", "配置名称2"]
```

## 8. 依赖关系

- `../common/utils` - 通用工具函数
- `../common/_HostQuestion` - Host相关交互问题
- `../common/appListManage` - App列表管理
- `../data/host/config.json` - Host配置
- `../data/host/selected.json` - 已选择的Host记录
