import { UploadErrorType } from '../../../constants';
import { FileItem } from '../../FileItem';

export function custom(cb: (file: FileItem) => Promise<boolean> | boolean) {
  return {
    error: UploadErrorType.CUSTOM_ERROR,
    validate: async (file: FileItem) => {
      try {
        // null undefined 或者错误 字符串
        const res = await cb(file);
        return res;
      } catch {
        return false;
      }
    },
  };
}
