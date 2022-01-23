import { ref, onMounted, onUnmounted, Ref } from 'vue'

const useClickOutside: (elementRef: Ref<null | HTMLElement>) => Ref<boolean> = (elementRef: Ref<null | HTMLElement>) => {
  const isCLickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        isCLickOutside.value = true
      } else {
        isCLickOutside.value = false
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isCLickOutside
}

export default useClickOutside
