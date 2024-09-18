import { UploadErrorType } from '../../../constants';
import { FileItem } from '../../FileItem';

export function fileNameLength(fileNameMaxLength: number) {
  return {
    error: UploadErrorType.FILENAME_MAX_LENGTH_ERROR,
    validate: async (file: FileItem) => {
      if (file.name.length > fileNameMaxLength) {
        return false;
      }
      return true;
    }
  };
}
