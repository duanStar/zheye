<template>
  <div class="column-detail-page w-690">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.url"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :list="list" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'

export default defineComponent({
  name: 'ColumnDetail',
  components: { PostList },
  setup() {
    const route = useRoute()
    const currentId = route.params.id
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed(() => store.getters.getColumnById(currentId))
    // column.value.avatar = {
    //   ...column.value.avatar,
    //   url: column.value.avatar?.url
    //     ? column.value.avatar?.url +
    //       '?x-oss-process=image/resize,m_pad,h_50,w_50'
    //     : require('@/assets/column.jpg')
    // }
    const list = computed(() => store.getters.getPostsByCId(currentId))
    return {
      list,
      column
    }
  }
})
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
</style>
