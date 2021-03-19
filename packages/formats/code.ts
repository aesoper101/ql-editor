import Container from "quill/blots/container";
import Block from "quill/blots/block";
import Quill from "quill";
import Inline from "quill/blots/inline";

class CodeBlockContainer extends Container {
  static create(value: any) {
    const domNode = super.create(value) as HTMLElement;
    domNode.setAttribute("spellcheck", "false");
    return domNode;
  }
}

class CodeBlock extends Block {
  static register() {
    Quill.register(CodeBlockContainer);
  }
}

class Code extends Inline {}
