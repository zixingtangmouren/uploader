import { UploadErrorType } from '../../../constants';
import { FileItem } from '../../FileItem';

export function accept(accept: string[]) {
  return {
    error: UploadErrorType.FILE_TYPE_ERROR,
    validate: async (file: FileItem) => {
      if (
        accept.length !== 0 &&
        !accept.includes('*/*') &&
        file.type &&
        !accept.includes(file.type)
      ) {
        return false;
      }
      return true;
    },
  };
}
