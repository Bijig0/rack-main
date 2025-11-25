export const getCategoryBgColor = (index: number) => {
  if (index % 2 === 0) {
    return 'bg-green-light'
  }

  if (index % 3 === 0) {
    return 'bg-blue-light'
  }

  return 'bg-blue-light'
}
