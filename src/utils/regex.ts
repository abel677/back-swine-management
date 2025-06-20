export class Regex {
  static get isoDate() {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?$/;
  }
  static isValidTagNumber(value: string): boolean {
    return /^[A-Za-z0-9-]+$/.test(value);
  }

  static isValidUUID(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  static password(): RegExp {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
  }

  static email(): RegExp {
    return /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"[^\n\r"]+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  }
}
