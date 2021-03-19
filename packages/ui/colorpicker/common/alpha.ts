import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
import tinycolor from "tinycolor2";

type AlphaCallback = (alpha: number) => void;

class Alpha {
  protected pareElement: HTMLElement;
  protected barEle: HTMLElement;
  protected cursorEle: HTMLElement;
  root: HTMLElement;
  currentAlpha = 0;
  private color = "#000000";

  protected callback?: AlphaCallback;

  constructor(pareElement: HTMLElement, callback?: AlphaCallback) {
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

  setColor(alpha: number, color: string) {
    this.currentAlpha = alpha;
    this.color = color;
    this.update();
  }

  private update() {
    const rgb = tinycolor(this.color).setAlpha(1).toRgbString();
    const alphaGgb = tinycolor(this.color).setAlpha(0).toRgbString();

    this.barEle.style.background = `linear-gradient(to right, ${alphaGgb}, ${rgb}`;
    this.cursorEle.style.left = this.getCursorLeft() + "px";
  }

  getCursorLeft() {
    const rect = this.barEle.getBoundingClientRect();

    if (this.currentAlpha === 0) {
      return this.cursorEle.offsetWidth / 2 || 7;
    }

    return Math.round(
      this.currentAlpha * (rect.width - this.cursorEle.offsetWidth) +
        this.cursorEle.offsetWidth / 2
    );
  }

  setCallback(callback: AlphaCallback) {
    this.callback = callback;
  }

  listen() {
    const dragEvent = (event: MouseEvent) => {
      event.stopPropagation();
      const rect = this.barEle?.getBoundingClientRect();
      let left = event.clientX - rect.left;
      left = Math.max(this.cursorEle.offsetWidth / 2, left);
      left = Math.min(left, rect.width - this.cursorEle.offsetWidth / 2);

      this.currentAlpha =
        Math.round(
          ((left - this.cursorEle.offsetWidth / 2) /
            (rect.width - this.cursorEle.offsetWidth)) *
            100
        ) / 100;

      this.callback && this.callback(this.currentAlpha);
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
}

export default Alpha;
