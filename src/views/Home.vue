<template>
  <div class="home">
    <ql-editor v-model:value="value" />
    {{ value }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QlEditor from "../../packages/index.vue";

export default defineComponent({
  components: { QlEditor },
  setup() {
    const value = ref("");
    return { value };
  },
});
</script>
<style scoped>
.test li::before {
  content: "(" counter(num, decimal) ")";
  color: #f00;
}
.test li {
  counter-increment: num;
}
</style>
