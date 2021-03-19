declare module "quill/core/module" {
  import { Quill, StringMap } from "quill";

  export class Module {
    quill: Quill;
    options: StringMap;
    container: HTMLElement | null;

    constructor(quill: Quill, options?: StringMap);
  }

  export default Module;
}
