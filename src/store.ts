import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from '@/testData'

interface UserProps {
  isLogin: boolean
  name?: string
  id?: number,
  columnId?: number
}
export interface GlobalDataProps {
  columns: ColumnProps[],
  posts: PostProps[],
  user: UserProps
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: {
      isLogin: true,
      name: 'zs',
      columnId: 1,
      id: 1
    }
  },
  mutations: {
    login(state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: 'zs',
        id: 1
      }
    }
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      return state.columns.find(c => c.id === id)
    },
    getPostsByCId: (state) => (cid: number) => {
      return state.posts.filter(p => p.columnId === cid)
    }
  }
})
export default store
