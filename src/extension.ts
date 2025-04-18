import * as vscode from 'vscode';
import * as path from 'path';

// 扩展激活函数
export function activate(context: vscode.ExtensionContext) {
  console.log('PeriodToDot 扩展已激活!');
  
  // 显示通知
  vscode.window.showInformationMessage('PeriodToDot 扩展已激活');
  
  // 创建一个文件系统观察者，监视所有类型的文件变动
  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*');
  
  // 监听重命名事件（这是在重命名发生后）
  fileSystemWatcher.onDidCreate(async (newUri) => {
    console.log(`文件创建: ${newUri.fsPath}`);
    
    const fileName = path.basename(newUri.fsPath);
    if (fileName.includes('。')) {
      console.log(`发现中文句号: ${fileName}`);
      const correctedName = fileName.replace(/。/g, '.');
      const parentDir = path.dirname(newUri.fsPath);
      const correctedPath = path.join(parentDir, correctedName);
      const correctedUri = vscode.Uri.file(correctedPath);
      
      console.log(`将重命名为: ${correctedPath}`);
      
      try {
        // 创建工作区编辑
        const edit = new vscode.WorkspaceEdit();
        edit.renameFile(newUri, correctedUri);
        
        // 应用编辑
        const success = await vscode.workspace.applyEdit(edit);
        if (success) {
          vscode.window.showInformationMessage(`已将中文句号替换为英文点: ${fileName} → ${correctedName}`);
        } else {
          console.log('重命名失败');
        }
      } catch (error) {
        console.error('重命名过程中发生错误:', error);
      }
    }
  });
  
  // 添加监听器到上下文中以便清理
  context.subscriptions.push(fileSystemWatcher);
  
  // 添加一个命令用于手动修正当前文件的文件名
  const fixCurrentFileCommand = vscode.commands.registerCommand('period-to-dot.fixCurrentFile', async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showInformationMessage('没有打开的文件');
      return;
    }
    
    const uri = activeEditor.document.uri;
    const fileName = path.basename(uri.fsPath);
    
    if (!fileName.includes('。')) {
      vscode.window.showInformationMessage('当前文件名不包含中文句号');
      return;
    }
    
    const correctedName = fileName.replace(/。/g, '.');
    const parentDir = path.dirname(uri.fsPath);
    const correctedPath = path.join(parentDir, correctedName);
    const correctedUri = vscode.Uri.file(correctedPath);
    
    // 创建工作区编辑
    const edit = new vscode.WorkspaceEdit();
    edit.renameFile(uri, correctedUri);
    
    // 应用编辑
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
      vscode.window.showInformationMessage(`已将中文句号替换为英文点: ${fileName} → ${correctedName}`);
    } else {
      vscode.window.showErrorMessage('重命名失败');
    }
  });
  
  context.subscriptions.push(fixCurrentFileCommand);
  
  // 注册重命名事件监听器 (旧方法但保留为备用)
  const renameListener = vscode.workspace.onWillRenameFiles(event => {
    console.log('检测到文件重命名事件 (onWillRenameFiles)');
    
    let hasChanged = false;
    const edit = new vscode.WorkspaceEdit();
    
    for (const { oldUri, newUri } of event.files) {
      const newPath = newUri.fsPath;
      const fileName = path.basename(newPath);
      
      console.log(`重命名检测: ${oldUri.fsPath} -> ${newUri.fsPath}`);
      console.log(`文件名: ${fileName}`);
      
      if (fileName.includes('。')) {
        const correctedName = fileName.replace(/。/g, '.');
        const parentDir = path.dirname(newPath);
        const correctedPath = path.join(parentDir, correctedName);
        const correctedUri = vscode.Uri.file(correctedPath);
        
        console.log(`将修正为: ${correctedPath}`);
        
        edit.renameFile(oldUri, correctedUri);
        hasChanged = true;
      }
    }
    
    if (hasChanged) {
      console.log('返回修正后的重命名编辑');
      return event.waitUntil(Promise.resolve(edit));
    }
    
    return undefined;
  });
  
  context.subscriptions.push(renameListener);
  
  // 添加测试命令
  const testCommand = vscode.commands.registerCommand('period-to-dot.test', () => {
    vscode.window.showInformationMessage('测试命令执行中...');
    
    // 测试中文句号识别和替换
    const testStr = "测试。文本";
    console.log(`测试字符串: "${testStr}"`);
    
    for (let i = 0; i < testStr.length; i++) {
      const char = testStr.charAt(i);
      const codePoint = testStr.codePointAt(i);
      console.log(`  位置 ${i}: '${char}' (U+${codePoint?.toString(16).padStart(4, '0')})`);
    }
    
    const replaced = testStr.replace(/。/g, '.');
    console.log(`替换后: "${replaced}"`);
    
    vscode.window.showInformationMessage(`测试替换: "${testStr}" → "${replaced}"`);
  });
  
  context.subscriptions.push(testCommand);
}

// 扩展停用函数
export function deactivate() {
  console.log('PeriodToDot 扩展已停用');
} 