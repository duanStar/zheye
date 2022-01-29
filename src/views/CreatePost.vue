<template>
  <div class="create-post-page container">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <Uploader
      action="/api/upload"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      @file-uploaded="handleFileUploaded"
      @file-upload-error="onFileUploadError"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex align-items-center">
          <div class="spinner-border text-secondary" role="status"></div>
          <h2 style="margin-bottom: 0.2rem">正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData.url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large mb-3">
          {{ isEditMode ? '更新文章' : '发表文章' }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'
import createMessage from '@/components/createMessage'
import store, { ImageProps, PostProps, ResponseType } from '@/store'
import { beforeUploadCheck } from '@/utils/helper'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const uploadedData = ref()
    const titleVal = ref('')
    const route = useRoute()
    const router = useRouter()
    const isEditMode = !!route.query.id
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    let imageId = ''
    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch('fetchPost', route.query.id)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData
            if (currentPost.data.image) {
              uploadedData.value = currentPost.data.image
            }
            titleVal.value = currentPost.data.title
            contentVal.value = currentPost.data.content || ''
          })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      imageId = rawData.data._id || ''
      createMessage(`上传图片ID ${rawData.data._id} 成功`, 'success')
    }
    const onFileUploadError = () => {
      createMessage('上传图片失败', 'error')
    }
    /* eslint-disable */
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode
            ? {
                id: route.query.id,
                payload: newPost
              }
            : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功,2s后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
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
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      isEditMode,
      uploadCheck,
      handleFileUploaded,
      onFileUploadError,
      uploadedData
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
