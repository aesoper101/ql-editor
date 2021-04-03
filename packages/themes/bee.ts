import { Blot } from "parchment/src/blot/abstract/blot";
import { Quill, QuillOptionsStatic } from "quill";
import Theme from "quill/core/theme";
import { DEFAULT_TOOLBAR_OPTIONS } from "../config";
import Link from "../formats/link";
import LinkTooltip from "../ui/linktooltip";

class BeeTheme extends Theme {
  constructor(quill: Quill, options?: QuillOptionsStatic) {
    if (
      options?.modules?.toolbar != null &&
      options?.modules?.toolbar.container == null
    ) {
      options.modules.toolbar.container = DEFAULT_TOOLBAR_OPTIONS.container;
    }
    super(quill, options);

    this.addModule("resize");

    document.body.addEventListener("mousedown", () => {
      this.quill.container.querySelectorAll(".bee-tooltip").forEach((value) => {
        this.quill.container.removeChild(value);
      });
    });
    this.quill.on("selection-change", (range, oldRange, source) => {
      if (range == null) return;
      if (range.length === 0 && source === "user") {
        const [link, offset] = this.quill.scroll.descendant(
          Link as any,
          range.index
        );
        if (link != null) {
          const domNode = link.domNode as HTMLElement;
          const preview = Link.formats(domNode);
          // console.log("preview  =  ", preview, domNode.textContent);
          const linkTooltip = new LinkTooltip(
            this.quill,
            { index: range.index - offset, length: link.length() },
            domNode.textContent || "",
            preview || ""
          );
          linkTooltip.show();
        }
      }
    });
  }
}

export default BeeTheme;
