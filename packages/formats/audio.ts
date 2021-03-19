import Link from "./link";
import Quill, { StringMap } from "quill";
const BlockEmbed = Quill.import("blots/block/embed");

const ATTRIBUTES = ["height", "width"];

class Audio extends BlockEmbed {
  static blotName = "audio";
  static className = "bee-audio";
  static tagName = "audio";

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute("controls", "controls");
    node.setAttribute("autoplay", "autoplay");
    node.setAttribute("src", this.sanitize(value));
    return node;
  }

  static formats(domNode: HTMLElement) {
    return ATTRIBUTES.reduce((formats: StringMap, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url: string) {
    return Link.sanitize(url);
  }

  static value(domNode: HTMLElement) {
    return domNode.getAttribute("src");
  }

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }

  html() {
    const { video } = this.value();
    return `<a href="${video}">${video}</a>`;
  }
}

export default Audio;
