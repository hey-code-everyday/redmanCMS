export default function ({
  min = 0,
  max = 100,
  initialStart = 0,
  initialEnd = 100,
  interval = 1
} = {}) {
  return {
    min,
    max,
    initialStart,
    initialEnd,
    interval
  }
}
