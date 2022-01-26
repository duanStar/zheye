<template>
  <div class="container h-100 d-flex flex-column">
    <GlobalHeader :user="currentUser" />
    <Loader :text="'拼命加载中'" background="rgba(0,0,0,0.8)" v-if="loading" />
    <router-view></router-view>
    <footer class="footer mt-auto text-center py-4 text-secondary bg-light">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">©2022 者也专栏</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref } from 'vue'
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue'
import Loader from '@/components/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser: Ref<UserProps> = computed(() => store.state.user)
    const loading = computed(() => store.state.loading)
    return {
      currentUser,
      loading
    }
  }
})
</script>
