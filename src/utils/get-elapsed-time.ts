export function getElapsedTime(startedTime: number | Date) {
  return new Date(new Date().getTime() - new Date(startedTime).getTime());
}
