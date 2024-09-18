interface InputTriggerOptions {
  accept?: string[];
  multiple?: boolean;
}

interface TriggerParams {
  callback: FileCallback;
  options: InputTriggerOptions;
}

interface FileCallback {
  (fileItems: File[]): void;
}

export class InputTrigger {
  inputRef: HTMLInputElement | null = null;
  accept: string[];
  multiple: boolean;

  constructor({ accept = [], multiple = true }: InputTriggerOptions) {
    this.accept = accept;
    this.multiple = multiple;
  }

  trigger(params: TriggerParams) {
    this.createFileInput(params);
    if (this.inputRef) {
      this.inputRef.click();
    }
  }

  createFileInput({ callback, options }: TriggerParams) {
    {
      if (!this.inputRef) {
        const input = document.createElement('input');
        input.name = 'upload-sdk';
        input.type = 'file';
        input.accept = this.accept.join(',') || '';
        this.inputRef = input;
      }

      // 允许单次调用的覆盖使用
      if (this.inputRef) {
        this.inputRef.multiple =
          typeof options.multiple !== 'undefined'
            ? options.multiple
            : this.multiple;

        this.inputRef.accept =
          typeof options.accept !== 'undefined'
            ? options.accept.join(',')
            : this.accept.join(',');
      }

      this.inputRef.onchange = this.onFileChange.bind(this, callback);
      this.inputRef.value = '';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileChange(callback: FileCallback, e: any) {
    const fileList = e.target.files as File[];
    const files = Array.from(fileList);
    callback(files);
  }
}
