import { DOMUtils } from "@aesoper/normal-utils";
import { Component } from "../component";
import { InsertMenu } from "./menus/insert";

export class InsertComponent extends Component {
  protected root: HTMLElement | null = null;
  content?: HTMLElement;

  protected createElement() {
    if (!this.root && this.container) {
      const group = DOMUtils.createElement("div", "inline-flex");

      this.root = DOMUtils.createElement(
        "div",
        "ql-docs-select",
        // "ql-docs-header-select",
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
      this.content.innerText = "插入";

      DOMUtils.appendChild(contentContainer, icon);
      DOMUtils.appendChild(contentContainer, this.content);
      DOMUtils.appendChild(this.root, contentContainer);
      DOMUtils.appendChild(group, this.root);
      DOMUtils.appendChild(this.container, group);
    }
  }

  protected listen() {
    if (this.root) {
      const popper = new InsertMenu({
        reference: this.root,
        boundary: this.boundary || document.body,
        options: this.options,
        itemCallback: (item) => {
          this.emitter?.emit(this.format, item.value);
        },
      });

      DOMUtils.addEventListener(this.root, "click", (evt: Event) => {
        evt.stopPropagation();
        this.root?.classList.add("selected");
        popper && popper.show();
      });

      DOMUtils.addEventListener(document.body, "mousedown", () => {
        this.root?.classList.remove("selected");
        popper && popper.hide();
      });
    }
  }
}
