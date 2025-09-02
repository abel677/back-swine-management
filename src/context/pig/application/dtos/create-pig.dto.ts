import { Regex } from '../../../../utils/regex';

export class CreatePigDto {
  private constructor(
    public readonly farmId: string,
    public readonly breedId: string,
    public readonly phaseId: string,
    public readonly earTag: string,
    public readonly birthDate: string,
    public readonly gender: string,
    public readonly type: string,
    public readonly initialPrice: number,
    public readonly motherId?: string,
    public readonly fatherId?: string,
    public readonly pigProduct?: {
      id?: string;
      product?: {
        id?: string;
        name: string;
        category: {
          id?: string;
          name: string;
        };
        price: number;
        unitMeasurement: string;
        description?: string;
      };
      quantity?: number;
      price?: number;
      date?: string;
      observation?: string;
    }[],
    public readonly sowReproductiveCycle?: {
      reproductiveStageId: string;
      startDate: string;
      boarId?: string;
      birth?: {
        date: string;
        liveMales: number;
        liveFemales: number;
        totalDead: number;
        avgWeight: number;
        description?: string;
      };
    }[],
  ) {}
  static create(body: { [key: string]: any }): [string?, CreatePigDto?] {
    const farmId = body?.farmId;
    const breedId = body?.breedId;
    const phaseId = body?.phaseId;
    const earTag = body?.earTag;
    const birthDate = body?.birthDate;
    const gender = body?.gender;
    const type = body?.type;
    const initialPrice = body?.initialPrice;
    const motherId = body?.motherId;
    const fatherId = body?.fatherId;
    const sowReproductiveCycle = body?.sowReproductiveCycle;
    const pigProduct = body?.pigProduct;

    if (!farmId || !Regex.isValidUUID(farmId)) {
      return ['farmId: Id granja inválido.'];
    }
    if (!breedId || !Regex.isValidUUID(breedId)) {
      return ['breedId: Id raza inválido.'];
    }
    if (!phaseId || !Regex.isValidUUID(phaseId)) {
      return ['phaseId: Id fase inválido.'];
    }
    if (!earTag || !Regex.isValidTagNumber(earTag)) {
      return ['earTag: Número etiqueta inválido.'];
    }
    if (!birthDate || !Regex.isoDate.test(birthDate)) {
      return ['birthDate: Fecha nacimiento inválida.'];
    }
    if (!gender || !['Macho', 'Hembra'].includes(gender)) {
      return ['gender: Sexo del cerdo inválido.'];
    }
    if (!type || !['Reproducción', 'Producción'].includes(type)) {
      return ['type: Tipo de cerdo inválido.'];
    }
    if (typeof initialPrice !== 'number' || initialPrice < 0) {
      return ['initialPrice: Precio inicial inválido.'];
    }
    if (motherId && !Regex.isValidUUID(motherId)) {
      return ['motherId: ID cerda inválido.'];
    }
    if (fatherId && !Regex.isValidUUID(fatherId)) {
      return ['fatherId: ID cerdo inválido.'];
    }

    if (pigProduct) {
      if (!Array.isArray(pigProduct)) {
        return ['pigProduct: Debe ser un array de productos.'];
      }

      for (let i = 0; i < pigProduct.length; i++) {
        const entry = pigProduct[i];
        const prefix = `pigProduct[${i}]`;

        if (entry.id && !Regex.isValidUUID(entry.id)) {
          return [`${prefix}.id: ID inválido.`];
        }

        if (!entry.product || typeof entry.product !== 'object') {
          return [`${prefix}.product: Objeto producto requerido.`];
        } else {
          const { id, name, category, price, unitMeasurement } = entry.product;

          if (id) {
            if (!Regex.isValidUUID(id)) {
              return [`${prefix}.product.id: ID de producto inválido.`];
            }
          } else {
            if (!name || typeof name !== 'string') {
              return [`${prefix}.product.name: Nombre del producto requerido.`];
            }

            if (typeof price !== 'number' || price < 0) {
              return [`${prefix}.product.price: Precio inválido.`];
            }

            if (!unitMeasurement || typeof unitMeasurement !== 'string') {
              return [
                `${prefix}.product.unitMeasurement: Unidad de medida del producto requerido.`,
              ];
            }

            if (!category || typeof category !== 'object') {
              return [`${prefix}.product.category: Categoría requerida.`];
            }

            if (category.id) {
              if (!Regex.isValidUUID(category.id)) {
                return [
                  `${prefix}.product.category.id: ID de categoría inválido.`,
                ];
              }
            } else {
              if (!category.name || typeof category.name !== 'string') {
                return [
                  `${prefix}.product.category.name: Nombre de categoría requerido.`,
                ];
              }
            }
          }
        }

        if (
          entry.quantity !== undefined &&
          (typeof entry.quantity !== 'number' || entry.quantity <= 0)
        ) {
          return [`${prefix}.quantity: Cantidad inválida.`];
        }

        if (
          entry.price !== undefined &&
          (typeof entry.price !== 'number' || entry.price < 0)
        ) {
          return [`${prefix}.price: Precio inválido.`];
        }

        if (entry.date && !Regex.isoDate.test(entry.date)) {
          return [`${prefix}.date: Fecha inválida.`];
        }

        if (
          entry.observation !== undefined &&
          typeof entry.observation !== 'string'
        ) {
          return [`${prefix}.observation: Observación inválida.`];
        }
      }
    }

    if (sowReproductiveCycle) {
      // Validaciones del historial reproductivo
      if (body.sowReproductiveCycle) {
        if (!Array.isArray(body.sowReproductiveCycle)) {
          return ['sowReproductiveCycle: Debe ser un array válido.'];
        }

        for (let i = 0; i < body.sowReproductiveCycle.length; i++) {
          const entry = body.sowReproductiveCycle[i];
          const prefix = `sowReproductiveCycle[${i}]`;

          if (
            !entry.reproductiveStageId ||
            !Regex.isValidUUID(entry.reproductiveStageId)
          ) {
            return [
              `${prefix}.reproductiveStageId: ID etapa reproductiva inválida.`,
            ];
          }

          if (!Regex.isoDate.test(entry.startDate)) {
            return [`${prefix}.startDate: Fecha inválida o faltante.`];
          }

          if (entry.boarId && !Regex.isValidUUID(entry.boarId)) {
            return [`${prefix}.boarId: ID cerdo reproductor inválido.`];
          }

          if (entry.birth) {
            const { date, liveMales, liveFemales, totalDead, avgWeight } =
              entry.birth;

            if (!Regex.isoDate.test(date)) {
              return [`${prefix}.birth.date: Fecha inválida.`];
            }

            if (typeof liveMales !== 'number' || liveMales < 0) {
              return [
                `${prefix}.birth.liveMales: Número lechones machos inválido.`,
              ];
            }

            if (typeof liveFemales !== 'number' || liveFemales < 0) {
              return [
                `${prefix}.birth.liveFemales: Número lechones hembras inválido.`,
              ];
            }

            if (typeof totalDead !== 'number' || totalDead < 0) {
              return [
                `${prefix}.birth.totalDead: Número total vivos inválido.`,
              ];
            }

            if (typeof avgWeight !== 'number' || avgWeight < 0) {
              return [`${prefix}.birth.avgWeight: Peso inválido.`];
            }
          }
        }
      }
    }

    return [
      undefined,
      new CreatePigDto(
        farmId,
        breedId,
        phaseId,
        earTag,
        birthDate,
        gender,
        type,
        initialPrice,
        motherId,
        fatherId,
        pigProduct,
        sowReproductiveCycle,
      ),
    ];
  }
}
