<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <ColumnList :list="list" />
    <ValidateForm @form-submit="onFormSubmit">
      <ValidateInput
        :rules="emailRules"
        :label="'邮箱'"
        v-model="email"
        type="email"
        placeholder="请输入邮箱地址"
        ref="inputRef"
      />
      <ValidateInput
        :rules="passwordRules"
        :label="'密码'"
        v-model="password"
        type="password"
        placeholder="请输入密码"
        ref="inputRef"
      />
      <template #submit>
        <span class="btn btn-danger">提交</span>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ColumnList, { ColumnProps } from '@/components/ColumnList.vue'
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1的专栏，有一段非常有意思的简介，可以更新一下'
    // avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是test2的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是test3的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  },
  {
    id: 4,
    title: 'test4的专栏',
    description: '这是test4的专栏，有一段非常有意思的简介，可以更新一下',
    avatar: 'https://images.dog.ceo/breeds/papillon/n02086910_8091.jpg'
  }
]
const currentUser: UserProps = {
  isLogin: true,
  name: 'zs'
}

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader,
    ValidateInput,
    ValidateForm
  },
  data() {
    return {
      list: testData,
      currentUser
    }
  },
  setup() {
    const email = ref('')
    const password = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const clear = () => {
      email.value = ''
      password.value = ''
    }
    const onFormSubmit = (valid: boolean) => {
      clear()
      if (valid) {
      }
    }
    return {
      email,
      password,
      emailRules,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
