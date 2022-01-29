<template>
  <div class="validate-input-container pb-3">
    <label
      class="form-label"
      v-if="label"
      :for="`${label || ''}${Date.now()}`"
      >{{ label || '' }}</label
    >
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind="$attrs"
    ></textarea>
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
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue'
import { emitter } from '@/components/ValidateForm.vue'
export interface RuleProp {
  type: 'required' | 'email' | 'custom'
  message: string
  validator?: () => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'email' | 'textarea'
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/
export default defineComponent({
  name: 'ValidateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    label: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup(props, { emit }) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: (val) => {
          emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
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
            case 'custom':
              passed = rule.validator ? rule.validator() : true
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
      validateInput
    }
  }
})
</script>
