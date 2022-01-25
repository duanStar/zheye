<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      href="#"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click.prevent="toggleOpen"
    >
      {{ title }}
    </a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, Ref } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const dropdownRef: Ref<HTMLElement | null> = ref(null)
    const isClickOutside = useClickOutside(dropdownRef)
    const route = useRoute()
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    watch(isClickOutside, () => {
      if (isClickOutside.value && isOpen.value) {
        isOpen.value = false
      }
    })
    watch(route, () => {
      isOpen.value = false
    })
    return {
      isOpen,
      dropdownRef,
      toggleOpen
    }
  }
})
</script>

<style scoped></style>
