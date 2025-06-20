import { inject, injectable } from 'tsyringe';
import { CorralRepository } from '../../domain/ports/corral.repository';
import { CreateCorralDto } from '../dtos/create-corral.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { Application } from '../../../../utils/http-error';
import { Corral } from '../../domain/entities/corral.entity';
import { AllPigByIdsUseCase } from '../../../pig/application/use-cases/all-pig-by-ids.usecase';
import { Pig } from '../../../pig/domain/entities/pig.entity';

@injectable()
export class CreateCorralUseCase {
  constructor(
    @inject('CorralRepository')
    private readonly corralRepository: CorralRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
    @inject('AllPigByIdsUseCase')
    private readonly allPigByIdsUseCase: AllPigByIdsUseCase,
  ) {}

  async execute(userId: string, dto: CreateCorralDto) {
    const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
    if (!farm) throw Application.notFound('Granja de usuario no encontrada.');

    const corral = await this.corralRepository.getByName(dto.name, userId);
    if (corral) {
      throw Application.notFound('Ya existe un corral con el mismo nombre.');
    }

    let pigs: Pig[] = [];
    if (dto.pigs && dto.pigs.length > 0) {
      pigs = await this.allPigByIdsUseCase.execute(dto.pigs, farm.id);

      const pigIds = dto.pigs.map((p) => p.id);
      const foundIds = pigs.map((pig) => pig.id);
      
      const missingIds = pigIds.filter((id) => !foundIds.includes(id));

      if (missingIds.length > 0) {
        throw Application.notFound(
          `Los siguientes cerdos no fueron encontrados: ${missingIds.join(', ')}`,
        );
      }
    }

    const newCorral = Corral.create({
      name: dto.name,
      farm: farm,
      pigs: pigs,
    });

    await this.corralRepository.save(newCorral);
    return newCorral;
  }
}
