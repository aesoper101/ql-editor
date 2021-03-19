<template>
  <div class="ql-docs">
    <div ref="editorRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Editor from "./editor";

export default defineComponent({
  name: "QlEditor",
  setup() {
    const editorRef = ref<HTMLElement>();

    onMounted(() => {
      if (editorRef.value) {
        const editor = new Editor(editorRef.value, {
          readyCallback: () => {
            console.log(2222);
          },
          content: "sss",
          disabled: false
        });

        editor.onUpdate((html: string, text: string) => {
          console.log("onUpdate=======", html, text);
        });
      }
    });

    return { editorRef };
  }
});
</script>

<style scoped></style>
