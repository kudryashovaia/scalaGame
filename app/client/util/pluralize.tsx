export function pluralize(n: number, count1: string, count2: string, count5: string): string {
  if (((n % 100) >= 11 && (n % 100) <= 19)) {
    return n + " " + count5;
  } else if ((n % 10) == 1) {
    return n + " " + count1;
  } if ((n % 10) >= 2 && (n % 10) <= 4) {
    return n + " " + count2;
  } else {
    return n + " " + count5;
  }
}
