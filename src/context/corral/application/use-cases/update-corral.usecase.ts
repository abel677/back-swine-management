import { inject, injectable } from 'tsyringe';
import { CorralRepository } from '../../domain/ports/corral.repository';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { Application } from '../../../../utils/http-error';
import { UpdateCorralDto } from '../dtos/update-corral.dto';
import { Pig } from '../../../pig/domain/entities/pig.entity';
import { AllPigByIdsUseCase } from '../../../pig/application/use-cases/all-pig-by-ids.usecase';

@injectable()
export class UpdateCorralUseCase {
  constructor(
    @inject('CorralRepository')
    private readonly corralRepository: CorralRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
    @inject('AllPigByIdsUseCase')
    private readonly allPigByIdsUseCase: AllPigByIdsUseCase,
  ) {}

  async execute(id: string, userId: string, dto: UpdateCorralDto) {
    const corral = await this.corralRepository.getById(id, userId);
    if (!corral) throw Application.notFound('Corral no encontrado.');

    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) throw Application.notFound('Granja de usuario no encontrada.');
      corral.saveFarm(farm);
    }

    if (dto.name) {
      const already = await this.corralRepository.getByName(dto.name, userId);
      if (already && already.id !== corral.id)
        throw Application.notFound('Ya existe un corral con el mismo nombre.');
      corral.saveName(dto.name);
    }

    let pigs: Pig[] = [];
    if (dto.pigs && dto.pigs.length > 0) {
      pigs = await this.allPigByIdsUseCase.execute(dto.pigs, corral.farm.id);

      const pigIds = dto.pigs.map((p) => p.id);
      const foundIds = pigs.map((pig) => pig.id);

      const missingIds = pigIds.filter((id) => !foundIds.includes(id));

      if (missingIds.length > 0) {
        throw Application.notFound(
          `Los siguientes cerdos no fueron encontrados: ${missingIds.join(', ')}`,
        );
      }
    }
    corral.savePigs(pigs);
    await this.corralRepository.save(corral);
    return corral;
  }
}
