import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";
import { ComponentOptions, ComponentUpdateOptions } from "../type";
import { FontMenu } from "./menus/font";

export class FontComponent extends Component {
  protected root: HTMLElement | null = null;
  content?: HTMLElement;

  protected createElement() {
    if (!this.root && this.container) {
      this.root = DOMUtils.createElement(
        "div",
        "ql-docs-select",
        "ql-docs-font-select",
        "dropdown"
      );
      this.content = DOMUtils.createElement("span", "content");

      DOMUtils.appendChild(this.root, this.content);
      DOMUtils.appendChild(this.container, this.root);
    }
  }

  protected listen() {
    if (this.root) {
      const popper = new FontMenu({
        reference: this.root,
        boundary: this.boundary || document.body,
        options: this.options,
        itemCallback: (item) => {
          this.emitter?.emit(this.format, item.value);
          this.updateData(item);
        },
      });

      DOMUtils.addEventListener(this.root, "click", (evt: Event) => {
        evt.stopPropagation();
        this.root?.classList.add("selected");
        popper.show(this.currentFormats[this.format]);
      });

      DOMUtils.addEventListener(document.body, "mouseup", () => {
        this.root?.classList.remove("selected");
        popper.hide();
      });
    }
  }

  updateData(opts: ComponentOptions): void {
    if (this.content) {
      this.content.innerText = opts.label;
      this.content.style.fontFamily = opts.value;
    }
    return;
  }

  update(data: ComponentUpdateOptions) {
    super.update(data);
    if (
      this.currentFormats &&
      this.format &&
      this.format in this.currentFormats
    ) {
      this.options.forEach((value) => {
        if (value.value === this.currentFormats[this.format] && this.content) {
          this.updateData(value);
        }
      });
    } else {
      if (this.options.length > 0 && this.content) {
        this.updateData(this.options[0]);
      }
    }
  }
}
