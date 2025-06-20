import { PigState } from '../../../../utils/pig.enum';
import { Regex } from '../../../../utils/regex';

export class UpdatePigDto {
  private constructor(
    public readonly farmId?: string,
    public readonly breedId?: string,
    public readonly phaseId?: string,
    public readonly earTag?: string,
    public readonly birthDate?: string,
    public readonly gender?: string,
    public readonly type?: string,
    public readonly initialPrice?: number,
    public readonly state?: string,
    public readonly motherId?: string,
    public readonly fatherId?: string,
    public readonly weights?: {
      id?: string;
      days?: number;
      weight?: number;
    }[],
    public readonly pigProduct?: {
      id?: string;
      productId?: string;
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

  static create(body: { [key: string]: any }): [string?, UpdatePigDto?] {
    const {
      farmId,
      breedId,
      phaseId,
      earTag,
      birthDate,
      gender,
      type,
      initialPrice,
      state,
      motherId,
      fatherId,
      weights,
      pigProduct,
      sowReproductiveCycle,
    } = body;

    if (farmId && !Regex.isValidUUID(farmId)) {
      return ['farmId: Id granja inválido.'];
    }
    if (breedId && !Regex.isValidUUID(breedId)) {
      return ['breedId: Id raza inválido.'];
    }
    if (phaseId && !Regex.isValidUUID(phaseId)) {
      return ['phaseId: Id fase inválido.'];
    }
    if (earTag && !Regex.isValidTagNumber(earTag)) {
      return ['earTag: Número etiqueta inválido.'];
    }
    if (birthDate && !Regex.isoDate.test(birthDate)) {
      return ['birthDate: Fecha nacimiento inválida.'];
    }
    if (gender && !['Macho', 'Hembra'].includes(gender)) {
      return ['gender: Sexo del cerdo inválido.'];
    }
    if (type && !['Reproducción', 'Producción'].includes(type)) {
      return ['type: Tipo de cerdo inválido.'];
    }
    if (
      initialPrice !== undefined &&
      (typeof initialPrice !== 'number' || initialPrice < 0)
    ) {
      return ['initialPrice: Precio inicial inválido.'];
    }

    if (
      state &&
      ![PigState.Alive, PigState.Dead, PigState.Sold].includes(state)
    ) {
      return ['state: Estado inválido.'];
    }

    if (motherId && !Regex.isValidUUID(motherId)) {
      return ['motherId: ID cerda inválido.'];
    }
    if (fatherId && !Regex.isValidUUID(fatherId)) {
      return ['fatherId: ID cerdo inválido.'];
    }

    if (weights) {
      if (!Array.isArray(weights)) {
        return ['weights: Debe ser un array de objetos {id?, days, weight}'];
      }

      for (const weight of weights) {
        if (
          weight.days === undefined ||
          typeof weight.days !== 'number' ||
          weight.days < 0 ||
          !Number.isInteger(weight.days)
        ) {
          return ["weights: 'days' es requerido y debe ser un entero positivo"];
        }

        if (
          weight.weight === undefined ||
          typeof weight.weight !== 'number' ||
          weight.weight <= 0
        ) {
          return [
            "weights: 'weight' es requerido y debe ser un número mayor que cero",
          ];
        }
      }
    }

    if (body.pigProduct) {
      if (!Array.isArray(body.pigProduct)) {
        return [
          'pigProduct: Debe ser un array de objetos {id?, productId, quantity, price, date, observation?}',
        ];
      }

      for (const product of body.pigProduct) {
        if (!product.productId || !Regex.isValidUUID(product.productId)) {
          return ['productId: ID inválido o faltante.'];
        }
        if (
          product.quantity === undefined ||
          typeof product.quantity !== 'number' ||
          product.quantity <= 0
        ) {
          return ['quantity: Cantidad inválida o faltante.'];
        }
        if (
          product.price === undefined ||
          typeof product.price !== 'number' ||
          product.price <= 0
        ) {
          return ['price: Precio inválido o faltante.'];
        }
        if (!product.date || !Regex.isoDate.test(product.date)) {
          return ['date: Fecha inválida o faltante.'];
        }
      }
    }

    if (sowReproductiveCycle) {
      if (!Array.isArray(sowReproductiveCycle)) {
        return ['sowReproductiveCycle: Debe ser un array válido.'];
      }

      for (let i = 0; i < sowReproductiveCycle.length; i++) {
        const entry = sowReproductiveCycle[i];
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
            return [`${prefix}.birth.liveMales: Número machos inválido.`];
          }

          if (typeof liveFemales !== 'number' || liveFemales < 0) {
            return [`${prefix}.birth.liveFemales: Número hembras inválido.`];
          }

          if (typeof totalDead !== 'number' || totalDead < 0) {
            return [`${prefix}.birth.totalDead: Número muertos inválido.`];
          }

          if (typeof avgWeight !== 'number' || avgWeight < 0) {
            return [`${prefix}.birth.avgWeight: Peso promedio inválido.`];
          }
        }
      }
    }

    return [
      undefined,
      new UpdatePigDto(
        farmId,
        breedId,
        phaseId,
        earTag,
        birthDate,
        gender,
        type,
        initialPrice,
        state,
        motherId,
        fatherId,
        weights,
        pigProduct,
        sowReproductiveCycle,
      ),
    ];
  }
}
