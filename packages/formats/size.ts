import Quill from "quill";
const Parchment = Quill.import("parchment");
import _ from "lodash";
import { DOMUtils } from "@aesoper/normal-utils";

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

class FontSizeStyleAttributor extends Parchment.StyleAttributor {
  value(node: HTMLElement) {
    const value = node.style.fontSize;

    if (
      node.parentElement &&
      _.lowerCase(node.parentElement.tagName) === "li" &&
      (DOMUtils.hasClass(node.parentElement, "bee-ql-ordered") ||
        DOMUtils.hasClass(node.parentElement, "bee-ql-bullet") ||
        DOMUtils.hasClass(node.parentElement, "bee-ql-todo"))
    ) {
      const previousSibling = node.previousSibling as HTMLElement;
      if (previousSibling && DOMUtils.hasClass(previousSibling, "ql-ui")) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        previousSibling.style.fontSize = value;
      }
    }

    return super.value(node);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const SizeStyle = new FontSizeStyleAttributor("size", "font-size", {
  scope: Parchment.Scope.INLINE,
  whitelist: generateSizeList(),
});

export { SizeStyle, SizeClass };
