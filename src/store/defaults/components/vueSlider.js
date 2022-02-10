export default function ({
  min = 0,
  max = 100,
  initial = 0,
  interval = 1
} = {}) {
  return {
    min,
    max,
    initial,
    interval
  }
}
