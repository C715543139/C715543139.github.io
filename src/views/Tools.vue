<script setup lang="ts">
import Markdown from '../components/Markdown.vue'
import { ref } from 'vue'

const mdText = ref(`
# 自用工具

## 1. [SMS-Activate](https://sms-activate.org/cn/freePrice#activation)
提供虚拟手机号服务，用来注册外面的各种账号。

## 2. [唧唧](https://www.jijidown.com/)
B 站视频下载。

## 3. [音乐解锁](https://demo.unlock-music.dev/)
**（需要科学上网）** 移除已购音乐的加密保护，支持网易云音乐 (ncm)、QQ 音乐 (qmc, mflac, mgg)、酷狗音乐 (kgm)、虾米音乐 (xm)、酷我音乐 (kwm) 等等。

## 4. [AI 魔术橡皮擦](https://jpgrm.com/)
图一乐的橡皮擦工具，~~众所周知最好的擦除工具是手画。~~

## 5. [文件转换器](https://convertio.co/zh/)
免费转换各种文件格式。

## 6. [迅捷语音转文字](https://app.xunjiepdf.com/voice2text/)
中文效果还可以，其实有本地的 AI 模型可以跑语音转文字。

## 7. [GeoGebra](https://www.geogebra.org/download)
数学工具，高中经常用。

## 8. [SauceNAO](https://saucenao.com/)
**（需要科学上网）** 懂的都懂 :)

## 9. [MSDN](https://next.itellyou.cn/Original/Index)
各种原版镜像下载。

## 10. [Bigjpg](https://bigjpg.com/)
AI 图片放大，虽然本地也有 AI 模型可以搞，但在线版更方便。

## 11. [Google 语音识别](https://cloud.google.com/speech-to-text?hl=zh-cn)
**（需要科学上网）** 同上，语音识别服务。

## 12. [第一PPT](https://www.1ppt.com/)
可以找 PPT 模板。

## 13. [Canva 可画](https://www.canva.cn/)
在线设计工具，有些功能需氪金。

## 14. [Send Anywhere](https://send-anywhere.com/)
远程传文件，小文件传输很方便。

## 15. [VoiceRemover](https://vocalremover.org/zh/)
AI 分离音轨，效果不错，免费！

## 16. [Hugging Face](https://huggingface.co/)
模型站一号。

## 17. [Civitai](https://civitai.com/)
模型站二号。

## 18. [白描](https://web.baimiaoapp.com/image-to-latex/en)
在线 OCR，可以提取数学公式。

## 19. [LaTeX 公式编辑器](https://latex.codecogs.com/eqneditor/editor.php)
在线 LaTeX 公式编辑器。

## 20. [Overleaf](https://cn.overleaf.com/project)
在线 LaTeX 编辑器。

## 21. [TablesGenerator](https://www.tablesgenerator.com/#)
创建表格的工具。
`)
</script>

<template>
  <div class="tool-container">
    <Markdown class="tool-text" :source="mdText"></Markdown>
  </div>
</template>

<style scoped>
/* * * * * *
 *   模型   *
 *   布局   *
 *   视觉   *
 *   排版   *
 *   交互   *
 * * * * * */

.tool-container{
  width: 100%;
  height: 100%;
}

.tool-text{
  padding-top: 0;
}
</style>
