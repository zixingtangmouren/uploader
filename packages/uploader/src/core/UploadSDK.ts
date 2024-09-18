import { UploadConfig, UploadBaseConfig } from '../types';

import { FileList } from './FileList';
import { UploadQueue } from './UploadQueue';
import { InputTrigger } from './InputTrigger';
import { FileItem } from './FileItem';
import { Rule, Validator } from './Validator';
import { UploadTask } from './UploadTask';

import { accept } from './Validator/rules/accept';
import { fileSize } from './Validator/rules/fileSize';
import { fileNameLength } from './Validator/rules/fileNameLength';

const defailtConfig: Required<UploadConfig> = {
  accept: ['*/*'],
  withCredentials: false,
  fileMaxSize: Infinity,
  multiple: false,
  fileNameMaxLength: 50,
  uoloadTaskLimit: 10,
  headers: {},
  rules: [],
  onError: (errorType, file) => console.error(errorType, file),
  onSuccess: () => {},
  onFileListChange: () => {},
  onQueueChange: () => {},
};

export type Validatetor = () => {
  error: string;
  validate: (file: FileItem) => Promise<boolean>;
};

export interface UploadFunctionParams extends Partial<UploadBaseConfig> {
  files?: File[];
  onFileSelect?: (files: FileItem[]) => void;
}

export class UploadSDK {
  config: Required<UploadConfig>;
  inputTrigger: InputTrigger;
  fileList: FileList;
  validator: Validator;
  uploadQueue: UploadQueue;

  constructor(config: UploadConfig = {}) {
    this.config = {
      ...defailtConfig,
      ...config,
    };

    this.inputTrigger = new InputTrigger({
      accept: this.config.accept,
      multiple: this.config.multiple,
    });

    this.fileList = new FileList({
      onChange: this.config.onFileListChange,
    });

    this.validator = new Validator([
      accept(this.config.accept),
      fileSize(this.config.fileMaxSize),
      fileNameLength(this.config.fileNameMaxLength),
      ...this.config.rules,
    ]);

    this.uploadQueue = new UploadQueue({
      withCredentials: this.config.withCredentials,
      headers: this.config.headers,
      uoloadTaskLimit: this.config.uoloadTaskLimit,
      onQueueChange: this.config.onQueueChange,
    });
  }

  createTask(file: FileItem) {
    return new UploadTask({
      file,
      withCredentials: this.config.withCredentials,
      headers: this.config.headers,
      onSuccess: (_fileItem, result) => {
        _fileItem.status = 'done';
        this.config.onSuccess(_fileItem, result);
      },
      onError: (error, _fileItem) => {
        _fileItem.error = error;
        _fileItem.status = 'error';
        this.config.onError(error, _fileItem);
      },
    });
  }

  runUpload(fileItems: FileItem[], { rules }: { rules?: Rule[] }) {
    const { fileList, validator, config, uploadQueue } = this;

    fileList.add(fileItems);
    fileItems.forEach(async (fileItem) => {
      const error = await validator.validate(fileItem, rules);
      if (error) {
        fileItem.error = error;
        fileItem.status = 'error';
        config.onError(error, fileItem);
      } else {
        // 创建上传任务
        const task = this.createTask(fileItem);
        // 添加到上传队列
        uploadQueue.add(task);
      }
    });
  }

  upload({
    files,
    multiple,
    accept,
    rules,
    onFileSelect = () => {},
  }: UploadFunctionParams) {
    if (!files) {
      this.inputTrigger.trigger({
        callback: (_files) => {
          const fileItems = this.fileList.transforms(_files);
          // 通过 SDK 触发的文件选择才会有回调
          onFileSelect(fileItems);
          this.runUpload(fileItems, { rules });
        },
        options: { multiple, accept },
      });
    } else {
      const fileItems = this.fileList.transforms(files);
      this.runUpload(fileItems, { rules });
    }
  }

  /**
   * TODO: 合理性有待验证，当前主要是为了解决 hooks 闭包问题
   * @param config
   */
  changeConfig(config: UploadConfig) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.inputTrigger.accept = this.config.accept;
    this.inputTrigger.multiple = this.config.multiple;

    this.validator.rules = [
      accept(this.config.accept),
      fileSize(this.config.fileMaxSize),
      fileNameLength(this.config.fileNameMaxLength),
      ...this.config.rules,
    ];

    this.uploadQueue.withCredentials = this.config.withCredentials;
    this.uploadQueue.headers = this.config.headers;
    this.uploadQueue.uoloadTaskLimit = this.config.uoloadTaskLimit;
  }

  // 复用文件索引，不进行二次校验，重新上传
  reUpload(fileItem: FileItem) {
    fileItem.error = undefined;
    fileItem.status = 'pending';
    const task = this.createTask(fileItem);
    this.uploadQueue.add(task);
  }

  // 删除原文件索引，重新校验上传
  replace(fileItem: FileItem, parmas: UploadFunctionParams = {}) {
    this.upload({
      ...parmas,
      onFileSelect: () => {
        this.remove(fileItem);
      },
    });
  }

  /**
   * 清除 FileList 和 UploadQueue 中的数据
   */
  clear() {
    this.fileList.clear();
    this.uploadQueue.clear();
  }

  remove(file: FileItem) {
    this.fileList.remove(file);
    this.uploadQueue.remove(file);
  }
}
