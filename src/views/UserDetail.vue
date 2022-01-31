<template>
  <div class="update-profile-page w-690">
    <ul class="nav nav-tabs my-4">
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="{ active: editMode === 'user' }"
          @click.stop="editMode = 'user'"
        >
          更新个人资料
        </a>
      </li>
      <li>
        <a
          href="#"
          class="nav-link"
          :class="{ active: editMode === 'column' }"
          @click.stop="editMode = 'column'"
        >
          更新专栏信息
        </a>
      </li>
    </ul>
    <h4></h4>
    <Uploader
      action="/api/upload"
      class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
      :uploaded="uploadData"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      @file-upload-error="onFileUploadError"
    >
      <h3>点击上传图片</h3>
      <template #loading>
        <div class="d-flex align-items-center">
          <div class="spinner-border text-secondary" role="status"></div>
          <h2 style="margin-bottom: 0.2rem">正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.url" />
      </template>
    </Uploader>
    <ValidateForm @form-submit="onFormSubmit">
      <ValidateInput :rules="nameRule" v-model="currentData.name" />
      <ValidateInput
        :rules="descriptionRule"
        v-model="currentData.description"
        tag="textarea"
        rows="6"
      />
      <template #submit>
        <button class="btn btn-primary btn-large mb-3">提交修改</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
import { useStore } from 'vuex'
import { ColumnProps, ImageProps, ResponseType, UserProps } from '@/store'
import { beforeUploadCheck } from '@/utils/helper'
import { useRouter } from 'vue-router'

type EditMode = 'user' | 'column'
export default defineComponent({
  name: 'UserDetail',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentUser = computed(() => store.state.user)
    const currentColumn = computed(() =>
      store.getters.getColumnById(currentUser.value.column)
    )
    const editMode = ref<EditMode>('user')
    const currentData = computed(() => ({
      name:
        editMode.value === 'user'
          ? currentUser.value.nickName
          : currentColumn.value.title,
      description:
        editMode.value === 'user'
          ? currentUser.value.description
          : currentColumn.value.description
    }))
    const uploadData = computed(() => {
      if (editMode.value === 'user') {
        return currentUser.value.avatar
      } else {
        return {
          ...currentColumn.value.avatar,
          url: currentColumn.value.avatar.url.replace(/\?([\w,-=/]*)/, '')
        }
      }
    })

    const nameRule: RulesProp = [{ type: 'required', message: '昵称不能为空' }]
    const descriptionRule: RulesProp = [
      { type: 'required', message: '简介不能为空' }
    ]
    let imageId = ''

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      imageId = rawData.data._id || ''
      createMessage(`上传图片ID ${rawData.data._id} 成功`, 'success')
    }
    const onFileUploadError = () => {
      createMessage('上传图片失败', 'error')
    }

    onMounted(() => {
      store.dispatch('fetchColumn', currentUser.value.column)
    })
    const onFormSubmit = (valid: boolean) => {
      if (valid) {
        const sendData: { [key: string]: any } = {
          description: currentData.value.description
        }
        let actionName = ''
        if (editMode.value === 'user') {
          sendData.nickName = currentData.value.name
          sendData._id = currentUser.value._id
          actionName = 'updateUser'
        } else {
          sendData.title = currentData.value.name
          sendData._id = currentColumn.value._id
          actionName = 'updateColumn'
        }
        if (imageId) {
          sendData.avatar = imageId
        }
        store.dispatch(actionName, sendData).then(() => {
          createMessage('修改成功,2s后跳转到首页', 'success', 2000)
          setTimeout(() => {
            router.push({ name: 'home' })
          }, 2000)
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/png', 'image/jpeg'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片格式必须为jpg或者png', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
      }
      return passed
    }

    return {
      uploadData,
      currentData,
      nameRule,
      descriptionRule,
      editMode,
      onFormSubmit,
      handleFileUploaded,
      onFileUploadError,
      uploadCheck
    }
  }
})
</script>

<style>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.circle {
  width: 200px;
  height: 200px;
  border-radius: 200px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #efefef;
}
</style>
