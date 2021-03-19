import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";
import { ComponentUpdateOptions } from "../type";

export class ButtonComponent extends Component {
  protected root: HTMLElement | null = null;

  protected createElement() {
    if (!this.root && this.container) {
      const iconStr = this.formatVal
        ? this.format + "_" + this.formatVal
        : this.format;
      this.root = DOMUtils.createElement("div", "ql-docs-btn");
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-16",
        "ql-icon-16-" + iconStr
      );

      DOMUtils.appendChild(this.root, icon);
      DOMUtils.appendChild(this.container, this.root);
    }
  }

  protected listen() {
    DOMUtils.addEventListener(this.root, "click", () => {
      if (this.root && DOMUtils.hasClass(this.root, "disabled")) {
        return;
      }
      this.root && DOMUtils.toggleClass(this.root, "selected");
      this.emitChange(this.format, this.formatVal);
    });
  }

  private emitChange(format: string, formatValue?: string) {
    if (format) {
      this.emitter?.emit(format, formatValue);
    }
  }

  update(data: ComponentUpdateOptions): void {
    super.update(data);

    const { formats } = data;

    if (this.format && this.format in formats && formats[this.format]) {
      if (this.formatVal !== null) {
        if (this.formatVal === formats[this.format]) {
          this.root?.classList.add("selected");
          return;
        }
        this.root?.classList.remove("selected");
        return;
      }
      this.root?.classList.add("selected");
    } else {
      this.root?.classList.remove("selected");
    }

    return;
  }
}
