export function getFieldCaption(description: string, value: string) {
  if (!description) return value;

  return description.split("\n")[0] ?? value;
}
