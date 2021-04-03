import Quill from "quill";
import Scroll from "quill/blots/scroll";

const Container = Quill.import("blots/container");
const Block = Quill.import("blots/block");

class BulletContainer extends Container {
  static blotName = "bullet-container";
  static tagName = "UL";
  static className = "bee-bullet-container";
}

class BulletItem extends Block {
  static blotName = "bullet";
  static tagName = "LI";
  static requiredContainer = BulletContainer;
  static className = "bee-ql-bullet";

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute("data-list-style", value);
    return node;
  }

  static formats(domNode: HTMLElement) {
    return domNode.getAttribute("data-list-style") || undefined;
  }

  static register() {
    Quill.register(BulletContainer, true);
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

BulletContainer.allowedChildren = [BulletItem];
BulletItem.requiredContainer = BulletContainer;

export { BulletContainer, BulletItem as default };
