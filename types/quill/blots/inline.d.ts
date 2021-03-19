declare module "quill/blots/inline" {
  import { InlineBlot } from "parchment/src/parchment";

  declare class Inline extends InlineBlot {
    static compare(self: string, other: string): number;

    formatAt(index: number, length: number, name: string, value: any): void;

    optimize(context: any): void;
  }

  export default Inline;
}
