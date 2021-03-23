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

  interface NativeRange {
    start: {
      node: Node;
      offset: number;
    };
    end: {
      node: Node;
      offset: number;
    };
    native: Range;
  }

  declare class Selection {
    readonly lastRange: RangeStatic;
    readonly savedRange: RangeStatic;

    getBounds(index, length = 0): Rect;
    hasFocus(): boolean;

    normalizeNative(range: Range): NativeRange;

    normalizedToRange(normalized: NativeRange): RangeStatic;
  }

  export default Selection;
}
