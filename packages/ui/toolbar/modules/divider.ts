import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";

export class DividerComponent extends Component {
  protected root: HTMLElement | null = null;

  protected createElement() {
    if (!this.root && this.container) {
      this.root = DOMUtils.createElement("div", "ql-docs-divider");
      DOMUtils.appendChild(this.container, this.root);
    }
  }
}
