import { App, Plugin } from "vue";

import Editor from "./editor";

const EditorPlugin: Plugin = {
  install: (app: App) => {
    app.component(Editor.name, Editor);
  },
};

export { Editor };
export default EditorPlugin;
