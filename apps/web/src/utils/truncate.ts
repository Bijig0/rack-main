export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - 3) + '...'
}

// Example usage:
const originalString = 'This is a very long string that needs to be truncated.'
const truncatedString = truncate(originalString, 20)
console.log(truncatedString) // Output: "This is a very lo..."
