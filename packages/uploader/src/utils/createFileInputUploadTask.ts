interface CreateFileInputUploadTaskOptions {
  accept?: string[];
  multiple?: boolean;
  callback: (this: GlobalEventHandlers, ev: Event) => any;
}

export default function createFileInputUploadTask({
  accept = [],
  multiple = true,
  callback,
}: CreateFileInputUploadTaskOptions) {
  const input = document.createElement('input');
  input.name = 'upload-sdk';
  input.type = 'file';
  input.accept = accept.join(',') || '';
  input.multiple = multiple;
  input.onchange = callback;
  input.value = '';
  input.click();
  return input;
}
