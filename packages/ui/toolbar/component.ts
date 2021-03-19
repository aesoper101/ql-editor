import {
  AbstractComponent,
  ComponentCreateOptions,
  ComponentOptions,
  ComponentUpdateOptions
} from "./type";
import { StringMap } from "quill";
import FormatEvent from "../../modules/format-event";
import History from "quill/modules/history";

export class Component extends AbstractComponent {
  boundary: HTMLElement | undefined = document.body;
  container: HTMLElement | undefined = document.body;
  format = "";
  formatVal: string | undefined = undefined;
  options: ComponentOptions[] = [];
  history: History | undefined = undefined;
  emitter: FormatEvent | undefined = undefined;
  currentFormats: StringMap = {};

  constructor() {
    super();
  }

  private setData(data: any) {
    if (!data) return;
    if (typeof data === "string") {
      this.format = data;
    } else {
      const format = Object.keys(data)[0];
      const value = data[format];
      this.format = format;
      if (Array.isArray(value)) {
        this.options = value;
      } else if (typeof value === "string") {
        this.formatVal = value;
      }
    }
  }

  create(container: HTMLElement, options: ComponentCreateOptions) {
    this.emitter = options.emitter;
    this.history = options.history;
    this.container = container;
    this.boundary = options.boundary;
    this.setData(options.data);
    this.createElement();
    this.listen();
  }

  protected createElement() {
    return;
  }

  update(data: ComponentUpdateOptions): void {
    this.currentFormats = data.formats || {};
    return;
  }

  protected listen() {
    return;
  }
}
