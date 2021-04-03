import Module from "quill/core/module";
import Quill, { StringMap } from "quill";
import { DOMUtils } from "@aesoper/normal-utils";
import { Component } from "../ui/toolbar/component";
import { Registry } from "../ui/toolbar/registry";
import FormatEvent from "./format-event";
import { ToolbarConfig } from "../config";
import Delta from "quill-delta";

import { ResizeObserver } from "@juggle/resize-observer";
import { HandlerFunc } from "../ui/toolbar/type";
import { DEFAULT_HANDLERS } from "../core/handler";

const Parchment = Quill.import("parchment");

const addToolbar = () => {
  const root = DOMUtils.createElement("div", "ql-docs-toolbar");
  const wrapper = DOMUtils.createElement("div", "ql-docs-toolbar-wrap");
  const container = DOMUtils.createElement("div", "ql-docs-toolbar-container");
  const buttons = DOMUtils.createElement("div", "toolbar-buttons");
  const buttonsContainer = DOMUtils.createElement(
    "div",
    "toolbar-buttons-container"
  );

  const leftRollBtn = DOMUtils.createElement("div", "roll-btn", "left-btn");
  const rightRollBtn = DOMUtils.createElement("div", "roll-btn", "right-btn");

  DOMUtils.appendChild(buttons, buttonsContainer);
  DOMUtils.appendChild(container, buttons);
  DOMUtils.appendChild(wrapper, container);
  DOMUtils.appendChild(wrapper, leftRollBtn);
  DOMUtils.appendChild(wrapper, rightRollBtn);
  DOMUtils.appendChild(root, wrapper);

  // 监听左点击按钮
  DOMUtils.addEventListener(leftRollBtn, "click", (e: Event) => {
    e.stopPropagation();
    if (DOMUtils.hasClass(leftRollBtn, "disabled")) {
      return;
    }

    buttons.scrollLeft -= 20;
    if (buttons.scrollLeft <= 0) {
      leftRollBtn.classList.add("disabled");
    }
    rightRollBtn.classList.remove("disabled");
  });

  // 监听左点击按钮
  DOMUtils.addEventListener(rightRollBtn, "click", (e: Event) => {
    e.stopPropagation();
    if (DOMUtils.hasClass(rightRollBtn, "disabled")) {
      return;
    }
    const contentWidth = buttonsContainer.offsetWidth;
    buttons.scrollLeft += 24;
    if (buttons.scrollLeft + buttons.offsetWidth >= contentWidth) {
      buttons.scrollLeft = contentWidth - buttons.offsetWidth;
      rightRollBtn.classList.add("disabled");
    }
    leftRollBtn.classList.remove("disabled");
  });

  // 监听宽度变化
  const ro = new ResizeObserver(() => {
    const contentWidth = buttonsContainer.offsetWidth;
    const containerWidth = buttons.offsetWidth;

    // 如果内容宽度大于容器可视宽度则显示左右按钮
    if (contentWidth > containerWidth) {
      leftRollBtn.style.visibility = "visible";
      rightRollBtn.style.visibility = "visible";
    } else {
      leftRollBtn.style.visibility = "hidden";
      rightRollBtn.style.visibility = "hidden";
    }

    if (buttons.scrollLeft <= 0) {
      leftRollBtn.classList.add("disabled");
      rightRollBtn.classList.remove("disabled");
    } else {
      leftRollBtn.classList.remove("disabled");
      rightRollBtn.classList.add("disabled");
    }
  });

  ro.observe(buttons);

  return [root, buttonsContainer];
};

class Toolbar extends Module {
  componentRegistry: Registry = new Registry();
  componentList: Component[] = [];
  formatEvent: FormatEvent;

  protected handlers: Record<string, HandlerFunc> = DEFAULT_HANDLERS;

  constructor(quill: Quill, options?: StringMap) {
    super(quill, options);

    this.formatEvent = new FormatEvent(this.quill.emitter);

    if (Array.isArray(this.options.container)) {
      const [root, container] = addToolbar();

      const formats: StringMap = this.quill.getFormat() || {};

      (this.options.container as ToolbarConfig[][]).forEach((group) => {
        const groupContainer = DOMUtils.createElement("div");

        group.forEach((control) => {
          let f = "";
          const opts = {
            history: this.quill.history,
            emitter: this.formatEvent,
            boundary: this.quill.root,
            data: control,
          };
          if (typeof control === "string") {
            f = control;
          } else {
            f = Object.keys(control)[0];
          }

          const comp = this.componentRegistry.query(f);
          if (comp) {
            comp.create(groupContainer, opts);
            comp.update({ formats: formats });
            this.componentList.push(comp);
          }
        });

        DOMUtils.appendChild(container, groupContainer);
      });

      this.quill.container.parentNode?.insertBefore(root, quill.container);
      this.container = container;
    } else if (typeof this.options.container === "string") {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }
    if (!(this.container instanceof HTMLElement)) {
      console.error("Container required for toolbar", this.options);
      return;
    }
    if (this.options.handlers && typeof this.options.handlers === "object") {
      Object.keys(this.options.handlers).forEach((format) => {
        if (typeof this.options.handlers[format] === "function") {
          this.addHandler(format, this.options.handlers[format]);
        }
      });
    }

    this.quill.on("editor-change", () => {
      const selection = this.quill.getSelection();
      const data = {
        formats: {},
      };
      if (selection) {
        data.formats = this.quill.getFormat(selection);
      }

      this.componentList.forEach((component) => {
        component.update(data);
      });
    });

    this.formatEvent.on((format: string, formatValue?: string) => {
      if (format == "insert" && formatValue) {
        this.scheduler(formatValue);
        return;
      }
      this.scheduler(format, formatValue);
    });
  }

  private scheduler(format: string, formatValue?: string): void {
    if (!format) return;
    const query = this.quill.scroll.query(format);

    if (this.handlers[format] == null && query == null) {
      console.warn(
        "ignoring attaching to nonexistent format",
        format,
        formatValue
      );
      return;
    }

    const range = this.quill.getSelection(true);
    if (this.handlers[format] != null) {
      const result = this.handlers[format].call(this, this.quill, formatValue);
      if (typeof result === "string") {
        this.doUpdateFormat(format, result);
        return;
      }
    } else if (
      query &&
      Object.getPrototypeOf(query).prototype instanceof Parchment.EmbedBlot
    ) {
      if (!range) return;
      const delta = new Delta()
        .retain(range.index)
        .delete(range.length)
        .insert({ [format]: formatValue || true });
      this.quill.updateContents(delta, "user");
      this.quill.setSelection(range.index + delta.changeLength(), 0);
    } else {
      this.doUpdateFormat(format, formatValue);
    }
  }

  private doUpdateFormat(format: string, formatValue?: string) {
    const formats = this.quill.getFormat();

    if (formatValue == "") {
      this.quill.format(format, "");
      return;
    }

    if (formats && format in formats) {
      if (formatValue !== undefined && formatValue !== formats[format]) {
        this.quill.format(format, formatValue || true);
        return;
      }
      this.quill.format(format, "");
    } else {
      this.quill.format(format, formatValue || true);
    }
  }

  addHandler(name: string, handler: HandlerFunc) {
    this.handlers[name] = handler;
  }
}

export default Toolbar;
