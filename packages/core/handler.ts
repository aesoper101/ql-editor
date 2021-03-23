import { HandlerFunc } from "../ui/toolbar/type";
import Uploader from "../modules/uploader";
import mimelite from "mime/lite";

export const DEFAULT_HANDLERS: Record<string, HandlerFunc> = {
  image: (quill) => {
    let fileInput = quill.container.querySelector("input.ql-image[type=file]");
    if (fileInput == null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      const uploader = quill.getModule("uploader") as Uploader;
      const mimetypes = uploader.options.imageAllowFiles.map(
        (value: string) => {
          return mimelite.getType(value);
        }
      );

      fileInput.setAttribute("accept", mimetypes.join(", "));
      fileInput.classList.add("ql-image");
      fileInput.classList.add("ql-image");
      fileInput.addEventListener("change", () => {
        const range = quill.getSelection(true);
        uploader.upload(range, (fileInput as HTMLInputElement).files);
        (fileInput as HTMLInputElement).value = "";
        fileInput && fileInput.parentNode?.removeChild(fileInput);
        fileInput = null;
      });
      quill.container.appendChild(fileInput);
    }

    (fileInput as HTMLInputElement).click();
  },
  video: (quill) => {
    let fileInput = quill.container.querySelector("input.ql-video[type=file]");
    if (fileInput == null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      const uploader = quill.getModule("uploader") as Uploader;
      const mimetypes = uploader.options.videoAllowFiles.map(
        (value: string) => {
          return mimelite.getType(value);
        }
      );

      fileInput.setAttribute("accept", mimetypes.join(", "));
      fileInput.classList.add("ql-video");
      fileInput.addEventListener("change", () => {
        const range = quill.getSelection(true);
        uploader.upload(range, (fileInput as HTMLInputElement).files);
        (fileInput as HTMLInputElement).value = "";
        fileInput && fileInput.parentNode?.removeChild(fileInput);
        fileInput = null;
      });
      quill.container.appendChild(fileInput);
    }

    (fileInput as HTMLInputElement).click();
  },
  audio: (quill) => {
    let fileInput = quill.container.querySelector("input.ql-audio[type=file]");
    if (fileInput == null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      const uploader = quill.getModule("uploader") as Uploader;
      const mimetypes = uploader.options.audioAllowFiles.map(
        (value: string) => {
          return mimelite.getType(value);
        }
      );

      fileInput.setAttribute("accept", mimetypes.join(", "));
      fileInput.classList.add("ql-audio");
      fileInput.addEventListener("change", () => {
        const range = quill.getSelection(true);
        uploader.upload(range, (fileInput as HTMLInputElement).files);
        (fileInput as HTMLInputElement).value = "";
        fileInput && fileInput.parentNode?.removeChild(fileInput);
        fileInput = null;
      });
      quill.container.appendChild(fileInput);
    }

    (fileInput as HTMLInputElement).click();
  },
  attachment: (quill) => {
    let fileInput = quill.container.querySelector(
      "input.ql-attachment[type=file]"
    );
    if (fileInput == null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      const uploader = quill.getModule("uploader") as Uploader;
      const mimetypes = uploader.options.attachmentAllowFiles.map(
        (value: string) => {
          return mimelite.getType(value);
        }
      );

      fileInput.setAttribute("accept", mimetypes.join(", "));
      fileInput.classList.add("ql-attachment");
      fileInput.addEventListener("change", () => {
        const range = quill.getSelection(true);
        uploader.upload(range, (fileInput as HTMLInputElement).files);
        (fileInput as HTMLInputElement).value = "";
        fileInput && fileInput.parentNode?.removeChild(fileInput);
        fileInput = null;
      });
      quill.container.appendChild(fileInput);
    }

    (fileInput as HTMLInputElement).click();
  },
  undo: (quill) => {
    quill.history.undo();
  },
  redo: (quill) => {
    quill.history.redo();
  },
};
