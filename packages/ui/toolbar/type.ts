import History from "quill/modules/history";
import Quill, { StringMap } from "quill";
import FormatEvent from "../../modules/format-event";

export type HandlerFunc = (quill: Quill, formatValue?: string) => string | void;

export interface ComponentUpdateOptions {
  formats: StringMap;
}

export interface ComponentOptions {
  value: string;
  label: string;
}

export type CssStyle = Partial<CSSStyleDeclaration>;

export interface ComponentCreateOptions {
  history: History;
  emitter: FormatEvent;
  boundary: HTMLElement;
  data: any;
}

export abstract class AbstractComponent {
  abstract format: string; // 当前格式
  abstract formatVal: string | undefined; // 当前格式值
  abstract options: ComponentOptions[]; // 格式值列表
  abstract history: History | undefined; // 历史
  abstract emitter: FormatEvent | undefined; // 事件
  abstract currentFormats: StringMap; // 当前文本格式
  abstract container: HTMLElement | undefined;
  abstract boundary: Element | undefined;

  abstract create(
    container: HTMLElement,
    options: ComponentCreateOptions
  ): void;

  protected abstract listen(): void;

  protected abstract createElement(): void;

  abstract update(data: ComponentUpdateOptions): void;
}

export interface ToolbarComponentMap {
  [key: string]: InstanceType<any>;
}
