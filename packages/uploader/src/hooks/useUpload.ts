import { useEffect, useRef, useState } from 'react';
import { UploadFunctionParams, UploadSDK } from '../core/UploadSDK';
import { UploadConfig } from '../types';
import { UploadTask } from '../core/UploadTask';
import { FileItem } from '../core/FileItem';

export type UsePloadProps = UploadConfig;

export function useUpload(props: UsePloadProps) {
  const uploadSDK = useRef<UploadSDK>();
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [uploadingQueue, setUploadingQueue] = useState<UploadTask[]>([]);
  const [pendingQueue, setPendingQueue] = useState<UploadTask[]>([]);

  useEffect(() => {
    uploadSDK.current = new UploadSDK({
      ...props,
      onFileListChange: (fileList) => {
        props.onFileListChange?.(fileList);
        setFileList([...fileList]);
      },
      onQueueChange: (uploadingQueue, pendingQueue) => {
        props.onQueueChange?.(uploadingQueue, pendingQueue);
        setUploadingQueue([...uploadingQueue]);
        setPendingQueue([...pendingQueue]);
      },
    });
    return () => {
      //
    };
  }, []);

  useEffect(() => {
    if (uploadSDK.current) {
      uploadSDK.current.changeConfig(props);
    }
  }, [props]);

  const upload = (params: UploadFunctionParams = {}) => {
    if (uploadSDK.current) {
      uploadSDK.current.upload(params);
    }
  };

  const reUpload = (file: FileItem) => {
    if (uploadSDK.current) {
      uploadSDK.current.reUpload(file);
    }
  };

  const clear = () => {
    if (uploadSDK.current) {
      uploadSDK.current.clear();
    }
  };

  const remove = (file: FileItem) => {
    if (uploadSDK.current) {
      uploadSDK.current.remove(file);
    }
  };

  const replace = (file: FileItem, parmas: UploadFunctionParams = {}) => {
    if (uploadSDK.current) {
      uploadSDK.current.replace(file, parmas);
    }
  };

  return {
    fileList,
    uploadingQueue,
    pendingQueue,
    upload,
    reUpload,
    clear,
    remove,
    replace,
  };
}
