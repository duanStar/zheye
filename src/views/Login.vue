<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录到者也</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="email"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="password"
        />
        <div class="form-text">
          <a href="/signup" class="">还没有账户？去注册一个新的吧！</a>
        </div>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">
          登录
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const email = ref('111@test.com')
    const password = ref('111111')
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
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
    const onFormSubmit = async (valid: boolean) => {
      if (valid) {
        const payload = {
          email: email.value,
          password: password.value
        }
        store
          .dispatch('loginAndFetch', payload)
          .then(() => {
            createMessage('登录成功,2秒后跳转首页', 'success')
            setTimeout(() => {
              router.push({ name: 'home' })
            }, 2000)
          })
          .catch((e) => {
            clear()
          })
      }
    }
    return {
      email,
      password,
      emailRules,
      passwordRules,
      clear,
      onFormSubmit
    }
  }
})
</script>

<style scoped>
.btn-block {
  display: block;
  width: 100%;
}
</style>
