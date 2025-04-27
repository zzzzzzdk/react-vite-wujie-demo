export default class AjaxPoller {  
  constructor(url, interval = 10000) {  
    this.url = url;  
    this.interval = interval;  
    this.polling = false; // 标志位，表示是否正在轮询  
  }  
  
  start() {  
    if (this.polling) {  
      console.warn('Poller is already running.');  
      return;  
    }  
    this.polling = true;  
    this.poll(); // 开始第一次轮询  
  }  
  
  stop() {  
    this.polling = false;  
  }  
  
  async poll() {  
    try {  
      // 发起请求  
      const response = await fetch(this.url);  
      if (!response.ok) {  
        throw new Error(`HTTP error! status: ${response.status}`);  
      }  
        
      // 处理响应数据  
      const data = await response.json();  
      console.log('Received data:', data);  
        
      // 可以在这里添加逻辑处理数据  
        
      // 如果仍需要继续轮询，则设置定时器安排下一次请求  
      if (this.polling) {  
        setTimeout(this.poll.bind(this), this.interval);  
      }  
    } catch (error) {  
      console.error('Polling error:', error);  
        
      // 如果出现错误，可以根据需要决定是否继续轮询  
      if (this.polling) {  
        setTimeout(this.poll.bind(this), this.interval);  
      }  
    }  
  }  
}  
  
// 使用示例  
// const poller = new AjaxPoller('https://api.example.com/data');  
// poller.start(); // 开始轮询  
  
// 在某个时刻，你可能想要停止轮询  
// poller.stop(); // 停止轮询