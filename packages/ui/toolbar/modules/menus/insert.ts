import { createPopper, Instance, VirtualElement } from "@popperjs/core";
import { ComponentOptions } from "../../type";
import { DOMUtils } from "@aesoper/normal-utils";

export type InsertMenuItemCallback = (item: ComponentOptions) => void;

export interface InsertMenuConstructorOptions {
  reference: HTMLElement | VirtualElement;
  boundary: HTMLElement;
  options: ComponentOptions[];
  itemCallback?: InsertMenuItemCallback;
  onlyText?: boolean;
  defaultItem?: boolean;
}

export class InsertMenu {
  instance?: Instance;
  popper?: HTMLElement;

  constructorOptions: InsertMenuConstructorOptions;

  constructor(options: InsertMenuConstructorOptions) {
    if (options.onlyText === undefined) {
      options.onlyText = true;
    }
    this.constructorOptions = options;
  }

  private create(): HTMLElement {
    const popper = DOMUtils.createElement(
      "div",
      "ql-docs-dropdown-panel",
      "ql-docs-insert-dropdown-panel"
    );
    const panelBody = DOMUtils.createElement(
      "div",
      "ql-docs-dropdown-panel__body"
    );

    this.constructorOptions.options.forEach((value) => {
      const item = this.addItem(panelBody, value);

      if (this.hasSubMenu(value.value)) {
        return;
      }
      DOMUtils.addEventListener(item, "click", (evt: Event) => {
        evt.stopPropagation();
        this.constructorOptions.itemCallback &&
          this.constructorOptions.itemCallback(value);
        this.hide();
      });
    });

    DOMUtils.addEventListener(popper, "mousedown", (evt: Event) => {
      evt.stopPropagation();
    });

    DOMUtils.appendChild(popper, panelBody);
    DOMUtils.appendChild(document.body, popper);

    return popper;
  }

  hasSubMenu(format: string) {
    return ["table"].includes(format);
  }

  protected addItem(panel: HTMLElement, option: ComponentOptions) {
    const item = DOMUtils.createElement(
      "div",
      "menu-item",
      this.hasSubMenu(option.value) ? "ql-sub-menu" : ""
    );

    item.setAttribute("title", option.label);

    const iconWrap = DOMUtils.createElement("div", "has-icon");

    const icon = DOMUtils.createElement(
      "i",
      "ql-icon",
      "ql-icon-16",
      "ql-icon-16-" + option.value
    );
    const textLabel = DOMUtils.createElement("div", "btn-text");
    textLabel.innerText = option.label;

    DOMUtils.appendChild(iconWrap, icon);
    DOMUtils.appendChild(iconWrap, textLabel);
    DOMUtils.appendChild(item, iconWrap);
    DOMUtils.appendChild(panel, item);

    return item;
  }

  show() {
    if (this.popper) {
      this.hide();
    }
    this.popper = this.create();
    this.instance = createPopper(
      this.constructorOptions.reference,
      this.popper,
      {
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
              boundary: this.constructorOptions.boundary,
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
      }
    );
  }

  hide() {
    this.popper?.parentNode?.removeChild(this.popper);
    this.popper = undefined;
    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }
}
