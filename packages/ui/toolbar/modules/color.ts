import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";
import { ComponentUpdateOptions } from "../type";
import ColorPicker from "../../colorpicker/colorpicker";
import { createPopper, Instance } from "@popperjs/core";

export class ColorComponent extends Component {
  protected root: HTMLElement | null = null;
  currentColorDom?: HTMLElement;
  format = "color";

  colorPicker?: ColorPicker;

  instance?: Instance;

  protected createElement() {
    if (!this.root && this.container) {
      const inlineGroup = DOMUtils.createElement("div", "inline-flex");
      this.root = DOMUtils.createElement("div", "ql-docs-dropdown-group");

      const leftBtn = DOMUtils.createElement("div", "left-btn");
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-16",
        "ql-icon-16-" + this.format
      );
      this.currentColorDom = DOMUtils.createElement(
        "div",
        "ql-current-color",
        "ql-current-color-" + this.format
      );
      const rightBtn = DOMUtils.createElement("div", "right-btn");

      DOMUtils.appendChild(leftBtn, icon);
      DOMUtils.appendChild(leftBtn, this.currentColorDom);
      DOMUtils.appendChild(this.root, leftBtn);
      DOMUtils.appendChild(this.root, rightBtn);

      DOMUtils.appendChild(inlineGroup, this.root);
      DOMUtils.appendChild(this.container, inlineGroup);
    }
  }

  protected listen() {
    if (this.root) {
      DOMUtils.addEventListener(this.root, "click", (evt: Event) => {
        evt.stopPropagation();
        this.root?.classList.add("selected");
        this.showColorPicker();
      });

      DOMUtils.addEventListener(document.body, "mousedown", () => {
        this.root?.classList.remove("selected");
        this.hideColorPicker();
      });
    }
  }

  protected updateBackgroundColor(color: string) {
    if (this.currentColorDom && color) {
      this.currentColorDom.style.backgroundColor = color;
    }
  }

  update(data: ComponentUpdateOptions) {
    super.update(data);
    const { formats } = data;
    if (this.format && formats && this.format in formats) {
      this.updateBackgroundColor(formats[this.format]);
    } else {
      this.updateBackgroundColor("");
    }
  }

  showColorPicker() {
    if (this.colorPicker || !this.root) {
      return;
    }
    this.colorPicker = new ColorPicker(
      this.currentFormats[this.format] || "",
      (color) => {
        this.updateBackgroundColor(this.currentFormats[this.format] || "");
        this.emitter?.emit(this.format, color);
      }
    );

    this.instance = createPopper(this.root, this.colorPicker.root, {
      strategy: "fixed",
      placement: "bottom-start",
      modifiers: [
        {
          name: "eventListeners",
          options: {
            scroll: true,
            resize: true,
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: this.boundary,
            tether: false,
          },
        },
        {
          name: "flip",
          options: {
            flipVariations: false,
            altBoundary: true,
            fallbackPlacements: ["bottom-start", "bottom-end", "bottom"],
            allowedAutoPlacements: ["bottom-end", "bottom", "bottom-start"],
          },
        },
      ],
    });
  }

  hideColorPicker() {
    if (this.instance) {
      this.colorPicker?.destroy();
      this.instance.destroy();

      this.colorPicker = undefined;
      this.instance = undefined;
    }
  }
}
