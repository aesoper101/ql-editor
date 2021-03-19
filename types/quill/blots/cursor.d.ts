declare module "quill/blots/cursor" {
  import { EmbedBlot } from "parchment/src/parchment";
  import { Root } from "parchment/src/blot/abstract/blot";

  declare class Cursor extends EmbedBlot {
    static value(): undefined;

    constructor(public scroll: Root, public domNode: Node);
  }
  export default Cursor;
}
