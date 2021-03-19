import Quill from "quill";
const Parchment = Quill.import("parchment");

const SizeClass = new Parchment.ClassAttributor("size", "ql-size", {
  scope: Parchment.Scope.INLINE,
  whitelist: ["small", "large", "huge"],
});

const generateSizeList = () => {
  const whitelist: string[] = [];
  for (let i = 10; i <= 200; i += 2) {
    whitelist.push(i + "px");
  }

  return whitelist;
};

const SizeStyle = new Parchment.StyleAttributor("size", "font-size", {
  scope: Parchment.Scope.INLINE,
  whitelist: generateSizeList(),
});

export { SizeStyle, SizeClass };
