<template>
  <div class="ql-docs" :class="mode">
    <div ref="editor"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  onUnmounted,
  watch,
  PropType,
} from "vue";
import "./register";

import Quill, { QuillOptionsStatic, RangeStatic } from "quill";
import _ from "lodash";
import { Options, DEFAULT_TOOLBAR_OPTIONS } from "./config";

interface EditorState {
  quill: Quill | null;
  options: QuillOptionsStatic;
}

export default defineComponent({
  name: "QlEditor",
  components: {},
  props: {
    toolbar: {
      type: Object as PropType<Options>,
      default: () => {
        return DEFAULT_TOOLBAR_OPTIONS;
      },
    },
    placeholder: {
      type: String,
      default: "请输入文本",
    },
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: 300,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limitHeight: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "bordered", // read | bordered
    },
  },
  setup(props, { emit }) {
    const state: EditorState = {
      quill: null,
      options: {
        theme: "bee",
        modules: {
          toolbar: props.toolbar || [],
        },
        bounds: document.body,
        placeholder: props.placeholder,
        readOnly: false,
        debug: "error",
      },
    };

    const editor = ref<Element | null>(null);

    let _content = "";

    watch(
      () => props.value,
      (val: string) => {
        if (state.quill) {
          if (val && val !== _content) {
            _content = val;
            state.quill.clipboard.dangerouslyPasteHTML(val);
          } else if (!val) {
            state.quill.setText("");
          }
        }
      }
    );

    watch(
      () => props.content,
      (val) => {
        if (state.quill) {
          if (val && val !== _content) {
            _content = val;
            state.quill.clipboard.dangerouslyPasteHTML(val);
          } else if (!val) {
            state.quill.setText("");
          }
        }
      }
    );

    watch(
      () => props.disabled,
      (val) => {
        if (state.quill) {
          state.quill.enable(!val);
        }
      }
    );

    const initialize = () => {
      if (editor.value) {
        // noinspection TypeScriptValidateTypes
        state.quill = new Quill(
          editor.value,
          _.merge(state.options, {
            modules: {},
          })
        );

        if (props.limitHeight) {
          state.quill.container.style.height = props.height + "px";
        } else {
          state.quill.container.style.minHeight = props.height + "px";
        }

        if (props.value) {
          state.quill.clipboard.dangerouslyPasteHTML(0, props.value);
        }

        state.quill.on("selection-change", (range: RangeStatic) => {
          if (!range) {
            emit("blur", state.quill);
          } else {
            emit("focus", state.quill);
          }
        });

        state.quill.on("text-change", () => {
          if (state.quill && editor.value) {
            if (props.disabled) {
              state.quill.enable(false);
            }
            let html = (editor.value as HTMLElement).children[0].innerHTML;
            const quill = state.quill;
            const text = state.quill.getText();
            if (html === "<p><br></p>") html = "";
            _content = html;

            emit("update:value", _content);
            emit("change", { html, text, quill });
          }
        });

        emit("ready", state.quill);
      }
    };

    onMounted(() => {
      initialize();
    });

    onUnmounted(() => {
      state.quill = null;
    });

    return { editor };
  },
});
</script>
