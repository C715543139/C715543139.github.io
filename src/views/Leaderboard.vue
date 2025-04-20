<script setup lang="ts">
interface Member {
  name: string
  avatar: string
  link: string
}

interface Category {
  title: string
  color: string
  members: Member[]
}

const categories: Category[] = [
  {
    title: '光荣榜',
    color: 'gold',
    members: [
      {
        name: 'ComoUMAflor',
        avatar: new URL('@/assets/heads/head5.webp', import.meta.url).href,
        link: 'https://space.bilibili.com/13059416',
      },
      {
        name: '明月栞那那那那',
        avatar: new URL('@/assets/heads/head2.gif', import.meta.url).href,
        link: 'https://space.bilibili.com/335085137',
      },
      {
        name: '云清婉莹',
        avatar: new URL('@/assets/heads/head3.png', import.meta.url).href,
        link: 'https://space.bilibili.com/3494360033266439',
      },
      {
        name: '魉魍魅魑饕餮',
        avatar: new URL('@/assets/heads/head4.avif', import.meta.url).href,
        link: 'https://space.bilibili.com/299607911',
      },
    ],
  },
  {
    title: '出生榜',
    color: 'navy',
    members: [
      {
        name: 'Styelx_-疯石楪',
        avatar: new URL('@/assets/heads/head7.jpg', import.meta.url).href,
        link: 'https://space.bilibili.com/394745859',
      },
      {
        name: '说书人-诸葛渊',
        avatar: new URL('@/assets/heads/head6.avif', import.meta.url).href,
        link: 'https://space.bilibili.com/237161070',
      },
    ],
  },
]
</script>

<template>
  <div class="board-container">
    <article class="board-category" v-for="cat in categories" :key="cat.title">
      <h1 class="title" :style="{ color: cat.color }">{{ cat.title }}</h1>

      <section v-for="m in cat.members" :key="m.name" class="card">
        <img :src="m.avatar" class="avatar" alt="avatar" />
        <el-link class="name" :href="m.link" :underline="false" target="_blank" rel="noopener noreferrer">
          {{ m.name }}
        </el-link>
      </section>
    </article>
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

.board-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.board-category {
  flex: 1;
}

.title {
  margin: 30px auto;

  font-size: 60px;
  text-align: center;
}

.card {
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 125px;
  margin-bottom: 10px;

  object-fit: cover;

  border: 5px solid #fff;
  border-radius: 50%;
}

.name {
  color: #fff;
  font-size: 25px;
}
</style>
