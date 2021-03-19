// import Quill from "quill";

import { StyleAttributor } from "parchment/src/parchment";
import Quill from "quill";

const Block = Quill.import("blots/block");

class Header extends Block {
  static formats(domNode: HTMLElement) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
}

Header.blotName = "header";
Header.tagName = ["H1", "H2", "H3"];

export default Header;
