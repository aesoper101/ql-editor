import { DOMUtils, DragEventOptions, NumberUtils } from "@aesoper/normal-utils";

type SaturationCallback = (saturation: number, value: number) => void;

class Saturation {
  protected pareElement: HTMLElement;
  protected cursorEle: HTMLElement;
  root: HTMLElement;

  protected saturation = 0;
  protected hue = 0;
  protected value = 0;

  protected callback?: SaturationCallback;

  constructor(pareElement: HTMLElement, callback?: SaturationCallback) {
    this.pareElement = pareElement;
    this.callback = callback;
    this.cursorEle = this.createCursorElement();
    this.root = this.create();

    DOMUtils.appendChild(this.pareElement, this.root);

    this.listen();
    this.update();
  }

  createCursorElement() {
    const ele = DOMUtils.createElement("div", "ql-vc-saturation__cursor");
    DOMUtils.appendChild(ele, DOMUtils.createElement("div"));

    return ele;
  }

  create() {
    const wrapper = DOMUtils.createElement(
      "div",
      "ql-vc-saturation",
      "ql-vc-saturation__hidden"
    );

    DOMUtils.appendChild(
      wrapper,
      DOMUtils.createElement("div", "ql-vc-saturation__white"),
      DOMUtils.createElement("div", "ql-vc-saturation__black"),
      this.cursorEle
    );
    return wrapper;
  }

  setData(hue: number, saturation: number, value: number) {
    this.saturation = saturation;
    this.hue = hue;
    this.value = value;
    this.update();
  }

  setCallback(callback: SaturationCallback) {
    this.callback = callback;
  }

  listen() {
    const dragEvent = (event: MouseEvent) => {
      event.stopPropagation();

      const rect = this.root?.getBoundingClientRect();

      let left = event.clientX - rect.left;
      let top = event.clientY - rect.top;

      left = NumberUtils.clamp(left, 0, rect.width);
      top = NumberUtils.clamp(top, 0, rect.height);

      this.saturation = Math.round((left / rect.width) * 100) / 100;
      this.value =
        Math.round(NumberUtils.clamp(-(top / rect.height) + 1, 0, 1) * 100) /
        100;

      this.callback && this.callback(this.saturation, this.value);
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

    DOMUtils.triggerDragEvent(this.root, dragConfig);
    DOMUtils.triggerDragEvent(this.cursorEle, dragConfig);
  }

  update() {
    this.cursorEle.style.left = this.saturation * this.root.clientWidth + "px";
    this.cursorEle.style.top = (1 - this.value) * this.root.clientHeight + "px";
    this.root.style.background = "hsl(" + Math.round(this.hue) + ", 100%, 50%)";
  }

  hide() {
    this.root.style.display = "none";
  }

  show() {
    this.root.style.display = "block";
    this.update();
  }
}

export default Saturation;
