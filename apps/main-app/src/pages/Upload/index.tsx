import React, { useState, useEffect, useRef, ChangeEvent, useMemo } from 'react'
import { Button, Upload, Progress, Table, Message } from '@yisa/webui';
import { UploadItem } from '@yisa/webui/es/Upload';
import ajax from '@/utils/axios.config';
import './index.scss'

enum Status {
  wait = "wait",
  pause = "pause",
  uploading = "uploading",
  success = "success"
}

type StatusType = `${Status}`
// type StatusType = keyof typeof Status

interface fileChunkItem {
  file: Blob;
  fileHash?: string;
  fileName?: string;
  index?: number;
  hash?: string;
  chunk?: Blob;
  size?: number;
  percentage?: number;
}

interface UploadFileItem extends File {
  hash?: string;
  status: StatusType;
  fileChunkList?: fileChunkItem[];
  hashPercentage?: number;
}

// TODO: 多个文件上传的进度展示
// TODO：接口各部分传参是否在正确
function Page() {

  const uploadConfig = useRef({
    chunkSize: 10 * 1024 * 1024,
    backenUrl: "http://localhost:3000/upload_url"
  })

  const hashWorker = useRef<Worker>()
  // 上传的文件
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const [uploadFilesShow, setUploadFilesShow] = useState<UploadFileItem[]>([])

  // 上传请求数组
  const requestList = useRef<XMLHttpRequest[]>([])

  const [hashPercentage, setHashPercentage] = useState(0)

  const [uploadStatus, setUploadStatus] = useState(Status.wait)

  // const [data, setData] = useState([])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    const files = event.target.files;
    if (!files?.length) return;
    resetData();
    // Object.assign(this.$data, this.$options.data());
    // this.container.file = file;
    setUploadFiles([...files])
  }

  // 加上async/await，支持遍历过程中执行同步代码
  const CustomForeach = async (arr: any[], callback: (item: any, index: number) => void) => {
    const length = arr.length;
    let index = 0;
    while (index < length) {
      // console.log('doing foreach...');
      const item = arr[index];
      await callback(item, index);
      index++;
    }
  };

  const handleUpload = async () => {
    if (!uploadFiles.length) {
      Message.warning("请先上传文件!")
      return
    }
    // setUploadStatus(Status.uploading)
    console.log(uploadFiles)
    const _fileShow = uploadFiles.map(item => {
      return Object.assign(item, {
        status: Status.wait
      })
    })
    console.log(_fileShow)
    setUploadFilesShow([..._fileShow])

    CustomForeach(uploadFiles, async (item, index) => {
      const fileName = item.name
      const fileChunkList = createFileChunk(item);

      // 同步进行
      const hash: unknown = await calculateHash(fileChunkList, fileName);
      console.log(`${fileName}计算完成hash: `, hash)

      // 异步并行
      // calculateHash(fileChunkList, fileName);

      // 验证文件是否存在
      const { shouldUpload, uploadedList } = await verifyUpload(
        fileName,
        hash
      );

      if (!shouldUpload) {
        Message.success(
          "skip upload：file upload success, check /target directory"
        );
        item.status = Status.success;
        return;
      }

      setUploadFilesShow(prevData => prevData.map(
        prev =>
          prev.name === fileName
            ?
            Object.assign(prev, {
              fileChunkList: fileChunkList.map(({ file }, index) => ({
                fileName: fileName,
                fileHash: hash,
                index,
                hash: hash + "-" + index,
                chunk: file,
                size: file.size,
                percentage: uploadedList.includes(index) ? 100 : 0
              }))
            })
            :
            prev
      ))

      await uploadChunks(uploadedList, fileChunkList, item);
    })
  }

  // 生成文件切片
  // create file chunk
  const createFileChunk = (file: File, size = uploadConfig.current.chunkSize) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  }

  // 生成文件 hash（web-worker）
  // use web-worker to calculate hash
  const calculateHash = (fileChunkList: fileChunkItem[], fileName: string) => {
    return new Promise(resolve => {
      // if (hashWorker.current) {
      const worker = new Worker("/static/worker/hash.worker.js");
      worker.onerror = (e) => {
        console.log(e)
      }
      worker.onmessage = e => {
        const { percentage, hash } = e.data;
        console.log(`${fileName}生成hash进度：`, percentage)
        // setHashPercentage(percentage)
        setUploadFilesShow(
          prevData =>
            prevData.map(
              prev =>
                prev.name === fileName
                  ?
                  Object.assign(prev, { hashPercentage: percentage })
                  :
                  prev
            ))
        if (hash) {
          resolve(hash);
          // console.log(`${fileName}计算完成hash: `, hash)
          worker.terminate()
          setUploadFilesShow(
            prevData =>
              prevData.map(prev =>
                prev.name === fileName
                  ?
                  Object.assign(prev, { hash: hash, hashPercentage: 100 })
                  :
                  prev
              ))
        }
      };
      // console.log("worker", worker)
      worker.postMessage({ fileChunkList, fileName });
      // }
    });
  }

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  const verifyUpload = async (filename: string, fileHash: unknown) => {
    const { data } = await ajax({
      method: "post",
      url: "/verify",
      data: {
        filename,
        fileHash
      },
      headers: {
        "content-type": "application/json"
      },
    })

    return data
  }

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  // verify that the file has been uploaded based on the hash
  // skip if uploaded
  const uploadChunks = async (uploadedList: string[] = [], fileChunkList: fileChunkItem[] = [], fileItem: UploadFileItem) => {
    // CustomForeach(uploadFilesShow, async (item, index) => {
    const requestListNew = fileChunkList
      .filter(({ hash }) => !uploadedList.includes((hash ?? '')))
      .map(({ chunk, hash, index, fileHash, fileName }) => {
        const formData = new FormData();
        formData.append("chunk", chunk || '');
        formData.append("hash", hash || '');
        formData.append("filename", fileName || '');
        formData.append("fileHash", fileHash || '');
        return { formData, index };
      })
      .map(({ formData, index }) =>
        request({
          url: "/upload-chunk",
          data: formData,
          onProgress: createProgressHandler(fileChunkList[(index ?? 0)]),
        })
      );
    await Promise.all(requestListNew);
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时合并切片
    // merge chunks when the number of chunks uploaded before and
    // the number of chunks uploaded this time
    // are equal to the number of all chunks
    if (uploadedList.length + requestList.current.length === fileChunkList.length) {
      await mergeRequest(fileItem);
    }

    // })
  }

  // xhr
  const request = ({
    url,
    method = "post",
    data,
    headers = {},
    onProgress = e => e,
  }: {
    url: string,
    method?: string,
    data?: any,
    headers?: { [key: string]: string },
    onProgress?: (e: ProgressEvent) => void
  }): Promise<any> => {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = onProgress;
      xhr.open(method, url);
      Object.keys(headers).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      );
      xhr.send(data);
      xhr.onload = (ev: ProgressEvent) => {
        // 将请求成功的 xhr 从列表中删除
        // remove xhr which status is success
        if (requestList.current) {
          const xhrIndex = requestList.current.findIndex(item => item === xhr);
          requestList.current.splice(xhrIndex, 1);
        }
        console.log(ev)
        resolve({
          data: (ev.target as XMLHttpRequest).response
        });
      };
      // 暴露当前 xhr 给外部
      // export xhr
      requestList.current?.push(xhr);
    });
  }

  // 用闭包保存每个 chunk 的进度数据
  // use closures to save progress data for each chunk
  const createProgressHandler = (item: fileChunkItem) => {
    return (e: ProgressEvent) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100));
    };
  }

  // 通知服务端合并切片
  // notify server to merge chunks
  const mergeRequest = async (fileItem: UploadFileItem) => {
    await request({
      url: "/merge",
      headers: {
        "content-type": "application/json"
      },
      data: JSON.stringify({
        size: uploadConfig.current.chunkSize,
        fileHash: fileItem.hash,
        filename: fileItem.name
      })
    });
    Message.success("upload success, check /target directory");
    setUploadFilesShow(prevData => prevData.map(prev => prev.name === fileItem.name ? Object.assign(prev, { status: Status.wait }) : prev))
  }

  const resetData = () => {
    requestList.current.forEach(xhr => xhr?.abort())
    requestList.current = []
    // if (hashWorker.current) {
    //   hashWorker.current.onmessage = null;
    // }
  }

  // 暂停上传
  const handlePause = () => {
    setUploadFilesShow(prevData => prevData.map(prev => Object.assign(prev, { status: Status.pause })))
    resetData();
  }

  // 续传
  const handleResume = async () => {
    setUploadFilesShow(prevData => prevData.map(prev => Object.assign(prev, { status: Status.uploading })))
    CustomForeach(uploadFilesShow, async (item, index) => {
      const { uploadedList } = await verifyUpload(
        item.name,
        item.hash
      );
      await uploadChunks(uploadedList, item.fileChunkList, item);
    })
  }

  // 删除
  const handleDelete = async () => {
    const { data } = await request({
      url: "/delete"
    });
    console.log(data)
    if (JSON.parse(data).code === 0) {
      Message.success("delete success");
    }
  }

  const uploadDisabled = useMemo(() =>
    !uploadFiles.length
    ||
    uploadFilesShow.filter(o => o.status === Status.pause || o.status === Status.uploading).length > 0
    ,
    [uploadFiles, uploadFilesShow]
  )

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: '文件hash',
      dataIndex: 'hash',
      key: 'hash'
    },
    {
      title: 'hash计算进度',
      dataIndex: 'hashPercentage',
      key: 'hashPercentage'
    },
    {
      title: '文件上传总进度',
      dataIndex: 'progress',
      key: 'progress'
    },
  ]

  useEffect(() => {
    console.log(uploadFilesShow)
  }, [uploadFilesShow])

  return <div>
    {/* <Upload
      // multiLine={true}
      drag
      multiple
      action="/upload"
      beforeUpload={handleBeforeUpload}
      onChange={handleUploadChange}
    /> */}
    <input
      type="file"
      disabled={uploadStatus !== Status.wait}
      multiple
      onChange={handleFileChange}
    />

    <Button onClick={handleUpload} disabled={uploadDisabled}>upload</Button>
    <Button>resume</Button>
    <Button>pause</Button>
    <Button>delete</Button>

    <div className='chunk-hash-percentage'>
      <Progress
        percent={100}
        strokeWidth={10}
        status={uploadStatus}
        strokeColor={{
          '0%': '#108ee9',
          '50%': '#87d068',
        }}
      />
    </div>
    <div className='upload-percentage'>
      <Progress
        percent={100}
        strokeWidth={10}
        status={uploadStatus}
        strokeColor={{
          '0%': '#108ee9',
          '50%': '#87d068',
        }}
      />
    </div>

    <div className="upload-result">
      <Table
        columns={columns}
        data={uploadFilesShow}
        rowKey={(record: any) => (record.hash + record.name) as React.Key}
      />
    </div>
  </div>
}


export default Page
