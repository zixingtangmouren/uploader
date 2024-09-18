/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateFileUid } from '../utils/generateFileUid';

export class FileItem {
  uid: string;
  name: string;
  size: number;
  type: string;
  _status: 'error' | 'done' | 'uploading' | 'pending';
  percent: number;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  error?: string;
  origin: File;
  extra: Record<string, any> = {};
  onStatusChange: (status: string) => void = () => {};

  // 暂时不考虑下面字段
  url?: string;
  thumbUrl?: string;
  crossOrigin?: string;

  constructor(file: File, onStatusChange?: (status: string) => void) {
    this.uid = generateFileUid(file);
    this.name = file.name;
    this.size = file.size;
    this.type = file.type;
    this._status = 'pending';
    this.percent = 0;
    this.lastModified = file.lastModified;
    this.lastModifiedDate = (file as any).lastModifiedDate;
    this.webkitRelativePath = file.webkitRelativePath;
    this.error = undefined;
    this.origin = file;

    this.onStatusChange = onStatusChange || (() => {});
  }

  get status() {
    return this._status;
  }

  set status(status: 'error' | 'done' | 'uploading' | 'pending') {
    this._status = status;
    this.onStatusChange(status);
  }
}
