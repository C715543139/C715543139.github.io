<script setup lang="ts">
import { ArrowLeftBold, Menu } from '@element-plus/icons-vue'
import Game2048 from './Game2048.vue'
import { ref } from 'vue'

const current = ref(Game2048)
const inGame = ref(false)
const reload = ref(0)

function selectGame(game: typeof Game2048) {
  current.value = game
  reload.value = Date.now()
  inGame.value = true
}
</script>

<template>
  <div class="game-container">
    <el-link
      id="back-button"
      v-if="inGame"
      @click="inGame = false"
      :icon="ArrowLeftBold"
      :underline="false"
    ></el-link>

    <div class="game-group" v-if="!inGame">
      <el-link class="game-item" :icon="Menu" :underline="false" @click="selectGame(Game2048)">
        2048
      </el-link>
    </div>
    <div class="game-display" v-if="inGame">
      <component :is="current" :key="reload" />
    </div>
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

.game-container {
  width: 100%;
  height: 100%;

  display: flex;
}

#back-button {
  position: absolute;
  left: 2.5%;
  top: 5%;

  color: white;
  font-size: 40px;
}

.game-group {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.game-item {
  display: flex;
  flex: 1;
  flex-direction: column;

  color: white;
  font-size: 80px;
}

.game-display {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>
