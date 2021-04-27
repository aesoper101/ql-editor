import Alpha from "./common/alpha";
import Compact from "./common/compact";
import Light from "./common/light";
import { Color, ColorAttrs } from "../../utils/color";
import Hue from "./common/hue";
import Saturation from "./common/saturation";
import Input from "./common/input";
import _ from "lodash";
import { DOMUtils } from "@aesoper/normal-utils";

class ColorPicker {
  protected backButton: HTMLElement;
  protected colorDisplayEle: HTMLElement | null = null;
  root: HTMLElement;

  private _oldHue = 0;
  private colorClass: Color;
  private currentColor: ColorAttrs;

  private alpha: Alpha | null = null;
  private light: Light | null = null;
  private compact: Compact | null = null;
  private hue: Hue | null = null;
  protected saturation: Saturation | null = null;
  protected input: Input | null = null;

  protected callback?: (color: string) => void;

  constructor(colorStr: string, callback?: (color: string) => void) {
    this.colorClass = new Color();
    this.callback = callback;

    const color = colorStr || "#000000";
    this.currentColor = this.colorClass.parseColor(color);

    this.backButton = this.createBackBtn();
    this.root = this.create();

    this.doOnChange(color);
    this.listen();
  }

  protected createBackBtn() {
    const backBtn = DOMUtils.createElement("span");
    backBtn.style.cursor = "pointer";
    backBtn.style.display = "none";

    return backBtn;
  }

  private create() {
    const picker = DOMUtils.createElement("div", "aa");
    picker.style.zIndex = "10000";

    const wrapper = DOMUtils.createElement("div", "ql-colorPicker");

    const inner = DOMUtils.createElement("div", "ql-colorPicker__inner");
    const header = DOMUtils.createElement("div", "ql-colorPicker__header");

    const backArrowIcon = DOMUtils.createElement("div", "back");
    const backText = DOMUtils.createElement("span");
    backText.innerText = "返回";

    DOMUtils.appendChild(this.backButton, backArrowIcon, backText);
    DOMUtils.appendChild(header, this.backButton);
    DOMUtils.appendChild(inner, header);

    const controls = DOMUtils.createElement("div", "ql-colorPicker__controls");
    const leftControls = DOMUtils.createElement(
      "div",
      "ql-colorPicker__controls-left"
    );
    const rightControl = DOMUtils.createElement(
      "div",
      "ql-colorPicker__controls-right",
      "transparent"
    );

    this.colorDisplayEle = DOMUtils.createElement("div", "display");
    DOMUtils.appendChild(rightControl, this.colorDisplayEle);

    this.saturation = new Saturation(inner);
    this.compact = new Compact(inner);

    this.hue = new Hue(leftControls);
    this.light = new Light(leftControls);
    this.alpha = new Alpha(leftControls);

    DOMUtils.appendChild(controls, leftControls);
    DOMUtils.appendChild(controls, rightControl);
    DOMUtils.appendChild(inner, controls);

    this.input = new Input(inner, this.currentColor);

    this.saturation.hide();
    this.hue.hide();

    DOMUtils.appendChild(wrapper, inner);
    DOMUtils.appendChild(picker, wrapper);
    DOMUtils.appendChild(document.body, picker);

    return picker;
  }

  listen() {
    this.root.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
    });

    this.backButton.addEventListener("click", () => {
      this.compact?.show();
      this.light?.show();
      this.hue?.hide();
      this.saturation?.hide();
      this.backButton.style.display = "none";
    });

    this.compact?.setCallback((color) => {
      if (color === "advance") {
        this.backButton.style.display = "block";
        this.compact?.hide();
        this.light?.hide();
        this.hue?.show();
        this.saturation?.show();
      } else {
        this._oldHue = this.currentColor.hsl.h;
        this.doOnChange(color);
        this.doUpdate();
      }
    });

    this.alpha?.setCallback((alpha) => {
      this.doOnChange(
        {
          h: this.currentColor.hsl.h,
          s: this.currentColor.hsl.s,
          l: this.currentColor.hsl.l,
          a: alpha,
          source: "alpha",
        },
        this.currentColor.hsl.h
      );
      this.doUpdate();
    });

    this.light?.setCallback((light) => {
      this.doOnChange(
        {
          h: this.currentColor.hsl.h,
          s: this.currentColor.hsl.s,
          l: light / 100,
          a: this.currentColor.hsl.a,
          source: "light",
        },
        this.currentColor.hsl.h
      );
      this.doUpdate();
    });

    this.hue?.setCallback((hue) => {
      const { s: saturation, v: bright, a: alpha } = this.currentColor.hsv;
      this.doOnChange(
        {
          h: hue,
          s: saturation,
          v: bright,
          a: alpha,
          source: "hue",
        },
        hue
      );
      this.doUpdate();
    });

    this.saturation?.setCallback((saturation, value) => {
      const { h } = this.currentColor.hsv;
      this.doOnChange(
        {
          h: this.currentColor.hsv.h,
          s: saturation,
          v: value,
          a: this.currentColor.hsv.a,
          source: "saturation",
        },
        this.currentColor.hsv.h
      );
      this.currentColor.hsv.h = h;
      this.doUpdate();
    });

    this.input?.setCallback((color) => {
      this.doOnChange(color);
      this.doUpdate();
    });
  }

  private doOnChange(data: any, oldHue?: number) {
    const { h } = this.currentColor.hsv;
    this._oldHue = h;
    this.currentColor = this.colorClass.parseColor(
      data,
      oldHue || this._oldHue
    );
    this.alpha?.setColor(this.currentColor.alpha, this.currentColor.hex);
    this.light?.setData(
      this.currentColor.hsl.h || this._oldHue,
      this.currentColor.hsl.s * 100,
      this.currentColor.hsl.l * 100
    );
    this.hue?.setHue(this.currentColor.hsv.h);
    this.saturation?.setData(
      this.currentColor.hsv.h,
      this.currentColor.hsv.s,
      this.currentColor.hsv.v
    );

    this.input?.setData(_.cloneDeep(this.currentColor));
    if (this.colorDisplayEle) {
      this.colorDisplayEle.style.background = this.colorClass.format("rgb");
    }
  }

  doUpdate() {
    this.callback && this.callback(this.colorClass.format("rgb"));
  }

  destroy() {
    if (this.root) {
      this.root?.parentNode?.removeChild(this.root);
    }
  }
}

export default ColorPicker;
