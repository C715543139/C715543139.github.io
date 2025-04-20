<script setup lang="ts">
</script>

<template>
  <div class="root-layout">
    <el-container class="main-container">
      <el-header id="header-bar">
        <el-text class="header-text" id="name">Natsu no Rinkaku</el-text>
        <div class="head-right-container">
          <router-link class="header-text" to="/">首页</router-link>
          <router-link class="header-text" to="/games">游戏</router-link>
          <router-link class="header-text" to="/tools">工具</router-link>
          <router-link class="header-text" to="/leaderboard">打榜</router-link>
        </div>
      </el-header>
      <el-container id="main-container">
        <el-main id="main-card">
          <!-- 1. router-view 用 slot props -->
          <router-view v-slot="{ Component, route }">
            <!-- 2. transition 包裹 Component -->
            <transition name="fade" mode="out-in">
              <!-- 3. key 用 route.fullPath 保证切换动画生效 -->
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
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

.main-container {
  --header-height: 80px;
}

.root-layout {
  display: flex;
  flex-direction: row;
}

#header-bar {
  width: 100vw;
  height: var(--header-height);
  padding: 0 40px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
}

.header-text {
  margin: 0 30px;

  font-size: 25px;
  color: white;
}

#name {
  padding-top: 80px;

  font-family: 'Signarita Zhai', monospace;
  font-size: 25px;
  font-weight: bold;
}

#main-container {
  width: 100vw;
  height: calc(100vh - var(--header-height));

  display: grid;
  grid-column: 1;
  grid-row: 1;
  align-items: center;
  justify-content: center;

  font-size: 25px;
  color: white;
}

#main-card {
  width: 85vw;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(10px) brightness(0.8);
  border-radius: 30px;
  scrollbar-width: none;
}

#main-card::-webkit-scrollbar {
  display: none;
}
</style>
