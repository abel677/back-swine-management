interface NotificationProps {
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  sentAt: Date | null;
  eventType: string;
  metadata: string;
}

export class Notification {
  private constructor(
    public readonly id: string,
    private readonly props: NotificationProps,
  ) {}

  static create(props: Omit<NotificationProps, 'read' | 'sentAt'>) {
    const id = crypto.randomUUID();

    return new Notification(id, {
      ...props,
      read: false,
      sentAt: null,
    });
  }

  saveRead(read: boolean) {
    this.props.read = read;
  }

  saveSentAt(sentAt: Date) {
    this.props.sentAt = sentAt;
  }

  get sentAt() {
    return this.props.sentAt;
  }
  get title(): string {
    return this.props.title;
  }
  get message(): string {
    return this.props.message;
  }
  get userId(): string {
    return this.props.userId;
  }

  get read(): boolean {
    return this.props.read;
  }
  get metadata(): string {
    return this.props.metadata;
  }
  get eventType(): string {
    return this.props.eventType;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static fromPersistence(props: { id: string } & NotificationProps) {
    return new Notification(props.id, props);
  }
}
