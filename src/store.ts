import { Commit, createStore } from 'vuex'
import http from '@/utils/http'

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
  author: string;
}

export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
}

interface WithAvatarProps {
  avatar?: ImageProps;
  image?: ImageProps;
}
function imagerPolyfill<T extends WithAvatarProps>(list: T[], key: 'avatar' | 'image', width: number, height: number) {
  return list.map((item: T) => {
    if (!item[key]) {
      item[key] = {
        url: require('@/assets/column.jpg')
      }
    } else {
      (item[key] as ImageProps).url =
      (item[key] as ImageProps).url + `?x-oss-process=image/resize,m_${key === 'avatar' ? 'pad' : 'fill'},h_${height},w_${width}`
    }
    return item
  })
}

async function getAndCommit(url: string, mutationName: string, commit: Commit) {
  const data = await http.get(url)
  commit(mutationName, data)
}

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
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
    },
    fetchColumns(state, rawData) {
      state.columns = imagerPolyfill(rawData.data.list, 'avatar', 50, 50)
    },
    fetchColumn(state, rawData) {
      state.columns = imagerPolyfill([rawData.data], 'avatar', 100, 100)
    },
    fetchPosts(state, rawData) {
      state.posts = imagerPolyfill(rawData.data.list, 'image', 200, 110)
    },
    setLoading(state, status) {
      state.loading = status
    }
  },
  actions: {
    fetchColumns({ commit }) {
      getAndCommit('/api/columns?currentPage=1&pageSize=5', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid: string) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid: string) {
      getAndCommit(`/api/columns/${cid}/posts?currentPage=1&pageSize=5`, 'fetchPosts', commit)
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCId: (state) => (cid: string) => {
      return state.posts.filter(p => p.column === cid)
    }
  }
})

export default store
