import { sanitize } from "./link";
import Quill, { StringMap } from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

const ATTRIBUTES = ["alt", "height", "width"];

class Image extends BlockEmbed {
  static blotName = "image";
  static tagName = "IMG";

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    if (typeof value === "string") {
      node.setAttribute("src", this.sanitize(value));
    }

    node.classList.add("bee-image");
    return node;
  }

  static formats(domNode: HTMLElement) {
    return ATTRIBUTES.reduce((formats: StringMap, attribute: string) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand("enableObjectResizing", false, "false");
      }, 1);
    }
  }

  static sanitize(url: string) {
    return sanitize(url, ["http", "https", "data"]) ? url : "//:0";
  }

  static value(domNode: Node) {
    const dom = domNode as HTMLElement;
    return dom.getAttribute("src");
  }

  format(name: string, value: any) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      const domNode = this.domNode as HTMLElement;
      if (value) {
        domNode.setAttribute(name, value);
      } else {
        domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Image;
