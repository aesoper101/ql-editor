import Module from "quill/core/module";
import Quill, { RangeStatic } from "quill";
import mimelite from "mime/lite";
import Delta from "quill-delta";
import _ from "lodash";

export interface UploadRequestSuccess {
  uploadType: "image" | "video" | "audio" | "attachment";
  url: string;
  data?: string;
}

export type UploadRequest = (file: File) => Promise<UploadRequestSuccess>;

interface UploaderOptions {
  imageAllowFiles: string[];
  imageMaxSize: number; // [默认值：2048000] //上传大小限制，单位B
  allowDropUpload: boolean;
  videoAllowFiles: string[];
  videoMaxSize: number; //  [默认值：102400000] //上传大小限制，单位B，默认100MB，
  audioAllowFiles: string[];
  audioMaxSize: number; //  [默认值：102400000] //上传大小限制，单位B，默认100MB，
  attachmentAllowFiles: string[];
  attachmentMaxSize: number; // [默认值：51200000] //上传大小限制，单位B，默认50MB
  uploadRequest?: UploadRequest; // 返回第
  uploadImageRequest?: UploadRequest; // 返回第
  uploadVideoRequest?: UploadRequest; // 返回第
  uploadAudioRequest?: UploadRequest; // 返回第
  uploadAttachmentRequest?: UploadRequest; // 返回第
}

class Uploader extends Module {
  options: UploaderOptions = {
    imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
    videoAllowFiles: [".mp4", ".flv"],
    audioAllowFiles: [".mp3"],
    attachmentAllowFiles: [".zip", ".doc"],
    allowDropUpload: false,
    imageMaxSize: 2048000,
    videoMaxSize: 102400000,
    audioMaxSize: 102400000,
    attachmentMaxSize: 51200000,
  };

  constructor(quill: Quill, options: UploaderOptions) {
    super(quill, options);
    _.merge(this.options, options);

    if (this.options.allowDropUpload) {
      quill.root.addEventListener("drop", (e) => {
        e.preventDefault();
        let native;
        if (document.caretRangeFromPoint) {
          native = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else if (document.caretPositionFromPoint) {
          const position = document.caretPositionFromPoint(
            e.clientX,
            e.clientY
          );
          if (position == null) return;
          native = document.createRange();
          native.setStart(position.offsetNode, position.offset);
          native.setEnd(position.offsetNode, position.offset);
        } else {
          return;
        }
        const normalized = quill.selection.normalizeNative(native);
        const range = quill.selection.normalizedToRange(normalized);
        e.dataTransfer && this.upload(range, e.dataTransfer.files);
      });
    }
  }

  upload(range: RangeStatic, files: FileList | null): void {
    const uploads: Record<string, File[]> = {};

    if (files === null) return;
    const fileList = Array.from(files);
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].type) {
        let uploadType = fileList[i].type.split("/")[0];
        if (!["image", "video", "audio"].includes(uploadType)) {
          uploadType = "attachment";
        }

        // 判断大小是否超过限制
        if (!this.checkMaxSize(uploadType, fileList[i])) {
          // todo 提示已经超过限制大小
          alert("超过限制");
          return;
        }

        // 判断是否允许上传的类型
        if (!this.checkExt(uploadType, fileList[i])) {
          // todo 是否允许上传的类型
          alert("文件为不允许上传的类型");
          return;
        }

        if (uploads[uploadType]) {
          uploads[uploadType].push(fileList[i]);
        } else {
          uploads[uploadType] = [fileList[i]];
        }
      }
    }

    if (uploads) {
      this.handler(range, uploads);
    }
    return;
  }

  private checkExt(uploadType: string, file: File): boolean {
    const ext = mimelite.getExtension(file.type);
    if (!ext) return false;

    let allowExt: string[] = this.options.imageAllowFiles;
    switch (uploadType) {
      case "video":
        allowExt = this.options.videoAllowFiles;
        break;
      case "audio":
        allowExt = this.options.audioAllowFiles;
        break;
      case "attachment":
        allowExt = this.options.attachmentAllowFiles;
        break;
    }

    return (
      allowExt.filter((value) => {
        return mimelite.getType(value) === file.type;
      }).length > 0
    );
  }

  private checkMaxSize(uploadType: string, file: File): boolean {
    switch (uploadType) {
      case "video":
        return file.size < this.options.videoMaxSize;
      case "audio":
        return file.size < this.options.audioMaxSize;
      case "attachment":
        return file.size < this.options.attachmentMaxSize;
      default:
        return file.size < this.options.imageMaxSize;
    }
  }

  private getRequest(uploadType: string) {
    let req: UploadRequest | undefined = undefined;
    switch (uploadType) {
      case "video":
        req = this.options.uploadVideoRequest;
        break;
      case "audio":
        req = this.options.uploadAudioRequest;
        break;
      case "attachment":
        req = this.options.uploadAttachmentRequest;
        break;
      case "image":
        req = this.options.uploadImageRequest;
        break;
    }

    return req || this.options.uploadRequest;
  }

  private handler(range: RangeStatic, files: Record<string, File[]>) {
    const promises: Promise<unknown>[] = [];

    for (const uploadType in files) {
      // eslint-disable-next-line no-prototype-builtins
      if (!files.hasOwnProperty(uploadType)) continue; //***

      const uploadRequest = this.getRequest(uploadType);
      if (
        ["attachment", "video", "audio"].includes(uploadType) &&
        !uploadRequest
      ) {
        // todo 必须实现上传接口提示
        alert("必须实现上传接口");
        return;
      }

      const promiseList =
        files[uploadType] &&
        files[uploadType].map((file) => {
          if (uploadRequest) {
            return uploadRequest(file);
          }

          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              e.target && resolve({ type: uploadType, data: e.target.result });
            };
            reader.readAsDataURL(file);
          });
        });

      promises.push(...promiseList);
    }

    Promise.all(promises).then((images) => {
      const update: Delta = images.reduce((delta: Delta, image: any) => {
        if (typeof image === "object") {
          const data: Record<string, string> = {};
          data[image.type || "image"] = image.url || image.data;
          return delta.insert(data);
        }
        return delta.insert({ image });
      }, new Delta().retain(range.index).delete(range.length));
      this.quill.updateContents(update, "user");
      this.quill.setSelection(range.index, images.length, "silent");
    });
  }
}

export default Uploader;
