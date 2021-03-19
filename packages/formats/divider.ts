import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}

Quill.register(DividerBlot);

export default DividerBlot;
