/* eslint-disable no-restricted-globals */
// 导入脚本
self.importScripts("../js/spark-md5.min.js");

// 生成文件 hash
// create file hash
self.onmessage = (e) => {
  if (e.data === 'close') {
    self.postMessage('close');
    self.close();
    return
  }
  const { fileChunkList, fileName } = e.data;
  console.log('fileName', fileName)
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    reader.onload = e => {
      count++;
      spark.append(e.target?.result);
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          fileName,
          hash: spark.end()
        });
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage,
          fileName,
        });
        loadNext(count);
      }
    };
  };
  loadNext(0);
};

self.onerror = (e) => {
  console.log(e)
}