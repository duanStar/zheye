import { computed, ComputedRef, Ref, ref } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  currentPage: number;
  pageSize: number;
}

const useLoadMore: (actionName: string, total: ComputedRef<number>, params?: LoadParams, extraData?: any) => {
  loadMorePage: () => void,
  isLastPage: ComputedRef<boolean>,
  currentPage: Ref<number>
} = (actionName, total, params = {
  currentPage: 2,
  pageSize: 5
}, extraData) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => {
    if (extraData) {
      return {
        currentPage: currentPage.value,
        pageSize: params.pageSize,
        ...extraData
      }
    }
    return {
      currentPage: currentPage.value,
      pageSize: params.pageSize
    }
  })
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
