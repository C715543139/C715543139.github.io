<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  /* 目标页面 URL */
  src: string
}>()

/* sandbox 参数 */
const sandbox = computed(() => {
  return 'allow-scripts allow-same-origin allow-popups'
})
</script>

<template>
  <iframe
    :src="src"
    class="web-frame"
    :sandbox="sandbox"
    allowfullscreen
  />
</template>

<style scoped>

</style>
