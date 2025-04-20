<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

/*****************
 * 基础常量与状态 *
 *****************/
const CELL = 50
const ratio = window.devicePixelRatio || 1

// 响应式配置
const config = reactive({
  width: 9,
  height: 9,
  mines: 10,
})

// 地图数据（包一圈哨兵）
let minesMap: number[][] = [] // 0=无雷 1=有雷
let statusMap: number[][] = [] // 0=揭开 1=覆盖 2=旗帜

// 运行状态
const flagCount = ref(0)
const firstClick = ref(true)

/*****************
 * DOM 引用       *
 *****************/
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D

/*****************
 * 工具函数       *
 *****************/
const rand = (max: number) => Math.floor(Math.random() * max)

const xy2XY = (x: number, y: number) => [Math.floor(x / CELL) + 1, Math.floor(y / CELL) + 1]
const XY2xy = (X: number, Y: number) => [(X - 1) * CELL, (Y - 1) * CELL]

function drawGrid() {
  ctx.clearRect(0, 0, canvasRef.value!.width / ratio, canvasRef.value!.height / ratio)
  for (let r = 0; r < config.height; r++) {
    for (let c = 0; c < config.width; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? '#fafafa' : '#dcdcdc'
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL)
    }
  }
}

function initMaps() {
  minesMap = Array.from({ length: config.height + 2 }, () => Array(config.width + 2).fill(0))
  statusMap = Array.from({ length: config.height + 2 }, () => Array(config.width + 2).fill(1))
  flagCount.value = 0
  firstClick.value = true
}

function placeMines(ex: number, ey: number) {
  let [safeX, safeY] = xy2XY(ex, ey)
  let placed = 0
  while (placed < config.mines) {
    const row = rand(config.height) + 1
    const col = rand(config.width) + 1
    if ((row === safeY && col === safeX) || minesMap[row][col] === 1) continue
    minesMap[row][col] = 1
    placed++
  }
}

function countMines(X: number, Y: number) {
  if (minesMap[Y][X]) return -1
  let sum = 0
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++)
      if (dx || dy) sum += minesMap[Y + dy][X + dx]
  return sum
}

function drawNum(cx: number, cy: number, n: number) {
  ctx.font = `${CELL * 0.7}px monospace`
  ctx.fillStyle = '#333'
  ctx.fillText(String(n), cx + CELL * 0.3, cy + CELL * 0.8)
}

function uncoverSingle(X: number, Y: number): number | undefined {
  if (X < 1 || Y < 1 || X > config.width || Y > config.height) return
  if (statusMap[Y][X] !== 1) return

  const [cx, cy] = XY2xy(X, Y)
  const n = countMines(X, Y)
  if (n === -1) {
    alert('GAME OVER!')
    reset()
    return
  }
  ctx.clearRect(cx, cy, CELL, CELL)
  statusMap[Y][X] = 0
  if (n) drawNum(cx, cy, n)
  return n
}

function floodFill(X: number, Y: number) {
  const n = uncoverSingle(X, Y)
  if (n === 0) {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++)
        if (dx || dy) floodFill(X + dx, Y + dy)
  }
}

function rightClickFlag(X: number, Y: number) {
  if (statusMap[Y][X] === 1 && flagCount.value < config.mines) {
    const [cx, cy] = XY2xy(X, Y)
    ctx.fillStyle = '#ff3333'
    ctx.font = `${CELL * 0.6}px monospace`
    ctx.fillText('⚑', cx + CELL * 0.18, cy + CELL * 0.78)
    statusMap[Y][X] = 2
    flagCount.value++
  } else if (statusMap[Y][X] === 2) {
    const [cx, cy] = XY2xy(X, Y)
    ctx.fillStyle = (X + Y) % 2 === 0 ? '#fafafa' : '#dcdcdc'
    ctx.fillRect(cx, cy, CELL, CELL)
    statusMap[Y][X] = 1
    flagCount.value--
  }
}

function checkWin() {
  for (let y = 1; y <= config.height; y++)
    for (let x = 1; x <= config.width; x++)
      if (statusMap[y][x] === 1 && minesMap[y][x] === 0) return false
  return true
}

/*****************
 * 事件处理       *
 *****************/
function canvasLeft(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (firstClick.value) {
    placeMines(x, y)
    firstClick.value = false
  }
  const [X, Y] = xy2XY(x, y)
  floodFill(X, Y)
  if (checkWin()) {
    alert('YOU WIN!')
    reset()
  }
}

function canvasRight(e: MouseEvent) {
  e.preventDefault()
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const [X, Y] = xy2XY(e.clientX - rect.left, e.clientY - rect.top)
  rightClickFlag(X, Y)
}

function reset() {
  initMaps()
  resizeCanvas()
  drawGrid()
}

/*****************
 * 画布初始化     *
 *****************/
function resizeCanvas() {
  if (!canvasRef.value) return
  canvasRef.value.style.width = config.width * CELL + 'px'
  canvasRef.value.style.height = config.height * CELL + 'px'
  canvasRef.value.width = config.width * CELL * ratio
  canvasRef.value.height = config.height * CELL * ratio
  ctx.scale(ratio, ratio)
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')!
  reset()
  canvasRef.value.addEventListener('click', canvasLeft)
  canvasRef.value.addEventListener('contextmenu', canvasRight)
})

onBeforeUnmount(() => {
  canvasRef.value?.removeEventListener('click', canvasLeft)
  canvasRef.value?.removeEventListener('contextmenu', canvasRight)
})

/*****************
 * 工具栏动作     *
 *****************/
function changeMode() {
  const w = Number(prompt('请输入地图宽度(9‑25)', String(config.width)))
  if (!w || w < 9 || w > 25) return alert('无效的宽度！')
  const h = Number(prompt('请输入地图高度(9‑25)', String(config.height)))
  if (!h || h < 9 || h > 25) return alert('无效的高度！')
  const n = Number(prompt('请输入地雷数量(10‑100)', String(config.mines)))
  if (!n || n < 10 || n >= w * h) return alert('无效的数量！')
  Object.assign(config, { width: w, height: h, mines: n })
  reset()
}
</script>

<template>
  <div class="toolbar">
    <button @click="changeMode">难度设置</button>
    <span>⚑ {{ config.mines - flagCount }}</span>
    <button @click="reset">重来！</button>
  </div>
  <canvas ref="canvasRef" class="mine-canvas" />
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  color: #fff;
  font-size: 20px;
}
button {
  color: #222;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.mine-canvas {
  margin-top: 15px;
  border: 3px solid #fff;
}
</style>
