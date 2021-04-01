import Quill from "quill";
import Scroll from "quill/blots/scroll";

const Container = Quill.import("blots/container");
const Block = Quill.import("blots/block");

class OrderedContainer extends Container {
  static blotName = "ordered-container";
  static tagName = "OL";
  static className = "bee-ordered-container";
}

class OrderedItem extends Block {
  static blotName = "ordered";
  static tagName = "LI";
  static className = "bee-ql-ordered";
  static requiredContainer = OrderedContainer;

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute("data-list-style", value);
    return node;
  }

  static formats(domNode: HTMLElement) {
    // if (domNode.parentElement?.style.listStyle) {
    //   return domNode.parentElement?.style.listStyle;
    // }
    return domNode.getAttribute("data-list-style") || undefined;
  }

  static register() {
    Quill.register(OrderedContainer);
  }

  constructor(scroll: Scroll, domNode: HTMLElement) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement("span");
    this.attachUI(ui);
  }

  format(name: string, value: string) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-list-style", value);
    } else {
      super.format(name, value);
    }
  }
}

OrderedContainer.allowedChildren = [OrderedItem];
OrderedItem.requiredContainer = OrderedContainer;

export { OrderedContainer, OrderedItem as default };
