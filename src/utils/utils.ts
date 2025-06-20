export class Util {
  static now(): Date {
    // const localDate = new Date();
    // const offset = localDate.getTimezoneOffset() * 60000;
    // return new Date(localDate.getTime() - offset);
    return new Date();
  }

  static currentDate(): string {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static differenceInDays(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
