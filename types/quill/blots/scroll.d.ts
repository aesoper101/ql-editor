import Registry from "parchment/src/registry";

declare module "quill/blots/scroll" {
  import { ScrollBlot } from "parchment/src/parchment";

  declare class Scroll extends ScrollBlot {
    constructor(registry: Registry, domNode: HTMLDivElement, { emitter });

    isEnabled(): boolean;
  }

  export default Scroll;
}
