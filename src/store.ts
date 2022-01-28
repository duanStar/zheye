import { objToArr, arrToObj } from './utils/helper'
import { Commit, createStore } from 'vuex'
import http from '@/utils/http'

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface ResponseType<P = Record<string, unknown>> {
  code: number;
  msg: string;
  data: P;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
  author: string;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column?: string;
  author?: string | UserProps;
  isHTML?: boolean;
}

interface ListProps<P> {
  [id: string]: P;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  token: string;
  columns: ColumnProps[];
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  user: UserProps;
  loading: boolean;
  error: GlobalErrorProps;
}

interface WithAvatarProps {
  _id?: string;
  avatar?: ImageProps;
  image?: ImageProps;
  title: string;
  column?: string;
}

function imagePolyfill<T extends WithAvatarProps>(list: T[], key: 'avatar' | 'image', width: number, height: number) {
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

function getAndCommit(url: string, mutationName: string, commit: Commit) {
  return http.get(url).then(data => {
    commit(mutationName, data)
    return data
  })
}

function postAndCommit(url: string, mutationName: string, commit: Commit, payload: any) {
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
    posts: { data: {}, loadedColumns: [] },
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
      state.columns = imagePolyfill(rawData.data.list, 'avatar', 50, 50)
    },
    fetchColumn(state, rawData) {
      state.columns = imagePolyfill([rawData.data], 'avatar', 100, 100)
    },
    fetchPosts(state, rawData) {
      state.posts.data = { ...state.posts.data, ...arrToObj(imagePolyfill(rawData.data.list, 'image', 200, 110)) }
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
    },
    logout(state) {
      state.token = ''
      state.user.isLogin = false
      localStorage.removeItem('token')
      delete http.defaults.headers.common.Authorization
    },
    createPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    }
  },
  actions: {
    fetchColumns({ commit }) {
      getAndCommit('/api/columns?currentPage=1&pageSize=6', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid: string) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid: string) {
      getAndCommit(`/api/columns/${cid}/posts?currentPage=1&pageSize=6`, 'fetchPosts', commit)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    loginAndFetch({ dispatch }, payload) {
      return dispatch('login', payload).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    createPost({ commit }, payload) {
      return postAndCommit('/api/posts', 'createPost', commit, payload)
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCId: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store
