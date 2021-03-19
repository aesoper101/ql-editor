import tinycolor from "tinycolor2";
import { DOMUtils } from "@aesoper/normal-utils";
import { ColorAttrs } from "../../../utils/color";

type InputCallback = (color: string) => void;

const mode = ["rgba", "hsva", "hsla"];

const isBetween = (data: number, min: number, max: number) => {
  return !isNaN(data) && data >= min && data <= max;
};

class Input {
  protected pareElement: HTMLElement;
  root: HTMLElement;
  private colorAttrs: ColorAttrs;

  private currentMode = 0;
  private callback?: InputCallback;

  constructor(pareElement: HTMLElement, data: ColorAttrs) {
    this.pareElement = pareElement;
    this.colorAttrs = data;

    this.root = this.create();

    DOMUtils.appendChild(this.pareElement, this.root);

    this.update();
    this.listen();
  }

  create() {
    const wrapper = DOMUtils.createElement("div", "ql-vc-input");

    DOMUtils.appendChild(
      wrapper,
      this.createInputBox("ql-vc-input__hexCol", "Hex"),
      this.createInputBox("ql-vc-input__col", "R"),
      this.createInputBox("ql-vc-input__col", "G"),
      this.createInputBox("ql-vc-input__col", "B"),
      this.createInputBox("ql-vc-input__col", "A")
    );
    return wrapper;
  }

  createInputBox(className: string, text: string) {
    const box = DOMUtils.createElement("div", className);
    const input = DOMUtils.createElement("input");
    const textRow = DOMUtils.createElement(
      "div",
      "ql-vc-input__text",
      text === "Hex" ? "" : "notHex"
    );
    textRow.innerText = text;

    DOMUtils.appendChild(box, input);
    DOMUtils.appendChild(box, textRow);

    return box;
  }

  setCallback(callback: InputCallback) {
    this.callback = callback;
  }

  private listen() {
    const texts = this.root.querySelectorAll(".notHex");
    texts.forEach((domNode) => {
      domNode.addEventListener("click", () => {
        this.currentMode = (this.currentMode + 1) % mode.length;
        this.updateText();
      });
    });

    const inputs = this.root.querySelectorAll("input");
    inputs.forEach((domNode, index) => {
      domNode.addEventListener("blur", () => {
        if (index === 0) {
          if (!tinycolor(domNode.value).isValid()) {
            this.update();
            return;
          }
          this.callback && this.callback(domNode.value);
        } else {
          const data: any = {};
          switch (this.currentMode) {
            case 0:
              data["r"] = Number(inputs[1].value);
              data["g"] = Number(inputs[2].value);
              data["b"] = Number(inputs[3].value);
              data["a"] = Number(inputs[4].value) / 100;
              if (
                !isBetween(data["r"], 0, 255) ||
                !isBetween(data["g"], 0, 255) ||
                !isBetween(data["b"], 0, 255) ||
                !isBetween(data["a"], 0, 1)
              ) {
                this.update();
                return;
              }
              break;
            case 1:
              data["h"] = Number(inputs[1].value);
              data["s"] = Number(inputs[2].value) / 100;
              data["v"] = Number(inputs[3].value) / 100;
              data["a"] = Number(inputs[4].value) / 100;
              if (
                !isBetween(data["h"], 0, 360) ||
                !isBetween(data["s"], 0, 1) ||
                !isBetween(data["v"], 0, 1) ||
                !isBetween(data["a"], 0, 1)
              ) {
                this.update();
                return;
              }
              break;
            case 2:
              data["h"] = Number(inputs[1].value);
              data["s"] = Number(inputs[2].value) / 100;
              data["l"] = Number(inputs[3].value) / 100;
              data["a"] = Number(inputs[4].value) / 100;
              if (
                !isBetween(data["h"], 0, 360) ||
                !isBetween(data["s"], 0, 1) ||
                !isBetween(data["l"], 0, 1) ||
                !isBetween(data["a"], 0, 1)
              ) {
                this.update();
                return;
              }
              break;
          }

          if (!tinycolor(data).isValid()) {
            this.update();
            return;
          }

          const color = tinycolor(data).toRgbString();
          this.callback && this.callback(color);
        }
      });
    });
  }

  setData(data: ColorAttrs) {
    this.colorAttrs = data;
    this.colorAttrs.hsv.s = data.hsv.s * 100;
    this.colorAttrs.hsv.v = data.hsv.v * 100;
    this.colorAttrs.hsv.a = data.hsv.a * 100;
    this.colorAttrs.hsl.s = data.hsl.s * 100;
    this.colorAttrs.hsl.l = data.hsl.l * 100;
    this.colorAttrs.hsl.a = data.hsl.a * 100;
    this.colorAttrs.rgb.a = data.rgb.a * 100;
    this.update();
  }

  protected update() {
    this.updateInput();
  }

  private updateInput() {
    const inputs = this.root.querySelectorAll("input");
    let data: any = {};
    switch (this.currentMode) {
      case 1:
        data = this.colorAttrs.hsv;
        break;
      case 2:
        data = this.colorAttrs.hsl;
        break;
      default:
        data = this.colorAttrs.rgb;
        break;
    }

    inputs.forEach((domNode, index) => {
      if (index === 0) {
        domNode.value = this.colorAttrs.hex;
      } else {
        const modeTexts = mode[this.currentMode].split("");
        const key = modeTexts[index - 1];
        if (key && data[key] !== undefined) {
          domNode.value = data[key];
        }
      }
    });
  }

  private updateText() {
    const texts = this.root.querySelectorAll(".notHex");
    const modeTexts = mode[this.currentMode].split("");
    texts.forEach((domNode, index) => {
      domNode.innerHTML = modeTexts[index].toUpperCase();
      this.update();
    });
  }
}

export default Input;
