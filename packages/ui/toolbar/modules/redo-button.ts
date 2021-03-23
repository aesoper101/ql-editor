import { ButtonComponent } from "./button";
import { DOMUtils } from "@aesoper/normal-utils";
import { ComponentUpdateOptions } from "../type";

export class RedoButtonComponent extends ButtonComponent {
  protected listen() {
    DOMUtils.addEventListener(this.root, "click", () => {
      if (this.root && DOMUtils.hasClass(this.root, "disabled")) {
        return;
      }
      this.emitChange(this.format);
    });
  }

  update(data: ComponentUpdateOptions) {
    super.update(data);
    if (this.root) {
      if (this.history && this.history.stack?.redo.length > 0) {
        console.log("====redo");
        DOMUtils.removeClass(this.root, "disabled");
      } else {
        DOMUtils.addClass(this.root, "disabled");
      }
    }
  }
}
