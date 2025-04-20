<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import markdownItKatex from 'markdown-it-katex';
import linkAttrs from 'markdown-it-link-attributes'

const props = defineProps<{
  source: string
}>()

// 创建一个 markdown-it 实例，按需开启插件
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItKatex)
  .use(linkAttrs, {
    matcher: (_: string) => true,
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  })

// 渲染并净化
const renderedHtml = computed(() => {
  const raw = md.render(props.source || '')
  return DOMPurify.sanitize(raw, {
    ADD_ATTR: ['target'],
  })
})
</script>

<template>
  <!-- 注意：使用 v-html，插入已净化的 HTML -->
  <div class="markdown-body" v-html="renderedHtml" />
</template>

<style scoped>
.markdown-body {
  padding: 1rem;
}
</style>
