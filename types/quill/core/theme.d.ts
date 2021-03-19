declare module "quill/core/theme" {
  import { StringMap, Quill, QuillOptionsStatic } from "quill";

  export class Theme {
    quill: Quill;
    options: QuillOptionsStatic;
    modules: StringMap;

    constructor(quill: Quill, options?: QuillOptionsStatic);

    protected addModule(name: string): any;
  }

  export default Theme;
}
