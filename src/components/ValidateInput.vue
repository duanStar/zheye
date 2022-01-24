<template>
  <div class="validate-input-container pb-3">
    <label class="form-label" :for="`${label || ''}${Date.now()}`">{{
      label || ''
    }}</label>
    <input
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      :id="`${label || ''}${Date.now()}`"
      @input="updateVal"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <div
      id="validationServerUsernameFeedback"
      class="invalid-feedback"
      v-if="inputRef.error"
    >
      {{ inputRef.message }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  watchEffect
} from 'vue'
import { emitter } from '@/components/ValidateForm.vue'
export interface RuleProp {
  type: 'required' | 'email'
  message: string
}
export type RulesProp = RuleProp[]
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    label: String
  },
  inheritAttrs: false,
  setup(props, { emit }) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    watchEffect(() => {
      inputRef.val = props.modelValue || ''
    })
    const updateVal = (e: KeyboardEvent) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      emit('update:modelValue', targetValue)
    }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput,
      updateVal
    }
  }
})
</script>
