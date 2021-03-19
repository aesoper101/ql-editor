import tinycolor from "tinycolor2";
import { DOMUtils } from "@aesoper/normal-utils";

const defaultColors: string[][] = [
  // 第一行
  [
    "#fcc02e",
    "#f67c01",
    "#e64a19",
    "#d81b43",
    "#8e24aa",
    "#512da7",
    "#1f87e8",
    "#008781",
    "#05a045",
  ],
  // 第二行
  [
    "#fed835",
    "#fb8c00",
    "#f5511e",
    "#eb1d4e",
    "#9c28b1",
    "#5d35b0",
    "#2097f3",
    "#029688",
    "#4cb050",
  ],
  // 第三行
  [
    "#ffeb3c",
    "#ffa727",
    "#fe5722",
    "#eb4165",
    "#aa47bc",
    "#673bb7",
    "#42a5f6",
    "#26a59a",
    "#83c683",
  ],
  // 第四行
  [
    "#fff176",
    "#ffb74e",
    "#ff8a66",
    "#f1627e",
    "#b968c7",
    "#7986cc",
    "#64b5f6",
    "#80cbc4",
    "#a5d6a7",
  ],
  // 第五行
  [
    "#fff59c",
    "#ffcc80",
    "#ffab91",
    "#fb879e",
    "#cf93d9",
    "#9ea8db",
    "#90caf8",
    "#b2dfdc",
    "#c8e6ca",
  ],
  // 最后一行
  [
    "transparent",
    "#ffffff",
    "#dedede",
    "#a9a9a9",
    "#4b4b4b",
    "#353535",
    "#212121",
    "#000000",
    "advance",
  ],
];

type CompactCallback = (color: string) => void;

class Compact {
  protected pareElement: HTMLElement;
  private colorBox: HTMLElement[] = [];
  root: HTMLElement;
  callback?: CompactCallback;

  constructor(pareElement: HTMLElement, callback?: CompactCallback) {
    this.pareElement = pareElement;
    this.callback = callback;
    this.root = this.create();
    this.listen();
  }

  setCallback(callback?: CompactCallback) {
    this.callback = callback;
  }

  private create() {
    const wrapper = DOMUtils.createElement("div", "ql-vc-compact");

    defaultColors.forEach((colorRows) => {
      const row = DOMUtils.createElement("div", "ql-vc-compact__row");

      colorRows.forEach((color) => {
        const cubeWrap = DOMUtils.createElement(
          "div",
          "ql-vc-compact__color-cube--wrap"
        );

        const cube = DOMUtils.createElement(
          "div",
          "ql-vc-compact__color_cube"
        );
        cube.setAttribute("data-color", color);

        if (color === "advance" || color === "transparent") {
          cube.classList.add(color);
        } else {
          cube.style.background = tinycolor(color).toRgbString();
        }

        DOMUtils.appendChild(cubeWrap, cube);
        DOMUtils.appendChild(row, cubeWrap);

        this.colorBox.push(cube);
      });

      DOMUtils.appendChild(wrapper, row);
    });

    DOMUtils.appendChild(this.pareElement, wrapper);

    return wrapper;
  }

  hide() {
    this.root.style.display = "none";
  }

  show() {
    this.root.style.display = "block";
  }

  private listen() {
    this.colorBox.forEach((domNode) => {
      domNode.addEventListener("click", () => {
        const color = domNode.getAttribute("data-color");
        this.callback && this.callback(color || "");
      });
    });
  }
}

export default Compact;
