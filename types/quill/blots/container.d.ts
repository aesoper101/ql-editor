declare module "quill/blots/container" {
  import { BlotConstructor } from "parchment/src/blot/abstract/blot";
  import { ContainerBlot } from "parchment/src/parchment";

  export class Container extends ContainerBlot {
    static blotName: string;
    static tagName: string;

    static allowedChildren: BlotConstructor[] | null;

    checkMerge(): boolean;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    optimize(context: { [key: string]: any }): void;
  }

  export default Container;
}
