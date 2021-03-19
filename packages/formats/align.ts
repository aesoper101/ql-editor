import Quill from "quill";
const Parchment = Quill.import("parchment");

const config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["left", "right", "center", "justify"],
};

const AlignAttribute = new Parchment.Attributor("align", "align", config);
const AlignClass = new Parchment.ClassAttributor("align", "ql-align", config);
const AlignStyle = new Parchment.StyleAttributor("align", "text-align", config);

export { AlignAttribute, AlignClass, AlignStyle };
