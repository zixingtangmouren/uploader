/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileItem } from './FileItem';
import { UploadTask } from './UploadTask';

interface UploadQueueOptions {
  withCredentials: boolean;
  headers: Record<any, any>;
  uoloadTaskLimit: number;
  onQueueChange: (
    uploadingQueue: UploadTask[],
    pendingQueue: UploadTask[],
  ) => void;
}

export class UploadQueue implements UploadQueueOptions {
  uploadingQueue: UploadTask[] = [];
  pendingQueue: UploadTask[] = [];

  withCredentials: boolean;
  headers: Record<any, any>;
  uoloadTaskLimit: number;
  onQueueChange: (
    uploadingQueue: UploadTask[],
    pendingQueue: UploadTask[],
  ) => void;

  constructor(options: UploadQueueOptions) {
    this.withCredentials = options.withCredentials;
    this.headers = options.headers;
    this.uoloadTaskLimit = options.uoloadTaskLimit;
    this.onQueueChange = options.onQueueChange;
  }

  add(task: UploadTask) {
    const { uoloadTaskLimit, uploadingQueue, pendingQueue } = this;

    // 判断队列是否已满
    if (uploadingQueue.length >= uoloadTaskLimit) {
      pendingQueue.push(task);
      task.file.status = 'pending';
    } else {
      uploadingQueue.push(task);
      task.run(() => {
        // 刷新队列
        this.flush(task);
      });
      task.file.status = 'uploading';
    }

    this.onQueueChange(this.uploadingQueue, this.pendingQueue);
  }

  flush(task: UploadTask) {
    // 退出上传队列中的任务
    const index = this.uploadingQueue.findIndex(
      (uploadTask) => uploadTask === task,
    );

    if (index > -1) {
      this.uploadingQueue.splice(index, 1);

      // 取出等待队列中的任务
      if (this.pendingQueue.length) {
        const task = this.pendingQueue.shift() as UploadTask;
        this.uploadingQueue.push(task);
        task.file.status = 'uploading';
        task.run(() => {
          this.flush(task);
        });
      }
    }

    this.onQueueChange(this.uploadingQueue, this.pendingQueue);
  }

  clear() {
    this.uploadingQueue.forEach((task) => {
      task.cancel();
    });

    this.uploadingQueue = [];
    this.pendingQueue = [];
    this.onQueueChange(this.uploadingQueue, this.pendingQueue);
  }

  remove(file: FileItem) {
    const uploadIndex = this.uploadingQueue.findIndex(
      (task) => task.file.uid === file.uid,
    );

    const pendingIndex = this.pendingQueue.findIndex(
      (task) => task.file.uid === file.uid,
    );

    if (uploadIndex > -1) {
      this.uploadingQueue[uploadIndex].cancel();
      this.uploadingQueue.splice(uploadIndex, 1);
      this.onQueueChange(this.uploadingQueue, this.pendingQueue);
    }

    if (pendingIndex > -1) {
      this.pendingQueue.splice(pendingIndex, 1);
      this.onQueueChange(this.uploadingQueue, this.pendingQueue);
    }
  }
}
