import Quill from "quill";
const Parchment = Quill.import("parchment");

const LineHeightStyle = new Parchment.StyleAttributor(
  "lineHeight",
  "line-height",
  {
    scope: Parchment.Scope.INLINE,
    whitelist: ["1", "1.15", "1.5", "2", "2.5", "3"],
  }
);

export { LineHeightStyle };
