import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";

type HueCallback = (alpha: number) => void;

const bg =
  "-webkit-linear-gradient(left, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66%, rgb(0, 255, 0) 33.33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66%, rgb(255, 0, 255) 83.33%, rgb(255, 0, 0) 100%)";

class Hue {
  protected pareElement: HTMLElement;
  protected barEle: HTMLElement;
  protected cursorEle: HTMLElement;
  root: HTMLElement;
  currentHue = 0;

  protected callback?: HueCallback;

  constructor(pareElement: HTMLElement, callback?: HueCallback) {
    this.pareElement = pareElement;
    this.barEle = this.createBar();
    this.cursorEle = this.createCursorEle();
    this.callback = callback;

    this.root = this.create();
    this.listen();
    this.update();
  }

  protected createBar() {
    return DOMUtils.createElement("div", "ql-slider__bar");
  }

  protected createCursorEle() {
    return DOMUtils.createElement("div", "ql-slider__bar-pointer");
  }

  private create() {
    const wrapper = DOMUtils.createElement("div", "ql-slider", "transparent");
    const handle = DOMUtils.createElement("div", "ql-slider__bar-handle");

    DOMUtils.appendChild(this.cursorEle, handle);
    DOMUtils.appendChild(this.barEle, this.cursorEle);
    DOMUtils.appendChild(wrapper, this.barEle);
    DOMUtils.appendChild(this.pareElement, wrapper);

    return wrapper;
  }

  setHue(hue: number) {
    this.currentHue = hue;
    this.update();
  }

  private update() {
    this.barEle.style.background = bg;
    this.cursorEle.style.left = this.getCursorLeft() + "px";
  }

  getCursorLeft() {
    const rect = this.barEle.getBoundingClientRect();

    if (this.currentHue === 360) {
      return rect.width - this.cursorEle.offsetWidth / 2;
    }
    return (
      ((this.currentHue % 360) * (rect.width - this.cursorEle.offsetWidth)) /
        360 +
      this.cursorEle.offsetWidth / 2
    );
  }

  setCallback(callback: HueCallback) {
    this.callback = callback;
  }

  listen() {
    const dragEvent = (event: MouseEvent) => {
      event.stopPropagation();
      const rect = this.barEle?.getBoundingClientRect();
      let left = event.clientX - rect.left;

      left = Math.min(left, rect.width - this.cursorEle.offsetWidth / 2);
      left = Math.max(this.cursorEle.offsetWidth / 2, left);

      this.currentHue = Math.round(
        ((left - this.cursorEle.offsetWidth / 2) /
          (rect.width - this.cursorEle.offsetWidth)) *
          360
      );

      this.callback && this.callback(this.currentHue);
      this.update();
    };

    const dragConfig: DragEventOptions = {
      drag: (event: Event) => {
        dragEvent(event as MouseEvent);
      },
      end: (event: Event) => {
        dragEvent(event as MouseEvent);
      },
    };

    DOMUtils.triggerDragEvent(this.barEle, dragConfig);
    DOMUtils.triggerDragEvent(this.cursorEle, dragConfig);
  }

  hide() {
    this.root.style.display = "none";
  }

  show() {
    this.root.style.display = "block";
    this.update();
  }
}

export default Hue;
