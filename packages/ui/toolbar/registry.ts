import { Component } from "./component";
import History from "quill/modules/history";
import Emitter from "quill/core/emitter";
import {
  ComponentCreateOptions,
  ComponentOptions,
  ComponentUpdateOptions,
  ToolbarComponentMap,
} from "./type";
import { DividerComponent } from "./modules/divider";
import { UndoButtonComponent } from "./modules/undo-button";
import { RedoButtonComponent } from "./modules/redo-button";
import { ButtonComponent } from "./modules/button";
import { FontComponent } from "./modules/font";
import { SizeComponent } from "./modules/size";
import { ColorComponent } from "./modules/color";
import { HeaderComponent } from "./modules/header";
import { ScriptComponent } from "./modules/script";
import { LineHeightComponent } from "./modules/line-height";
import { IndentComponent } from "./modules/indent";
import { ListComponent } from "./modules/list";
import { InsertComponent } from "./modules/insert";

export interface ComponentConstructor {
  boundary?: Element;
  format: string;
  formatVal?: string;
  options: ComponentOptions[];
  history?: History;
  emitter?: Emitter;

  new (): Component;
  create(container: HTMLElement, options: ComponentCreateOptions): void;
  update(data: ComponentUpdateOptions): void;
}

const defaultComponentMap: ToolbarComponentMap = {
  "|": DividerComponent,
  undo: UndoButtonComponent,
  redo: RedoButtonComponent,
  clean: ButtonComponent,
  painter: ButtonComponent,
  font: FontComponent,
  size: SizeComponent,
  bold: ButtonComponent,
  underline: ButtonComponent,
  strike: ButtonComponent,
  italic: ButtonComponent,
  color: ColorComponent,
  background: ColorComponent,
  header: HeaderComponent,
  align: ButtonComponent,
  script: ScriptComponent,
  lineHeight: LineHeightComponent,
  indent: IndentComponent,
  todo: ButtonComponent,
  ordered: ListComponent,
  bullet: ListComponent,
  insert: InsertComponent,
  print: ButtonComponent,
};

export class Registry {
  imports: Record<string, ComponentConstructor> = defaultComponentMap;

  static isValid(component: any) {
    return component instanceof Component;
  }

  register(format: string, component: ComponentConstructor): any {
    const cls = new component();
    if (Registry.isValid(cls)) {
      this.imports[format] = component;
    }
  }

  query(format: string): Component | undefined {
    const cls = this.imports[format];
    if (cls) {
      return new cls();
    }
    return undefined;
  }
}
