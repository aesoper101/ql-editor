import Module from "quill/core/module";
import Quill, { StringMap } from "quill";
import { DOMUtils } from "@aesoper/normal-utils";

const allResizeBlotName = ["image", "video", "iframe"];

const cursorList = [
  "nw-resize",
  "ne-resize",
  "se-resize",
  "sw-resize",
  "n-resize",
  "s-resize",
  "e-resize",
  "w-resize",
];

const noImageCursorList = ["n-resize", "s-resize", "e-resize", "w-resize"];

class Resize extends Module {
  private overlay: HTMLElement | null = null;

  private currentBlot: any;
  private activeElement: HTMLElement | null = null;

  dragStartX = 0;
  dragStartY = 0;
  ratio = 1;

  cssCursor = "";

  preSize = { width: 0, height: 0 };

  constructor(quill: Quill, options: StringMap) {
    super(quill, options);

    document.execCommand("enableObjectResizing", false, "false");

    this.quill.root.addEventListener(
      "mousedown",
      this.listenEditClick.bind(this),
      false
    );
  }

  private createResizeBox(isImageBlot = true) {
    const root = DOMUtils.createElement("div", "bee-resize-box");

    cursorList.forEach((cursor) => {
      if (!isImageBlot && noImageCursorList.includes(cursor)) {
        return;
      }
      this.addBox(root, cursor);
    });

    this.createFloatBox(root, isImageBlot);

    this.quill.addContainer(root);

    return root;
  }

  private createFloatBox(box: HTMLElement, isImageBlot = true) {
    const floatBox = DOMUtils.createElement("div", "float-box");

    this.createFloatBoxItem(floatBox, "none");
    this.createFloatBoxItem(floatBox, "right");
    this.createFloatBoxItem(floatBox, "left");

    DOMUtils.appendChild(box, floatBox);
  }

  private createFloatBoxItem(box: HTMLElement, float: string) {
    const item = DOMUtils.createElement("div", "float-item");
    const icon = DOMUtils.createElement(
      "i",
      "ql-icon",
      "ql-icon-24",
      "ql-icon-24-float-" + float
    );

    DOMUtils.appendChild(item, icon);
    DOMUtils.appendChild(box, item);

    item.addEventListener("click", () => {
      box.querySelectorAll("[class^=float-item]").forEach((value) => {
        value.classList.remove("active");
      });
      item.classList.add("active");
      if (this.activeElement) {
        this.activeElement.style.float = float;
        this.calcPosition();
      }
    });
  }

  private addBox(resizeBox: HTMLElement, cursor: string) {
    const box = document.createElement("div");
    box.classList.add(cursor);

    DOMUtils.appendChild(resizeBox, box);

    this.listenCursor(box);
  }

  private listenCursor(cursor: HTMLElement) {
    const dragEvent = (event: MouseEvent) => {
      event.preventDefault();
      this.changeSize(this.cssCursor, event as MouseEvent);
    };

    DOMUtils.triggerDragEvent(cursor, {
      start: (event: Event) => {
        const evt = event as MouseEvent;
        this.dragStartX = evt.clientX;
        this.dragStartY = evt.clientY;

        this.calcRatio();

        const target = event.target as HTMLElement;
        this.cssCursor =
          target.style.cursor || window.getComputedStyle(target).cursor;
      },
      drag: (event: Event) => {
        event.stopPropagation();
        dragEvent(event as MouseEvent);
      },
      end: (event: Event) => {
        dragEvent(event as MouseEvent);
      },
    });
  }

  calcRatio() {
    const { width, height } = this.preSize;
    if (height > 0) {
      this.ratio = width / height;
    }
  }

  changeSize(cssCursor: string, evt: MouseEvent) {
    const deltaX = evt.clientX - this.dragStartX;
    const deltaY = evt.clientY - this.dragStartY;

    const size = {
      width: this.preSize.width || 0,
      height: this.preSize.height || 0,
    };

    switch (cssCursor) {
      case "nw-resize": //  top left
        size.width = Math.round(size.width - deltaX);
        size.height = size.width / this.ratio;
        break;
      case "ne-resize": // top right
        size.width = Math.round(size.width + deltaX);
        size.height = size.width / this.ratio;
        break;
      case "se-resize":
        size.width = Math.round(size.width + deltaX);
        size.height = size.width / this.ratio;
        break;
      case "sw-resize":
        size.width = Math.round(size.width - deltaX);
        size.height = size.width / this.ratio;
        break;
      case "n-resize":
        size.height = Math.round(size.height - deltaY);
        break;
      case "s-resize":
        size.height = Math.round(size.height + deltaY);
        break;
      case "e-resize":
        size.width = Math.round(size.width + deltaX);
        break;
      case "w-resize":
        size.width = Math.round(size.width - deltaX);
        break;
    }

    if (this.activeElement) {
      this.activeElement.style.width = size.width + "px";
      this.activeElement.style.height = size.height + "px";
    }
    Object.assign(this.preSize, size);

    this.dragStartX = evt.clientX;
    this.dragStartY = evt.clientY;
    this.calcPosition();
  }

  static canBeResize(blotName: string) {
    return allResizeBlotName.includes(blotName.toLowerCase());
  }

  private listenEditClick(evt: MouseEvent) {
    let isShow = false;
    const target = evt.target as HTMLElement;
    if (target && target.tagName) {
      const blot = Quill.find(target);

      if (blot && Resize.canBeResize(blot.statics.blotName)) {
        this.currentBlot = blot;
        this.activeElement = target;

        this.preSize.width = target.offsetWidth;
        this.preSize.height = target.offsetHeight;

        isShow = true;
        this.show(blot.statics.blotName === "image");
      } else {
        if (this.activeElement) {
          this.hide();
        }
      }
    }

    if (isShow) {
      evt.preventDefault();
      return;
    }
  }

  calcPosition() {
    if (!this.overlay || !this.activeElement) {
      return;
    }

    const parent = this.quill.container;
    const eleRect = this.activeElement.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${eleRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${eleRect.top - containerRect.top + this.quill.root.scrollTop}px`,
      width: `${eleRect.width}px`,
      height: `${eleRect.height}px`,
      marginTop: -1 * this.quill.root.scrollTop + "px",
    });
  }

  updateOverlayPosition() {
    if (this.overlay) {
      this.overlay.style.marginTop = -1 * this.quill.root.scrollTop + "px";
    }
  }

  private show(isImageBlot = true) {
    if (this.overlay) {
      return;
    }
    this.overlay = this.createResizeBox(isImageBlot);
    this.calcPosition();

    this.quill.root.addEventListener("input", this.hide.bind(this), true);
    this.quill.root.addEventListener(
      "scroll",
      this.updateOverlayPosition.bind(this)
    );
  }

  private hide() {
    if (!this.overlay) {
      return;
    }
    this.overlay.parentNode?.removeChild(this.overlay);
    this.overlay = null;
    this.activeElement = null;

    this.quill.root.removeEventListener("input", this.hide.bind(this), true);
    this.quill.root.removeEventListener(
      "scroll",
      this.updateOverlayPosition.bind(this)
    );
  }
}

export default Resize;
