# 中文句号替换扩展 (PeriodToDot)

一个极简的 VS Code 扩展，实现单一功能：在重命名文件时，自动将中文句号（。）替换为英文点（.）。

## 功能

- 监听文件重命名事件
- 自动将文件名中的中文句号（。）替换为英文点（.）
- 适用于所有文件类型
- 无需配置，无额外功能

## 使用场景

当您习惯使用中文输入法时，重命名文件可能会不小心输入中文句号（。）而非英文点（.），导致文件扩展名出现问题。此扩展可以自动修正这一问题，让您专注于内容而不是格式细节。

## 使用方法

1. 安装扩展后，无需任何配置
2. 使用 VS Code 中的重命名功能（右键重命名或 F2 快捷键）
3. 如果输入的新文件名中包含中文句号（。），将自动替换为英文点（.）

## 安装

### 方法一：从 GitHub Releases 下载

1. 前往 [GitHub Releases](https://github.com/msgk239/PeriodToDot/releases) 页面
2. 下载最新版本的 `period-to-dot-0.0.1.vsix` 文件
3. 在 VS Code 中，打开扩展视图（Ctrl+Shift+X）
4. 点击右上角的菜单（...），选择"从 VSIX 安装..."
5. 选择下载的 .vsix 文件

### 方法二：从源码构建

参考下方的"开发"和"打包"部分。

## 开发

```bash
# 克隆仓库
git clone https://github.com/msgk239/PeriodToDot.git
cd PeriodToDot

# 安装依赖
npm install

# 打开 VS Code
code .
```

按 F5 即可在调试模式下运行扩展。

## 打包

```bash
npm run package
```

生成的 .vsix 文件可直接用于安装。

## 版本历史

- v0.0.1 (2025-04-17)：初始版本，实现基本功能

## 许可证

MIT 