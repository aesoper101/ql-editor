declare module "quill/core/selection" {
  import { RangeStatic } from "quill";

  export interface Rect {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
  }

  export class Range {
    index: number;
    length: number;
    constructor(index: number, length: number = 0);
  }

  declare class Selection {
    readonly lastRange: RangeStatic;
    readonly savedRange: RangeStatic;

    getBounds(index, length = 0): Rect;
    hasFocus(): boolean;
  }

  export default Selection;
}
