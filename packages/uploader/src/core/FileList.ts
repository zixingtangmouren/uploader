import { FileItem } from './FileItem';

interface FileListOptions {
  onChange: (fileList: FileItem[]) => void;
}

export class FileList {
  private list: FileItem[] = [];
  private onChange: (fileList: FileItem[]) => void;

  constructor({ onChange }: FileListOptions) {
    this.onChange = onChange;
  }

  public transforms(files: File[]) {
    return files.map(
      (file) =>
        new FileItem(file, () => {
          this.onChange(this.list);
        }),
    );
  }

  public add(fileItems: FileItem[]) {
    this.list.push(...fileItems);
    this.onChange(this.list);
  }

  public forEach(callback: (file: FileItem, index: number) => void) {
    this.list.forEach(callback);
  }

  public clear() {
    this.list = [];
    this.onChange(this.list);
  }

  public remove(file: FileItem) {
    const index = this.list.findIndex((item) => item.uid === file.uid);
    if (index !== -1) {
      this.list.splice(index, 1);
      this.onChange(this.list);
    }
  }
}
