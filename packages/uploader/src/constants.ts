export enum UploadErrorType {
  /**
   * 文件大小超出限制
   */
  FILE_MAX_SIZE_ERROR = 'FILE_MAX_SIZE_ERROR',
  /**
   * 文件类型错误
   */
  FILE_TYPE_ERROR = 'FILE_TYPE_ERROR',
  /**
   * 文件名长度超出限制
   */
  FILENAME_MAX_LENGTH_ERROR = 'FILENAME_MAX_LENGTH_ERROR',
  /**
   * 自定义错误
   */
  CUSTOM_ERROR = 'CUSTOM_ERROR',
  /**
   * 获取 token 异常
   */
  GET_TOKEN_ERROR = 'GET_TOKEN_ERROR',
  /**
   * 上传 cstore 异常
   */
  UPLOAD_CSTORE_ERROR = 'UPLOAD_CSTORE_ERROR',
  /**
   * 网络异常
   */
  NETWORK_ERROR = 'NETWORK_ERROR'
}
