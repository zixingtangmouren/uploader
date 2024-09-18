/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadErrorType } from '../constants';
import { UploadState } from '../types';
import { getAuthToken } from '../utils/getAuthToken';
import axios, { CancelTokenSource } from 'axios';
import { FileItem } from './FileItem';

// const mock = () => {
//   const result = {
//     downloadUrl:
//       'https://cstore-test-private.seewo.com/SeewoFace/uwiymhllhlhwjhnohnmyymvjphphihhh?Expires=1720704881&OSSAccessKeyId=LTAI5tNbe9kEixRPse2mS6EX&Signature=if2n4tgR%2FdlRo%2FoVvFwQqp1N6kc%3D',
//     fileKey: 'SeewoFace/uwiymhllhlhwjhnohnmyymvjphphihhh',
//     fileSize: 17993
//   };
//   return new Promise(resolve => {
//     setTimeout(() => {
//       Math.random() > 0.3 ? resolve(result) : resolve(null);
//     }, 100);
//   });
// };

const CancelToken = axios.CancelToken;

interface UploadTaskOptions {
  withCredentials: boolean;
  headers: Record<any, any>;
  file: FileItem;
  onProgress?: (percent: number, file: FileItem) => void;
  onError?: (error: string, file: FileItem) => void;
  onSuccess?: (file: FileItem, result: any) => void;
}

const emptyFn = () => {};

export class UploadTask {
  file: FileItem;
  cancelTokenSource?: CancelTokenSource;
  withCredentials: boolean;
  headers: Record<any, any>;
  onProgress: (percent: number, file: FileItem) => void;
  onError: (error: string, file: FileItem) => void;
  onSuccess: (file: FileItem, result: any) => void;

  constructor(options: UploadTaskOptions) {
    this.file = options.file;
    this.withCredentials = options.withCredentials;
    this.headers = options.headers;
    this.onProgress = options.onProgress || emptyFn;
    this.onError = options.onError || emptyFn;
    this.onSuccess = options.onSuccess || emptyFn;
  }

  async run(callback: () => void = emptyFn) {
    const { onError, onSuccess } = this;

    Promise.resolve().then(async () => {
      if (navigator.onLine === false) {
        onError(UploadErrorType.NETWORK_ERROR, this.file);
        callback();
        return;
      }

      const uploadState = (await getAuthToken()) as any;

      if (!uploadState) {
        onError(UploadErrorType.GET_TOKEN_ERROR, this.file);
        callback();
        return;
      }

      const result = await this.uploadCStore(uploadState, this.file);

      // const result = await mock();

      if (!result) {
        onError(UploadErrorType.UPLOAD_CSTORE_ERROR, this.file);
      } else {
        onSuccess(this.file, result);
      }

      callback();
    });
  }

  async uploadCStore(
    uploadState: UploadState,
    file: FileItem,
    fileKey: string = 'file',
  ) {
    const { withCredentials, headers } = this;

    const policy = uploadState.policyList[0];
    const data = policy.formFields;

    const formData = new FormData();

    if (data.length) {
      data.forEach(({ key, value }) => {
        formData.append(key, value);
      });
    }

    formData.append(fileKey, file.origin);

    this.cancelTokenSource = CancelToken.source();

    try {
      const { status, data: res } = await axios.post(
        policy.uploadUrl,
        formData,
        {
          withCredentials: withCredentials,
          headers: headers,
          cancelToken: this.cancelTokenSource.token,
          onUploadProgress: ({ loaded, total = loaded }) => {
            const percent = Number(
              Math.round((loaded / total) * 100).toFixed(2),
            );
            file.percent = percent;
            this.onProgress?.(percent, file);
          },
        },
      );

      if (status === 200 && res.data.downloadUrl && res.data.fileKey) {
        return res.data;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  cancel() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('取消上传任务');
    }
  }
}
