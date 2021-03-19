import Quill from "quill";
const Parchment = Quill.import("parchment");

const config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["right", "left"],
};

const FloatStyle = new Parchment.StyleAttributor("float", "float", config);

export { FloatStyle };
