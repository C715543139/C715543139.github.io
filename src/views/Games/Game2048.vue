<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/* ------------------ 基础常量 ------------------ */
const MAP_SIZE = 4
const SWAP = (x: number, y: number) => [y, x]

/* ------------------ 响应式棋盘 ------------------ */
const gMap = ref<number[][]>(
  Array.from({ length: MAP_SIZE + 2 }, () => Array(MAP_SIZE + 2).fill(0)),
)

/* 将二维数组（1…4 行列）展开为一维，方便 v‑for 渲染 */
const flatMap = computed(() =>
  gMap.value.slice(1, MAP_SIZE + 1).flatMap((row) => row.slice(1, MAP_SIZE + 1)),
)

/* ------------------ 工具函数 ------------------ */
function rand(max: number) {
  return Math.floor(Math.random() * max)
}

function newBlock() {
  const free: [number, number][] = []
  for (let y = 1; y <= MAP_SIZE; y++)
    for (let x = 1; x <= MAP_SIZE; x++) if (gMap.value[y][x] === 0) free.push([y, x])

  if (!free.length) return
  const [y, x] = free[rand(free.length)]
  gMap.value[y][x] = rand(10) === 5 ? 4 : 2
}

function initiate() {
  newBlock()
  newBlock()
}

/* ------------------ 推动 / 合并 ------------------ */
function push(dir: string) {
  let changed = false
  const UP = dir === 'ArrowUp',
    DOWN = dir === 'ArrowDown',
    LEFT = dir === 'ArrowLeft'

  for (let x = 1; x <= MAP_SIZE; ++x) {
    for (
      let y = UP || LEFT ? 1 : MAP_SIZE;
      UP || LEFT ? y < MAP_SIZE : y > 1;
      UP || LEFT ? y++ : y--
    ) {
      const a = UP || DOWN ? [y, x] : [x, y]
      const cur = gMap.value[a[0]][a[1]]
      if (cur !== 0) continue

      let i = UP || LEFT ? y + 1 : y - 1
      while (
        (UP || LEFT ? i <= MAP_SIZE : i >= 1) &&
        gMap.value[UP || DOWN ? i : x][UP || DOWN ? x : i] === 0
      )
        UP || LEFT ? i++ : i--

      if (UP || LEFT ? i <= MAP_SIZE : i >= 1) {
        changed = true
        const b = UP || DOWN ? [i, x] : [x, i]
        ;[gMap.value[a[0]][a[1]], gMap.value[b[0]][b[1]]] = SWAP(
          gMap.value[a[0]][a[1]],
          gMap.value[b[0]][b[1]],
        )
      }
    }
  }
  return changed
}

function merge(dir: string) {
  let changed = false
  const UP = dir === 'ArrowUp',
    DOWN = dir === 'ArrowDown',
    LEFT = dir === 'ArrowLeft'

  const loop = (x: number, y: number, dx: number, dy: number) => {
    const [y1, x1] = [y, x]
    const [y2, x2] = [y + dy, x + dx]
    if (gMap.value[y1][x1] !== 0 && gMap.value[y1][x1] === gMap.value[y2][x2]) {
      gMap.value[y1][x1] *= 2
      gMap.value[y2][x2] = 0
      changed = true
    }
  }

  if (UP || DOWN) {
    for (let x = 1; x <= MAP_SIZE; x++)
      for (let y = UP ? 1 : MAP_SIZE; UP ? y < MAP_SIZE : y > 1; UP ? y++ : y--)
        loop(x, y, 0, UP ? 1 : -1)
  } else {
    for (let y = 1; y <= MAP_SIZE; y++)
      for (let x = LEFT ? 1 : MAP_SIZE; LEFT ? x < MAP_SIZE : x > 1; LEFT ? x++ : x--)
        loop(x, y, LEFT ? 1 : -1, 0)
  }
  return changed
}

function hasMove() {
  for (let y = 1; y <= MAP_SIZE; y++)
    for (let x = 1; x <= MAP_SIZE; x++) {
      const v = gMap.value[y][x]
      if (
        v === 0 ||
        v === gMap.value[y - 1][x] ||
        v === gMap.value[y + 1][x] ||
        v === gMap.value[y][x - 1] ||
        v === gMap.value[y][x + 1]
      )
        return true
    }
  return false
}

/* ------------------ 键盘事件 ------------------ */
function handleKey(e: KeyboardEvent) {
  const key = e.key
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return

  e.preventDefault()
  const moved = (push(key) ? 1 : 0) | (merge(key) ? 1 : 0) | (push(key) ? 1 : 0)

  if (moved) newBlock()
  if (!hasMove()) {
    alert('GAME OVER!')
    reset()
  }
}

function reset() {
  gMap.value.forEach((row) => row.fill(0))
  initiate()
}

/* ------------------ 生命周期 ------------------ */
onMounted(() => {
  initiate()
  window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div class="window2048">
    <h1 v-for="(cell, i) in flatMap" :key="i" class="block2048" :class="'v' + cell">
      {{ cell || '' }}
    </h1>
  </div>
</template>

<style scoped>
.window2048 {
  display: grid;
  grid-template: repeat(4, 120px) / repeat(4, 120px);
}

.block2048 {
  margin: 0;
  display: grid;
  place-items: center;
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  border: 2px solid #fff;
  transition: background 0.3s;
}

.block2048.v2 {
  background: rgb(238, 228, 218);
  color: #776e65;
}

.block2048.v4 {
  background: rgb(236, 224, 200);
  color: #776e65;
}

.block2048.v8 {
  background: rgb(242, 177, 121);
}

.block2048.v16 {
  background: rgb(245,199,49);
}

.block2048.v32 {
  background: rgb(245,124,95);
}

.block2048.v64 {
  background: rgb(246,93,59);
}

.block2048.v128 {
  background: rgb(237,106,113);
}

.block2048.v256 {
  background: rgb(237,204,97);
}

.block2048.v512 {
  background: rgb(236,200,80);
}

.block2048.v1024 {
  background: rgb(237,197,63);
}

.block2048.v2048 {
  background: red;
}


</style>
