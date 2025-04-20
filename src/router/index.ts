import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 布局组件
const RootLayout = () => import('../layouts/RootLayout.vue')

// 页面组件
const Home = () => import('../views/Home.vue')

// 小游戏
const GamesLayout = () => import('../views/Games/Games.vue')

// 工具
const Tools = () => import('../views/Tools.vue')

// 榜单
const Leaderboard = () => import('../views/Leaderboard.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RootLayout,
    children: [
      // 默认首页
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      // 小游戏
      {
        path: 'games',
        name: 'Games',
        component: GamesLayout,
      },
      // 工具
      {
        path: 'tools',
        name: 'Tools',
        component: Tools,
      },
      // 榜单
      {
        path: 'leaderboard',
        name: 'Leaderboard',
        component: Leaderboard,
      },
    ],
  },
  // 404 重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 保持滚动位置
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router
