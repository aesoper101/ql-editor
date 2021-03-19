import { Component } from "../component";
import { DOMUtils } from "@aesoper/normal-utils";
import { ComponentUpdateOptions } from "../type";
import { SizeMenu } from "./menus/size";

export class SizeComponent extends Component {
  protected root: HTMLElement | null = null;
  content?: HTMLElement;
  addControl?: HTMLElement;
  minusControl?: HTMLElement;
  groupContainer?: HTMLElement;

  protected createElement() {
    if (!this.groupContainer && this.container) {
      this.groupContainer = DOMUtils.createElement("div", "inline-flex");

      const [select, content] = this.createSelect();

      this.content = content;
      this.root = select;

      this.addControl = this.createButton("add");
      this.minusControl = this.createButton("minus");

      DOMUtils.appendChild(this.groupContainer, select);
      DOMUtils.appendChild(this.groupContainer, this.addControl);
      DOMUtils.appendChild(this.groupContainer, this.minusControl);
      DOMUtils.appendChild(this.container, this.groupContainer);
    }
  }

  protected createSelect(): [HTMLElement, HTMLElement] {
    const select = DOMUtils.createElement("div", "ql-docs-select", "dropdown");
    select.style.paddingRight = "unset";

    const content = DOMUtils.createElement("span", "content");

    DOMUtils.appendChild(select, content);

    return [select, content];
  }

  private createButton(control: string) {
    const iconStr = control ? this.format + "_" + control : this.format;
    const button = DOMUtils.createElement("div", "ql-docs-btn");
    const icon = DOMUtils.createElement(
      "i",
      "ql-icon",
      "ql-icon-16",
      "ql-icon-16-" + iconStr
    );

    DOMUtils.appendChild(button, icon);

    return button;
  }

  updateSize(size: string): void {
    if (this.content) {
      this.content.innerText = size;
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
      let hasMatch = false;
      this.options.forEach((value) => {
        if (value.value === this.currentFormats[this.format] && this.content) {
          this.updateSize(value.label);
          hasMatch = true;
        }
      });
      if (!hasMatch) {
        this.updateSize(this.currentFormats[this.format].replace("px", ""));
      }
    } else {
      if (this.options.length > 0 && this.content) {
        this.updateSize(this.options[0].label);
      }
    }
  }

  protected listen() {
    if (this.root && this.addControl && this.minusControl) {
      const popper = new SizeMenu({
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
        popper.show(this.currentFormats[this.format]);
      });

      DOMUtils.addEventListener(this.addControl, "click", (evt: Event) => {
        evt.stopPropagation();
        let size = "10px";
        if (
          this.format &&
          this.currentFormats &&
          this.format in this.currentFormats
        ) {
          size = this.currentFormats[this.format];
        }

        const addSize = Number(size.replace("px", "")) + 2;
        if (addSize > 200) return;
        this.emitter?.emit(this.format, addSize + "px");
        popper.hide();
      });

      DOMUtils.addEventListener(this.minusControl, "click", (evt: Event) => {
        evt.stopPropagation();
        let size = "10px";
        if (
          this.format &&
          this.currentFormats &&
          this.format in this.currentFormats
        ) {
          size = this.currentFormats[this.format];
        }

        const minusSize = Number(size.replace("px", "")) - 2;
        if (minusSize < 10) return;
        this.emitter?.emit(this.format, minusSize + "px");
        popper.hide();
      });

      DOMUtils.addEventListener(document.body, "mouseup", () => {
        this.root?.classList.remove("selected");
        popper.hide();
      });
    }
  }
}
