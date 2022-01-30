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
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
      @click="loadMorePage"
      v-if="!isLastPage"
      type="button"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import useLoadMore from '@/hooks/useLoadMore'

export default defineComponent({
  name: 'ColumnDetail',
  components: { PostList },
  setup() {
    const route = useRoute()
    const currentId = route.params.id as string
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', {
        cid: currentId,
        currentPage: 1,
        pageSize: 6
      })
    })
    const column = computed(() => store.getters.getColumnById(currentId))
    const list = computed(() => store.getters.getPostsByCId(currentId))
    const total = computed(
      () => store.state.posts.loadedColumns[currentId]?.total
    )
    const currentPage = computed(
      () => store.state.posts.loadedColumns[currentId]?.currentPage
    )
    const { loadMorePage, isLastPage } = useLoadMore(
      'fetchPosts',
      total,
      {
        currentPage: currentPage.value ? currentPage.value + 1 : 2,
        pageSize: 5
      },
      {
        cid: currentId
      }
    )
    return {
      list,
      column,
      loadMorePage,
      isLastPage
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
