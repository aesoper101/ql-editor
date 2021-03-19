import Quill from "quill";
const Parchment = Quill.import("parchment");

class IndentAttributor extends Parchment.StyleAttributor {
  add(node: HTMLElement, value: string) {
    if (value === "1" || value === "+1" || value === "-1") {
      const textIndent = node.style.textIndent.replace("px", "");
      const indent = Number(textIndent) || 0;
      value =
        value === "1" || value === "+1" ? indent + 1 + "" : indent - 1 + "";
    }
    if (Number(value) <= 0) {
      this.remove(node);
      return true;
    }
    return super.add(node, value + "px");
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const IndentStyle = new IndentAttributor("indent", "text-indent", {
  scope: Parchment.Scope.BLOCK,
});

export default IndentStyle;
