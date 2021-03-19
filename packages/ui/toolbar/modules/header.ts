import { DOMUtils } from "@aesoper/normal-utils";
import { Component } from "../component";
import { ComponentUpdateOptions } from "../type";
import { HeaderMenu } from "./menus/header";

export class HeaderComponent extends Component {
  protected root: HTMLElement | null = null;
  content?: HTMLElement;

  protected createElement() {
    if (!this.root && this.container) {
      const group = DOMUtils.createElement("div", "inline-flex");

      this.root = DOMUtils.createElement(
        "div",
        "ql-docs-select",
        "ql-docs-header-select",
        "dropdown"
      );
      const contentContainer = DOMUtils.createElement("span", "content");
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-16",
        "ql-icon-16-" + this.format
      );

      this.content = DOMUtils.createElement("span");

      DOMUtils.appendChild(contentContainer, icon);
      DOMUtils.appendChild(contentContainer, this.content);
      DOMUtils.appendChild(this.root, contentContainer);
      DOMUtils.appendChild(group, this.root);
      DOMUtils.appendChild(this.container, group);
    }
  }

  updateText(text: string): void {
    if (this.content) {
      this.content.innerText = text;
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
          this.updateText(value.label);
        }
      });
    } else {
      if (this.options.length > 0 && this.content) {
        this.updateText(this.options[0].label);
      }
    }
  }

  protected listen() {
    if (this.root) {
      const popper = new HeaderMenu({
        reference: this.root,
        boundary: this.boundary || document.body,
        options: this.options,
        itemCallback: (item) => {
          this.emitter?.emit(this.format, item.value);
          this.updateText(item.label);
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
}
