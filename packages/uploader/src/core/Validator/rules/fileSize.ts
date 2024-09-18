import { UploadErrorType } from '../../../constants';
import { FileItem } from '../../FileItem';

export function fileSize(maxSize: number) {
  return {
    error: UploadErrorType.FILE_MAX_SIZE_ERROR,
    validate: async (file: FileItem) => {
      if (file.size > maxSize) {
        return false;
      }
      return true;
    }
  };
}
