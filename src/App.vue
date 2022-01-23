<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <ColumnList :list="list" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ColumnList, { ColumnProps } from '@/components/ColumnList.vue'
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue'
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1的专栏，有一段非常有意思的简介，可以更新一下'
    // avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是test2的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是test3的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 4,
    title: 'test4的专栏',
    description: '这是test4的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  }
]
const currentUser: UserProps = {
  isLogin: true,
  name: 'zs'
}

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader
  },
  data() {
    return {
      list: testData,
      currentUser
    }
  }
})
</script>
