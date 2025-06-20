export class HttpError extends Error {
  constructor(
    public message: string,
    public status: number = 400,
    public errors?: any,
  ) {
    super(message);
  }
}

export class Application extends Error {
  public status: number;
  public errors?: any;

  private constructor(message: string, status: number, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, Application.prototype);
  }

  static badRequest(message: string = 'Bad Request', errors?: any) {
    return new Application(message, 400, errors);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new Application(message, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new Application(message, 403);
  }

  static notFound(message: string = 'Not Found') {
    return new Application(message, 404);
  }

  static internal(message: string = 'Internal Server Error') {
    return new Application(message, 500);
  }
  
}
