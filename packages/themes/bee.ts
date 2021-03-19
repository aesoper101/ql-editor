import { Quill, QuillOptionsStatic } from "quill";
import Theme from "quill/core/theme";
import { DEFAULT_TOOLBAR_OPTIONS } from "../config";

class BeeTheme extends Theme {
  constructor(quill: Quill, options?: QuillOptionsStatic) {
    if (
      options?.modules?.toolbar != null &&
      options?.modules?.toolbar.container == null
    ) {
      options.modules.toolbar.container = DEFAULT_TOOLBAR_OPTIONS.container;
    }
    super(quill, options);
  }
}

export default BeeTheme;
