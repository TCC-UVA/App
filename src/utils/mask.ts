export class Mask {
  static date(value: string, previousValue?: string): string {
    const numbers = value.replace(/\D/g, "");

    // If user is deleting and the new length is less than previous
    const isDeleting = previousValue && value.length < previousValue.length;

    // If deleting and we're at a slash position, remove the number before the slash
    if (isDeleting) {
      const prevNumbers = previousValue.replace(/\D/g, "");
      const currentNumbers = numbers;

      // If they deleted a slash, also remove the preceding number
      if (prevNumbers.length === currentNumbers.length) {
        const shortenedNumbers = currentNumbers.slice(0, -1);
        return Mask.formatDate(shortenedNumbers);
      }
    }

    return Mask.formatDate(numbers);
  }

  private static formatDate(numbers: string): string {
    let formatted = numbers;

    if (numbers.length >= 2) {
      formatted = numbers.slice(0, 2) + "/" + numbers.slice(2);
    }

    if (numbers.length >= 4) {
      formatted =
        numbers.slice(0, 2) +
        "/" +
        numbers.slice(2, 4) +
        "/" +
        numbers.slice(4, 8);
    }

    return formatted;
  }

  static remove(value: string): string {
    return value.replace(/\D/g, "");
  }
}
