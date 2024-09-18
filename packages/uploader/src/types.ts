/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadTask } from './core/UploadTask';
import { FileItem } from './core/FileItem';
import { Rule } from './core/Validator';

export interface UploadBaseConfig {
  /**
   * 可以上传的文件 MIME 类型
   */
  accept?: string[];
  /**
   * 单个文件大小限制
   */
  fileMaxSize?: number;
  /**
   * 是否支持多文件上传
   */
  multiple?: boolean;
  /**
   * 文件名最大长度
   */
  fileNameMaxLength?: number;

  withCredentials?: boolean;

  headers?: Record<any, any>;

  /**
   * 上传并发限制
   */
  uoloadTaskLimit?: number;

  /**
   * 统一校验规则
   */
  rules?: Rule[];
}

export interface UploadCallbackConfig {
  // /**
  //  * 上传之前的校验
  //  * @param file
  //  * @returns
  //  */
  // beforeUpload?: (
  //   file: FileItem
  // ) => Promise<{ error: string | null }> | { error: string | null };

  /**
   * 上传失败的回调
   * @param error
   * @returns
   */
  onError?: (errorType: string, file: FileItem) => void;

  /**
   * 上传成功的回调
   * @param file
   * @returns
   */
  onSuccess?: (file: FileItem, result: any) => void;

  /**
   * 文件列表变化回调
   * @param fileList
   * @returns
   */
  onFileListChange?: (fileList: FileItem[]) => void;

  /**
   * 上传队列变化回调
   * @param uploadingQueue
   * @param pendingQueue
   * @returns
   */
  onQueueChange?: (
    uploadingQueue: UploadTask[],
    pendingQueue: UploadTask[],
  ) => void;
}

export type UploadConfig = UploadBaseConfig & UploadCallbackConfig;

export interface FormFieldItem {
  key: string;
  value: string;
}

export interface PolicyListItem {
  priority: number;
  type: 'aliyun' | 'qiniu' | 'tencent';
  uploadUrl: string;
  formFields: FormFieldItem[];
}

export interface UploadState {
  appId: string;
  expireSeconds: number;
  keyPrefix: string;
  policyList: PolicyListItem[];
}
