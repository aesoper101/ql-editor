import Quill from "quill";
import _ from "lodash";
import { DOMUtils } from "@aesoper/normal-utils";

const Parchment = Quill.import("parchment");

class ColorAttributor extends Parchment.StyleAttributor {
  value(domNode: HTMLElement) {
    let value = super.value(domNode);

    if (
      typeof value === "string" &&
      domNode.parentElement &&
      _.lowerCase(domNode.parentElement.tagName) === "li" &&
      (DOMUtils.hasClass(domNode.parentElement, "bee-ql-ordered") ||
        DOMUtils.hasClass(domNode.parentElement, "bee-ql-bullet") ||
        DOMUtils.hasClass(domNode.parentElement, "bee-ql-todo"))
    ) {
      const previousSibling = domNode.previousSibling as HTMLElement;
      if (previousSibling && DOMUtils.hasClass(previousSibling, "ql-ui")) {
        previousSibling.style.color = value;
      }
    }

    if (!value.startsWith("rgb(")) return value;
    value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
    const hex = value
      .split(",")
      .map((component: string) =>
        `00${parseInt(component, 10).toString(16)}`.slice(-2)
      )
      .join("");
    return `#${hex}`;
  }
}

const ColorClass = new Parchment.ClassAttributor("color", "ql-color", {
  scope: Parchment.Scope.INLINE,
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ColorStyle = new ColorAttributor("color", "color", {
  scope: Parchment.Scope.INLINE,
});

export { ColorAttributor, ColorClass, ColorStyle };
