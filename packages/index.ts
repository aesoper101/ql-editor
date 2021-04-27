import { App } from "vue";

import Editor from "./editor.vue";

const install = (app: App) => {
  app.component(Editor.name, Editor);
};

export { Editor };
export default { install };
