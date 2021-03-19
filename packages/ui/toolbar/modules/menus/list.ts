import { ComponentOptions } from "../../type";
import { createPopper, Instance, VirtualElement } from "@popperjs/core";
import { DOMUtils } from "@aesoper/normal-utils";

export type ListItemCallback = (item: ComponentOptions) => void;

export interface ListMenuConstructorOptions {
  reference: HTMLElement | VirtualElement;
  boundary: HTMLElement;
  format: string;
  options: ComponentOptions[];
  itemCallback?: ListItemCallback;
}

export class ListMenu {
  instance?: Instance;
  popper?: HTMLElement;

  constructorOptions: ListMenuConstructorOptions;

  constructor(options: ListMenuConstructorOptions) {
    this.constructorOptions = options;
  }

  private create(selectVal?: string): HTMLElement {
    const popper = DOMUtils.createElement("div", "ql-doc-list", "dropdown");

    const panelBody = DOMUtils.createElement("div", "ql-doc-list__body");

    this.constructorOptions.options.forEach((value) => {
      const item = this.addItem(panelBody, value);
      if (selectVal) {
        if (value.value == selectVal) {
          item.classList.add("selected");
        }
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

  protected addItem(panel: HTMLElement, option: ComponentOptions) {
    const item = DOMUtils.createElement("div", "list-item");
    const iconWrap = DOMUtils.createElement("div", "icon-wrap");
    item.setAttribute("title", option.label || "无");

    if (option.value == "") {
      iconWrap.innerText = option.label || "无";
    } else {
      const iconName =
        this.constructorOptions.format + "-sequence" + option.value;
      const icon = DOMUtils.createElement(
        "i",
        "ql-icon",
        "ql-icon-big",
        "ql-icon-big-" + iconName
      );
      DOMUtils.appendChild(iconWrap, icon);
    }

    DOMUtils.appendChild(item, iconWrap);
    DOMUtils.appendChild(panel, item);

    return item;
  }

  show(selectVal?: string) {
    if (this.popper) {
      this.hide();
    }
    this.popper = this.create(selectVal);
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
