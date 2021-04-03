import Module from "quill/core/module";
import Quill from "quill";
import { DOMUtils } from "@aesoper/normal-utils";

function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

class ImageDisplay extends Module {
  private root: HTMLElement | null = null;
  private percentEle: HTMLElement | null = null;

  private box: HTMLElement | null = null;
  private imageEle: HTMLImageElement | null = null;

  private naturalSize = { naturalWidth: 0, naturalHeight: 0 };

  private curZoom = 100;

  private maxZoom = 1000;

  private minZoom = 25;

  private incrZoom = 25;

  private rotate = 0;

  private imageUrl = "";

  constructor(quill: Quill) {
    super(quill);
  }

  private create(imageUrl: string) {
    this.imageUrl = imageUrl;

    this.root = DOMUtils.createElement("div", "bee-image-preview");
    const box = DOMUtils.createElement("div", "bee-image-preview__box");

    const img = DOMUtils.createElement("img", "image");
    img.setAttribute("src", imageUrl);

    const mask = DOMUtils.createElement("div", "bee-image-preview__mask");

    DOMUtils.appendChild(box, img);
    DOMUtils.appendChild(this.root, box);
    DOMUtils.appendChild(this.root, mask);
    DOMUtils.appendChild(document.body, this.root);

    this.box = box;
    this.imageEle = img;

    this.createTools();

    this.naturalSize.naturalWidth = img.naturalWidth;
    this.naturalSize.naturalHeight = img.naturalHeight;

    box.style.width = img.naturalWidth + "px";
    box.style.height = img.naturalHeight + "px";
    box.style.left =
      Math.round(this.root.offsetWidth / 2 - img.naturalWidth / 2) + "px";
    box.style.top =
      Math.round(this.root.offsetHeight / 2 - img.naturalHeight / 2) + "px";

    this.moveListen();
  }

  private createTools() {
    const tools = DOMUtils.createElement("ul", "bee-image-preview__tools");

    this.createToolItem(tools, "", true);
    this.createToolItem(tools, "zoom-in");
    this.createToolItem(tools, "zoom-out");
    this.createToolItem(tools, "rotate");
    this.createToolItem(tools, "download");
    this.createToolItem(tools, "reset-zoom");
    this.createToolItem(tools, "exit");

    this.root?.append(tools);
  }

  private createToolItem(
    tools: HTMLElement,
    clsName: string,
    isZoomPercentShow = false
  ) {
    const tool = DOMUtils.createElement("li", "tool-item");

    if (isZoomPercentShow) {
      this.percentEle = DOMUtils.createElement("span", "image-zoom-percent");
      this.percentEle.innerText = 100 + "%";

      const separateLine = DOMUtils.createElement("span", "separate-line");

      tool.append(this.percentEle, separateLine);
    } else {
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-26",
        "ql-icon-26-" + clsName
      );
      tool.append(icon);
    }

    tool.addEventListener("click", () => {
      if (!this.box || !this.root || !this.percentEle) return;
      switch (clsName) {
        case "zoom-in":
          this.curZoom += this.incrZoom;
          break;
        case "zoom-out":
          this.curZoom -= this.incrZoom;
          break;
        case "download":
          this.downloadImage();
          return;
        case "reset-zoom":
          this.curZoom = 100;
          break;
        case "rotate":
          this.rotate -= 90;
          this.box.style.transform = "rotate(" + this.rotate + "deg)";
          return;
        case "exit":
          this.hide();
          return;
      }

      if (this.curZoom > this.maxZoom || this.curZoom < this.minZoom) return;

      this.percentEle.innerText = this.curZoom + "%";
      this.box.style.width =
        (this.naturalSize.naturalWidth * this.curZoom) / 100 + "px";
      this.box.style.height =
        (this.naturalSize.naturalHeight * this.curZoom) / 100 + "px";
      this.box.style.left =
        Math.round(this.root.offsetWidth / 2 - this.box.offsetWidth / 2) + "px";
      this.box.style.top =
        Math.round(this.root.offsetHeight / 2 - this.box.offsetHeight / 2) +
        "px";
    });

    tools.append(tool);
  }

  private moveListen() {
    let startDragX = 0;
    let startDragY = 0;
    const dragEvt = (event: Event) => {
      const evt = event as MouseEvent;
      if (this.box) {
        const deltaX = evt.clientX - startDragX;
        const deltaY = evt.clientY - startDragY;

        const rect = this.box.getBoundingClientRect();

        this.box.style.left = rect.left + deltaX + "px";
        this.box.style.top = rect.top + deltaY + "px";

        startDragX = evt.clientX;
        startDragY = evt.clientY;
      }
    };
    this.box &&
      DOMUtils.triggerDragEvent(this.box, {
        start: (event) => {
          const evt = event as MouseEvent;
          startDragX = evt.clientX;
          startDragY = evt.clientY;
        },
        drag: dragEvt,
        end: dragEvt,
      });
  }

  preview(imageUrl = "") {
    if (!this.root) {
      this.create(imageUrl);
    }
  }

  private downloadImage() {
    if (
      !this.imageUrl ||
      !this.imageEle ||
      this.naturalSize.naturalWidth <= 0 ||
      this.naturalSize.naturalHeight <= 0
    )
      return;

    this.imageEle.setAttribute("crossOrigin", "Anonymous");

    const a = document.createElement("a");
    const event = new MouseEvent("click");

    const reg = new RegExp("^data:image/(\\S+);base64,");
    let ext = "png";
    let fileName = guid();
    if (reg.test(this.imageUrl)) {
      const matchArr = reg.exec(this.imageUrl);
      if (matchArr && matchArr.length >= 2) {
        ext = matchArr[1];
      }
    } else {
      const spList = this.imageUrl.split(".");
      if (spList.length == 2) {
        fileName = spList[1];
      }
    }

    a.download = fileName + "." + ext;
    a.href = this.imageUrl;

    a.dispatchEvent(event);
  }

  hide() {
    if (this.root) {
      this.root.parentNode?.removeChild(this.root);
      this.root = null;
      this.imageUrl = "";
    }
  }
}

export default ImageDisplay;
