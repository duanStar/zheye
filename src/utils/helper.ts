import { UserProps } from './../store'
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck(file: File, condition: CheckCondition): {error: ErrorType, passed: boolean} {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    error,
    passed: isValidSize && isValidFormat
  }
}

export const arrToObj: <T extends { _id?: string }>(arr: Array<T>) => { [key: string]: T; } = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArr: <T>(obj: {[key: string]: T}) => T[] = <T>(obj: {[key: string]: T}) => {
  return Object.keys(obj).map(key => obj[key])
}

export const addColumnAvatar: (data: UserProps, width: number, height: number) => void = (data: UserProps, width: number, height: number) => {
  if (data.avatar) {
    data.avatar.url = data.avatar.url + `?x-oss-process=image/resize,m_fill,h_${height},w_${width}`
  } else {
    data.avatar = {
      url: require('@/assets/avatar.jpg')
    }
  }
  return data.avatar
}
