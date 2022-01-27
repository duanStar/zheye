import { onUnmounted } from 'vue'
const useDOMCreate: (id: string) => void = (id: string) => {
  const node = document.createElement('div')
  node.id = id
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
