declare module "quill/blots/block" {
  import Delta from "quill-delta";
  import { BlockBlot, EmbedBlot } from "parchment/src/parchment";

  export class Block extends BlockBlot {
    delta(): Delta;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def: any): void;
  }

  export class BlockEmbed extends EmbedBlot {
    attach(): void;
    delta(): Delta;
    format(name: string, value: any);
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def: any): void;
  }

  export default Block;
}
