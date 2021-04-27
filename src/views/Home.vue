<template>
  <div class="home">
    <ql-editor v-model:value="value" />
    {{ value }}
  </div>
</template>

<script lang="ts">
import "ql-editor/assets/scss/index.scss";
import { defineComponent, ref } from "vue";
import { Editor } from "ql-editor";

export default defineComponent({
  components: { QlEditor: Editor },
  setup() {
    const value = ref("");
    return { value };
  },
});
</script>
<style lang="scss" scoped>

.test li::before {
  content: "(" counter(num, decimal) ")";
  color: #f00;
}
.test li {
  counter-increment: num;
}
</style>
