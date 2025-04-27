var express = require('express');
var router = express.Router();

router.all('/v1/targetretrieval1/*/export', async function (req, res) {
  // 设置响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream;charset=UTF-8', // 启用 Stream
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    // 跨域处理
    'Access-Control-Allow-Origin': '*', // 允许任何域访问
    'Access-Control-Allow-Headers': '*', // 允许携带任何请求头信息
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
    'Access-Control-Max-Age': 86400
  });

  let step = 0;
  // 模拟每秒钟发送一条消息
  let timer = setInterval(() => {
    const data = {
      message: 'success!',
      progress: 0,
      url: ''
    };
    step++
    if (step === 10) {
      clearInterval(timer);
      // 最后一项数据，使用 end 来发送
      res.end(`data: ${JSON.stringify({
        ...data,
        progress: 100,
        url: '/123'
      })}\n\n`);
    } else {
      // 分块推流
      res.write(`data: ${JSON.stringify({
        ...data,
        progress: 10 * step
      })}\n\n`);
    }
  }, 1000);

});

module.exports = router;