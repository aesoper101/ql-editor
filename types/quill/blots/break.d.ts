declare module "quill/blots/break" {
  import { EmbedBlot } from "parchment/src/parchment";

  declare class Break extends EmbedBlot {
    static value(): undefined;
    optimize(): void;
    length(): number;
    value(): string;
  }

  export default Break;
}
