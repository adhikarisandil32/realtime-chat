export function dateParse(providedDate: string | number) {
  const date = new Date(providedDate);

  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} at ${date.getHours()}:${date.getMinutes()}`;
}
