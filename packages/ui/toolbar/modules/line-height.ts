import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";
import { LineHeightMenu } from "./menus/line-height";

export class LineHeightComponent extends Component {
  protected root: HTMLElement | null = null;

  protected createElement() {
    if (!this.root && this.container) {
      this.root = DOMUtils.createElement("div", "ql-docs-btn", "dropdown");
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-16",
        "ql-icon-16-" + this.format
      );

      DOMUtils.appendChild(this.root, icon);
      DOMUtils.appendChild(this.container, this.root);
    }
  }

  protected listen() {
    if (this.root) {
      const popper = new LineHeightMenu({
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
        popper && popper.show(this.currentFormats[this.format]);
      });

      DOMUtils.addEventListener(document.body, "mouseup", () => {
        this.root?.classList.remove("selected");
        popper && popper.hide();
      });
    }
  }
}
