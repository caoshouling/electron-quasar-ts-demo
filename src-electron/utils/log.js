const { app, ipcMain } = require('electron');
const path = require('path');
const log = require('electron-log');

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const logFileName = `${year}-${month}-${day}.log`;
// 设置日志文件的存储路径
log.transports.file.resolvePathFn = () => {
  let rootDir = '';
  if (app.isPackaged) {
    //打包后
    //path.dirname(app.getPath('exe')) 看起来可以，但是如果安装在C盘，必须以管理员身份启动才能正常写入日志
    rootDir = app.getPath('userData'); //C:\Users\csl2021\AppData\Roaming\<项目名称>
  } else {
    //开发环境
    rootDir = app.getAppPath(); // .quasar\electron\
  }
  return path.join(rootDir, 'logs', logFileName);
};
log.transports.file.format =
  '{scope}[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
let rendererLog = log.scope('render');
function initRenderLogConfig() {
  // 监听来自渲染进程的日志消息
  ipcMain.on('log-message', (event, message, type) => {
    // 定义一个方法来处理日志记录
    if (!type || type === 'info') {
      rendererLog.info(message);
    } else if (type === 'error') {
      rendererLog.error(message);
    } else if (type === 'debug') {
      rendererLog.debug(message);
    } else if (type === 'warn') {
      rendererLog.warn(message);
    }
  });
}
initRenderLogConfig();
const mainlog = log.scope('main');
module.exports = mainlog;
