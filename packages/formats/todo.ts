import Quill from "quill";
import Scroll from "quill/blots/scroll";

const Container = Quill.import("blots/container");
const Block = Quill.import("blots/block");

class TodoContainer extends Container {
  static blotName = "todo-container";
  static tagName = "OL";
  static className = "bee-todo-container";
}

class TodoItem extends Block {
  static blotName = "todo";
  static tagName = "LI";
  static className = "bee-ql-todo";
  static requiredContainer = TodoContainer;

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute("data-todo-list", value);
    return node;
  }

  static formats(domNode: HTMLElement) {
    return domNode.getAttribute("data-todo-list") || undefined;
  }

  static register() {
    Quill.register(TodoContainer, true);
  }

  constructor(scroll: Scroll, domNode: HTMLElement) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement("span");
    const listEventHandler = (e: Event) => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      if (format === "true") {
        this.format("todo", "false");
        e.preventDefault();
      } else if (format === "false") {
        this.format("todo", "true");
        e.preventDefault();
      }
    };
    ui.addEventListener("mousedown", listEventHandler);
    ui.addEventListener("touchstart", listEventHandler);
    this.attachUI(ui);
  }

  format(name: string, value: string) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute("data-todo-list", value);
    } else {
      super.format(name, value);
    }
  }
}

TodoContainer.allowedChildren = [TodoItem];
TodoItem.requiredContainer = TodoContainer;

export { TodoContainer, TodoItem as default };
