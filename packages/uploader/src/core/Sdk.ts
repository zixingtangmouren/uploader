import createFileInputUploadTask from '../utils/createFileInputUploadTask';
import { FileList } from './FileList';

interface SdkOptions {
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
  /**
   * 允许上传的最大文件数量
   */
  maxCount?: number;

  withCredentials?: boolean;

  headers?: Record<any, any>;
}

interface UploadFunctionParams extends Partial<SdkOptions> {
  files?: File[];
}

const defaultOptions: SdkOptions = {
  accept: [],
  multiple: true,
  fileNameMaxLength: 100,
  maxCount: 10,
  withCredentials: false,
  headers: {},
};

export class Sdk {
  private options: SdkOptions;
  private fileList: FileList;
  constructor(options?: SdkOptions) {
    this.options = { ...defaultOptions, ...options };
    this.fileList = new FileList({
      onChange: () => {},
    });
  }

  public upload({ files, ...options }: UploadFunctionParams = {}) {
    const { accept, multiple } = options;
    if (!files || !files.length) {
      // input 场景
      createFileInputUploadTask({
        accept: accept || this.options.accept,
        multiple:
          typeof multiple !== 'undefined' ? multiple : this.options.multiple,
        callback: (e) => {
          const files = (e.target as HTMLInputElement)
            .files as unknown as File[];
          this.run(files);
        },
      });
    } else {
      // 自定义传入 file 场景
      this.run(files);
    }
  }

  private run(files: File[]) {
    const fileItems = this.fileList.transforms(files);
    this.fileList.add(fileItems);
    // 创建上传任务
    // 交给 Queue 进行调度
  }
}
