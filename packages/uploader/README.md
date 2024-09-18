# uploader

前端上传方案

## feature

现有功能

- 单/多文件上传
- 文件校验
- 上传状态管理
- 上传并发控制
- 异常机制
- 重试机制

TODO

- 秒传
- 分片上传
- 断点续传

## 使用

```tsx
function Demo() {
  const { upload, fileList, pendingQueue, uploadingQueue } = useUpload({
    multiple: true,
    uoloadTaskLimit: 5,
  });

  return <>{/* render */}</>;
}
```

## 待优化
