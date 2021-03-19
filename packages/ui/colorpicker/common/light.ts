import { DOMUtils, DragEventOptions } from "@aesoper/normal-utils";
import tinycolor from "tinycolor2";

type LightCallback = (light: number) => void;

class Light {
  protected pareElement: HTMLElement;
  protected barEle: HTMLElement;
  protected cursorEle: HTMLElement;
  root: HTMLElement;
  currentLight = 0;
  private hue = 0;
  private saturation = 0;

  protected callback?: LightCallback;

  constructor(pareElement: HTMLElement, callback?: LightCallback) {
    this.pareElement = pareElement;
    this.callback = callback;
    this.barEle = this.createBar();
    this.cursorEle = this.createCursorEle();

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

  setCallback(callback: LightCallback) {
    this.callback = callback;
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

  setData(hue: number, saturation: number, light: number) {
    this.saturation = saturation;
    this.hue = hue;
    this.currentLight = light;
    this.update();
  }

  private update() {
    const color1 = tinycolor({
      h: this.hue,
      s: this.saturation / 100,
      l: 0.8,
    }).toPercentageRgbString();
    const color2 = tinycolor({
      h: this.hue,
      s: this.saturation / 100,
      l: 0.6,
    }).toPercentageRgbString();
    const color3 = tinycolor({
      h: this.hue,
      s: this.saturation / 100,
      l: 0.4,
    }).toPercentageRgbString();
    const color4 = tinycolor({
      h: this.hue,
      s: this.saturation / 100,
      l: 0.2,
    }).toPercentageRgbString();

    this.barEle.style.background = `-webkit-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`;
    this.cursorEle.style.left = this.getCursorLeft() + "px";
  }

  getCursorLeft() {
    const rect = this.barEle.getBoundingClientRect();

    return Math.round(
      ((100 - this.currentLight) / 100) *
        (rect.width - this.cursorEle.offsetWidth) +
        this.cursorEle.offsetWidth / 2
    );
  }

  listen() {
    const dragEvent = (event: MouseEvent) => {
      event.stopPropagation();

      const rect = this.barEle?.getBoundingClientRect();
      let left = event.clientX - rect.left;
      left = Math.max(this.cursorEle.offsetWidth / 2, left);
      left = Math.min(left, rect.width - this.cursorEle.offsetWidth / 2);

      const light = Math.round(
        ((left - this.cursorEle.offsetWidth / 2) /
          (rect.width - this.cursorEle.offsetWidth)) *
          100
      );
      this.currentLight = 100 - light;

      this.callback && this.callback(this.currentLight);
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

export default Light;
