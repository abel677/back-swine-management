interface RolProps {
  id: string;
  name: string;
}
interface CreateRol extends Omit<RolProps, 'id'> {}

export class Rol {
  private constructor(private readonly props: RolProps) {}

  updateName(name: string) {
    this.props.name = name;
  }

  static create(rol: CreateRol) {
    const id = crypto.randomUUID();
    return new Rol({
      id: id,
      name: rol.name,
    });
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }

  static toDomain(rol: { [key: string]: any }) {
    return new Rol({
      id: rol.id,
      name: rol.name,
    });
  }
}
