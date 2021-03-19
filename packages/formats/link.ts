import Quill from "quill";
const Inline = Quill.import("blots/inline");

class Link extends Inline {
  static blotName = "link";
  static tagName = "A";
  static SANITIZED_URL = "about:blank";
  static PROTOCOL_WHITELIST = ["http", "https", "mailto", "tel"];

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute("href", this.sanitize(value));
    node.setAttribute("rel", "noopener noreferrer");
    node.setAttribute("target", "_blank");
    node.classList.add("bee-link");
    return node;
  }

  static formats(domNode: HTMLElement) {
    return domNode.getAttribute("href");
  }

  static sanitize(url: string) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name: string, value: string) {
    if (name !== this.statics.blotName || !value) {
      super.format(name, value);
    } else {
      this.domNode.setAttribute("href", Link.sanitize(value));
    }
  }
}

function sanitize(url: string, protocols: string[]) {
  const anchor = document.createElement("a");
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(":"));
  return protocols.indexOf(protocol) > -1;
}

export { Link as default, sanitize };
