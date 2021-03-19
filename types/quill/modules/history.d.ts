declare module "quill/modules/history" {
  import { Quill } from "quill";
  import Module from "quill/core/module";
  import Delta from "quill-delta";

  export interface HistoryStack {
    undo: Delta[];
    redo: Delta[];
  }

  export interface HistoryOptions {
    delay: number;
    maxStack: number;
    userOnly: boolean;
  }

  declare class History extends Module {
    readonly stack: HistoryStack;
    readonly lastRecorded: number;
    readonly ignoreChange: boolean;
    readonly options: HistoryOptions;

    constructor(quill: Quill, options?: HistoryOptions);

    clear(): void;

    cutoff(): void;

    redo(): void;

    undo(): void;
  }

  export default History;
}
