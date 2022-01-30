import { objToArr, arrToObj } from './utils/helper'
import { Commit, createStore } from 'vuex'
import http from '@/utils/http'
import { AxiosRequestConfig } from 'axios'

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
  columns: { data: ListProps<ColumnProps>, currentPage: number, total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: ListProps<{ currentPage: number, total: number }>, total: number };
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

const asyncAndCommit = (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  return http(url, config).then(data => {
    if (extraData) {
      commit(mutationName, { data, extraData })
    } else {
      commit(mutationName, data)
    }
    return data
  })
}

const store = createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {}, total: 0 },
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
      state.columns = {
        data: { ...state.columns.data, ...arrToObj(imagePolyfill(rawData.data.list, 'avatar', 50, 50)) },
        total: rawData.data.count,
        currentPage: +rawData.data.currentPage
      }
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = imagePolyfill([rawData.data], 'avatar', 100, 100)[0]
    },
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(imagePolyfill(rawData.data.list, 'image', 200, 110)) }
      state.posts.loadedColumns = {
        ...state.posts.loadedColumns,
        [columnId]: {
          total: rawData.data.count,
          currentPage: rawData.data.currentPage
        }
      }
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
    },
    updatePost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    }
  },
  actions: {
    fetchColumns({ state, commit }, { currentPage, pageSize }) {
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit, {
          method: 'get'
        })
      }
    },
    fetchColumn({ state, commit }, cid: string) {
      const currentColumn = state.columns.data[cid]
      if (!currentColumn) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit, {
          method: 'get'
        })
      }
    },
    fetchPosts({ state, commit }, { cid, currentPage, pageSize }) {
      if ((state.posts.loadedColumns[cid] && state.posts.loadedColumns[cid].currentPage < currentPage) || !state.posts.loadedColumns[cid]) {
        return asyncAndCommit(`/api/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, {
          method: 'get'
        }, cid)
      }
    },
    fetchCurrentUser({ commit }) {
      return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit, {
        method: 'get'
      })
    },
    login({ commit }, payload) {
      return asyncAndCommit('/api/user/login', 'login', commit, {
        method: 'post',
        data: payload
      })
    },
    loginAndFetch({ dispatch }, payload) {
      return dispatch('login', payload).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    createPost({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      })
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit, {
          method: 'get'
        })
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    }
  },
  getters: {
    getColumns(state) {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
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
