import Quill, { RangeStatic } from "quill";
import { createPopper, Instance } from "@popperjs/core";
import { DOMUtils } from "@aesoper/normal-utils";
import { BlotConstructor } from "parchment/src/blot/abstract/blot";
import Delta from "quill-delta";

class LinkTooltip {
  quill: Quill;
  root: HTMLElement;
  body: HTMLElement;

  previewText = "";
  previewLink = "";
  linkRange: RangeStatic;

  blot: BlotConstructor | null = null;

  protected instance: Instance | null = null;

  constructor(
    quill: Quill,
    linkRange: RangeStatic | null = null,
    previewText = "",
    previewLink = ""
  ) {
    this.quill = quill;
    this.previewLink = previewLink;
    this.previewText = previewText;

    this.quill.container.querySelectorAll(".bee-tooltip").forEach((value) => {
      this.quill.container.removeChild(value);
    });

    this.body = DOMUtils.createElement("div", "bee-tooltip__body");
    this.root = this.quill.addContainer("bee-tooltip");

    this.root.addEventListener("mousedown", (evt) => {
      evt.stopPropagation();
    });

    DOMUtils.appendChild(this.root, this.body);

    if (linkRange) {
      this.linkRange = linkRange;
    } else {
      this.linkRange = this.quill.getSelection(true);
    }

    const bounds = this.quill.getBounds(
      this.linkRange.index,
      this.linkRange.length
    );
    this.position(bounds);
  }

  private empty() {
    this.body.innerHTML = "";
  }

  position(rect: ClientRect | DOMRect) {
    const containerBounds = this.quill.container.getBoundingClientRect();
    this.instance = createPopper(
      {
        getBoundingClientRect(): ClientRect | DOMRect {
          return {
            bottom: rect.bottom + containerBounds.top,
            height: rect.height,
            left: rect.left + containerBounds.left,
            right: rect.right + containerBounds.left,
            top: rect.top + containerBounds.top,
            width: rect.width,
          };
        },
      },
      this.root,
      {
        strategy: "fixed",
        placement: "bottom-start",
        modifiers: [
          {
            name: "eventListeners",
            options: {
              scroll: true,
              resize: true,
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: this.quill.container,
              tether: false,
            },
          },
          {
            name: "flip",
            options: {
              flipVariations: false,
              altBoundary: true,
              fallbackPlacements: ["bottom-start", "bottom-end", "bottom"],
              allowedAutoPlacements: ["bottom-end", "bottom", "bottom-start"],
            },
          },
          {
            name: "computeStyles",
            options: {
              adaptive: false, // true by default
            },
          },
        ],
      }
    );
  }

  show() {
    this.empty();
    const container = DOMUtils.createElement("div", "bee-link-hover");
    const link = DOMUtils.createElement("a", "bee-link-hover-link");
    link.text = this.previewLink;
    link.setAttribute("href", this.previewLink);
    link.setAttribute("target", "_blank");

    const actionContainer = DOMUtils.createElement("div", "bee-action");

    const editBtn = DOMUtils.createElement("span", "bee-action-edit-btn");
    editBtn.innerText = "编辑";

    const divider = DOMUtils.createElement("div", "bee-action-divider");
    divider.innerText = "|";

    const removeBtn = DOMUtils.createElement("div", "bee-action-remove-btn");
    removeBtn.innerText = "移除";

    DOMUtils.appendChild(actionContainer, editBtn, divider, removeBtn);

    DOMUtils.appendChild(container, link);
    DOMUtils.appendChild(container, actionContainer);
    DOMUtils.appendChild(this.body, container);

    editBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this.edit();
    });

    removeBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this.quill.removeFormat(
        this.linkRange.index,
        this.linkRange.length,
        "user"
      );
      this.empty();
      this.destroy();
    });
  }

  edit() {
    this.empty();

    const container = DOMUtils.createElement("div", "bee-link-input");

    const row1 = DOMUtils.createElement("div", "bee-link-input__row");
    const textLabel = DOMUtils.createElement(
      "span",
      "bee-link-input__row-label"
    );
    textLabel.innerText = "文本";
    const textInput = DOMUtils.createElement(
      "input",
      "bee-link-input__row-input"
    );
    textInput.placeholder = "文本描述";
    textInput.value = this.previewText;

    DOMUtils.appendChild(row1, textLabel);
    DOMUtils.appendChild(row1, textInput);

    const row2 = DOMUtils.createElement("div", "bee-link-input__row");
    const linkLabel = DOMUtils.createElement(
      "span",
      "bee-link-input__row-label"
    );
    linkLabel.innerText = "链接";
    const linkInput = DOMUtils.createElement(
      "input",
      "bee-link-input__row-input"
    );
    linkInput.placeholder = "添加链接地址";
    linkInput.value = this.previewLink;

    const visitBtn = DOMUtils.createElement("a", "bee-link-input__row-visit");
    visitBtn.innerText = "访问";

    DOMUtils.appendChild(row2, linkLabel);
    DOMUtils.appendChild(row2, linkInput);
    DOMUtils.appendChild(row2, visitBtn);

    const row3 = DOMUtils.createElement("div", "bee-link-input__apply");
    const applyBtn = DOMUtils.createElement("a", "bee-link-input__apply-btn");
    applyBtn.innerText = "应用";

    DOMUtils.appendChild(row3, applyBtn);

    DOMUtils.appendChild(container, row1);
    DOMUtils.appendChild(container, row2);
    DOMUtils.appendChild(container, row3);

    DOMUtils.appendChild(this.body, container);

    visitBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this.destroy();
    });

    applyBtn.addEventListener("click", (evt) => {
      evt.stopPropagation();

      if (textInput.value.trim() === "") {
        textInput.classList.add("bee-link-input__row-input-error");
        return;
      }

      const pattern = "^((https|http|ftp|rtsp|mms|mailto|tel)?:\\/\\/)[^\\s]+";
      const reg = new RegExp(pattern);

      if (!reg.test(linkInput.value)) {
        linkInput.classList.add("bee-link-input__row-input-error");
        return;
      }

      textInput.classList.remove("bee-link-input__row-input-error");
      linkInput.classList.remove("bee-link-input__row-input-error");

      const delta = new Delta()
        .retain(this.linkRange.index)
        .delete(this.linkRange.length)
        .insert(textInput.value, { link: linkInput.value });
      this.quill.updateContents(delta, "user");
      this.quill.setSelection(
        this.linkRange.index,
        this.linkRange.length + delta.changeLength()
      );
      this.destroy();
    });
  }

  private destroy() {
    if (this.instance) {
      this.root.parentNode?.removeChild(this.root);
      this.instance.destroy();
    }
  }
}

export default LinkTooltip;
