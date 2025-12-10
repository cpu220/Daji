# 配置管理模块 (config.js)

## 1. 模块概述

配置管理模块用于处理工具的配置数据导入和导出功能，方便用户备份和恢复配置。

## 2. 功能说明

| 功能 | 描述 |
|------|------|
| 配置备份 | 将当前所有配置数据备份到本地 |
| 配置导入 | 从本地备份文件导入配置数据 |

## 3. 命令格式

```bash
daji config [options]
```

## 4. 选项说明

| 选项 | 缩写 | 参数 | 描述 |
|------|------|------|------|
| --install | -i | 无 | 导入备份配置 |
| --backup | -b | 无 | 备份当前配置 |

## 5. 使用示例

### 5.1 备份配置

```bash
daji config --backup
# 或
daji config -b
```

执行此命令后，工具会将所有配置数据备份到 `backup/` 目录下。

### 5.2 导入配置

```bash
daji config --install
# 或
daji config -i
```

执行此命令后，工具会从当前目录的备份文件中导入配置数据。

## 6. 实现原理

1. **配置备份**：
   - 遍历 `data/` 目录下的所有 JSON 配置文件
   - 将每个配置文件复制到 `backup/` 目录下对应的子目录
   - 保持原有的目录结构和文件名

2. **配置导入**：
   - 遍历当前目录下的所有 JSON 配置文件
   - 将每个配置文件复制到 `data/` 目录下对应的子目录
   - 覆盖原有配置文件

## 7. 数据结构

配置数据存储在 `data/` 目录下，按功能模块分类：

```
data/
├── git/
│   └── config.json
├── host/
│   ├── config.json
│   └── selected.json
├── ios/
│   ├── config.json
│   └── pan.json
└── _fileList.json
```

## 8. 依赖关系

- `getfiles` - 文件获取库
- `cfiles` - 文件操作库
- `../common/utils` - 通用工具函数
- `../data/_fileList.json` - 文件列表配置
