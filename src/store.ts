import { Commit, createStore } from 'vuex'
import http from '@/utils/http'

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: symbol;
  email?: string;
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

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  token: string;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
  error: GlobalErrorProps;
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
  return data
}

async function postAndCommit(url: string, mutationName: string, commit: Commit, payload: any) {
  return http.post(url, payload).then(data => {
    commit(mutationName, data)
    return data
  })
}

const store = createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
    },
    error: {
      status: false
    }
  },
  mutations: {
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      http.defaults.headers.common.Authorization = `Bearer ${token}`
      localStorage.setItem('token', token)
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
    fetchCurrentUser(state, rawData) {
      state.user = {
        isLogin: true,
        ...rawData.data
      }
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
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
    },
    fetchCurrentUser({ commit }) {
      getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    loginAndFetch({ dispatch }, payload) {
      return dispatch('login', payload).then(() => {
        return dispatch('fetchCurrentUser')
      })
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
