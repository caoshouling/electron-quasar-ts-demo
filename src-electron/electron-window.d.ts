/* 定义preload.js中暴露的变量 */

declare global {
  interface Window {
    logger: {
      info: (message: string) => void;
      error: (message: string) => void;
      debug: (message: string) => void;
      warn: (message: string) => void;
    };
  }
}
export {};
