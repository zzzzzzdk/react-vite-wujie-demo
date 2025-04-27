import { ItemMenu } from "@/store/slices/user"

export default function findHomePath(menu: ItemMenu[]) {
  let path: string = ''

  function findPath(data: ItemMenu) {
    if (data.children && data.children.length) {
      for (let i = 0; i < data.children.length; i++) {
        const result = findPath(data.children[i])
        if (!result) {
          break
        }
      }
      return false
    }
    if (!data.children && data.path) {
      path = data.path
      return false
    }
    return true
  }
  for (let i = 0; i < menu.length; i++) {
    const result = findPath(menu[i])
    if (!result) {
      break
    }
  }

  return path
}


