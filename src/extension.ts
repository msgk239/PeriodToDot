import * as vscode from 'vscode';
import * as path from 'path';

// 扩展激活函数
export function activate(context: vscode.ExtensionContext) {
  // 注册文件重命名事件监听器
  const disposable = vscode.workspace.onWillRenameFiles(event => {
    // 处理所有将要重命名的文件
    for (const fileRename of event.files) {
      const oldUri = fileRename.oldUri;
      const newUri = fileRename.newUri;
      
      // 获取新的文件路径和文件名
      const newPath = newUri.fsPath;
      const parsedPath = path.parse(newPath);
      const dirName = parsedPath.dir;
      const baseName = parsedPath.base;
      
      // 检查文件名是否包含中文句号
      if (baseName.includes('。')) {
        // 如果包含中文句号，替换为英文点
        const correctedBaseName = baseName.replace(/。/g, '.');
        
        // 构建新的完整路径
        const correctedPath = path.join(dirName, correctedBaseName);
        
        // 创建新的 URI
        const correctedUri = vscode.Uri.file(correctedPath);
        
        // 使用编辑操作修改重命名目标
        const edit = new vscode.WorkspaceEdit();
        edit.renameFile(oldUri, correctedUri);
        
        // 添加编辑到事件中
        return event.waitUntil(Promise.resolve(edit));
      }
    }
  });
  
  // 将监听器添加到上下文中，以便在扩展被禁用时清理
  context.subscriptions.push(disposable);
}

// 扩展停用函数
export function deactivate() {
  // 无需特殊清理
} 