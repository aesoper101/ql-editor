<template>
  <div class="home">
    <ql-editor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QlEditor from "../../packages/QlEditor.vue";

export default defineComponent({
  components: { QlEditor },
  setup() {
    return {};
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
