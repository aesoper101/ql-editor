import Quill, { RangeStatic } from "quill";
import Emitter from "quill/core/emitter";
import History from "quill/modules/history";

import "./register";
import "./assets/scss/index.scss";
import { DEFAULT_TOOLBAR_OPTIONS } from "./config";

export interface EditorOptions {
  placeholder?: string;
  content?: string;
  disabled?: boolean;
  readyCallback?: Callback;
}

export type Callback = () => void;
export type UpdateCallback = (html: string, text: string) => void;

class Editor {
  private quill: Quill;
  private blurCallback?: Callback;
  private focusCallback?: Callback;
  private updateCallback?: UpdateCallback;

  constructor(container: HTMLElement, options?: EditorOptions) {
    this.quill = new Quill(container, {
      placeholder: options?.placeholder || "请输入文本",
      readOnly: false,
      theme: "bee",
      modules: {
        toolbar: DEFAULT_TOOLBAR_OPTIONS,
        uploader: {
          allowDropUpload: true,
          // uploadRequest: () => {
          //   const url =
          //     "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2586511470,1700329541&fm=26&gp=0.jpg";
          //   return Promise.resolve({ data: "======", type: "image", url: url });
          // },
        },
        keyboard: {
          bindings: {

          },
        },
      },
    });

    this.enable(!options?.disabled);

    if (options?.content) {
      this.quill.clipboard.dangerouslyPasteHTML(0, options.content);
    }

    this.quill.emitter.on("ready", () => {
      options?.readyCallback && options.readyCallback();
    });

    // this.quill.keyboard.addBinding(
    //   { key: "Enter" },
    //   // { shiftKey: false },
    //   { collapsed: false, format: ["ordered"], empty: false, shiftKey: false },
    //   () => {
    //     console.log("=======================================");
    //     return true;
    //   }
    // );

    // this.quill.keyboard.addBinding(
    //   { key: "ENTER" },
    //   {
    //     empty: true, // implies collapsed: true and offset: 0
    //     format: ["ordered"],
    //   },
    //   (range, context) => {
    //     console.log("-------------");
    //     this.quill.format("list", false);
    //   }
    // );

    console.log(this.quill.keyboard);

    this.listen();

    this.quill.emitter.emit("ready");
  }

  private listen() {
    this.quill.on("text-change", () => {
      const html = this.quill.root.children[0].innerHTML;
      const text = this.quill.getText();
      this.updateCallback && this.updateCallback(html, text);
    });

    this.quill.emitter.on("focus", () => {
      if (!this.isEnabled()) return;
      this.focusCallback && this.focusCallback();
    });

    this.quill.emitter.on("blur", () => {
      if (!this.isEnabled()) return;
      this.blurCallback && this.blurCallback();
    });

    this.quill.on("selection-change", (range: RangeStatic) => {
      console.log(this.quill.getFormat());
      if (!range) {
        this.quill.emitter.emit("blur");
      } else {
        this.quill.emitter.emit("focus");
      }
    });
  }

  emitter(): Emitter {
    return this.quill.emitter;
  }

  history(): History {
    return this.quill.history;
  }

  enable(enable?: boolean) {
    this.quill.enable(enable);
  }

  isEnabled() {
    return this.quill.isEnabled();
  }

  onBlur(callback: Callback) {
    this.blurCallback = callback;
  }

  onFocus(callback: Callback) {
    this.focusCallback = callback;
  }

  onUpdate(callback: UpdateCallback) {
    this.updateCallback = callback;
  }

  addHandler() {
    console.log(1);
  }

  format(name: string, value: any) {
    this.quill.format(name, value);
  }

  getText() {
    return this.quill.getText();
  }

  getHtml() {
    return this.quill.root.children[0].innerHTML;
  }

  setContent(html: string) {
    if (!html) {
      this.quill.setText("");
      return;
    }
    if (html !== this.getHtml()) {
      this.quill.clipboard.dangerouslyPasteHTML(html);
    }
  }

  destroy() {
    console.log("destroy");
  }
}

export default Editor;
