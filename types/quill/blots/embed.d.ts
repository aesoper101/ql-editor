declare module "quill/blots/embed" {
  import { EmbedBlot } from "parchment/src/parchment";

  interface RestoreRange {
    startNode: Text;
    startOffset: number;
  }

  declare class Embed extends EmbedBlot {
    restore(node: Node): RestoreRange;
  }

  export default Embed;
}
