<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link to="/" class="navbar-brand">者也专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2"
          >登陆</router-link
        >
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2"
          >注册</router-link
        >
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <DropDown :title="`你好！${user.nickName}`">
          <DropDownItem>
            <router-link to="/create" class="dropdown-item"
              >新建文章</router-link
            >
          </DropDownItem>
          <DropDownItem>
            <router-link to="#" class="dropdown-item">编辑资料</router-link>
          </DropDownItem>
          <DropDownItem>
            <router-link to="#" class="dropdown-item">退出登录</router-link>
          </DropDownItem>
        </DropDown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from '@/components/DropDown.vue'
import DropDownItem from '@/components/DropDownItem.vue'
import { UserProps } from '@/store'

export default defineComponent({
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  components: {
    DropDown,
    DropDownItem
  }
})
</script>

<style scoped></style>
