import { container } from 'tsyringe';
import { UserRepository } from '../context/user/domain/ports/user-repository';
import { AllUserUseCase } from '../context/user/application/use-cases/all-user.usecase';
import { HashService } from '../context/common/domain/ports/hash-service.port';
import { BcryptHashService } from '../context/common/infrastructure/adapters/bcrypt.service';

import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../context/user/infrastructure/adapters/repositories/prisma-user.repository';
import { PrismaRolRepository } from '../context/rol/infrastructure/adapters/prisma-rol.repository';
import { RolRepository } from '../context/rol/domain/ports/rol.repository';
import { ByIdsRolUseCase } from '../context/rol/application/use-cases/by-ids-rol.usecase';
import { DeleteManyUserUseCase } from '../context/user/application/use-cases/delete-many-user.usecase';
import { AllRolUseCase } from '../context/rol/application/use-cases/all-rol.usecase';
import { TokenService } from '../context/auth/domain/ports/token.service';
import { JwtTokenService } from '../context/auth/infrastructure/adapters/jsonwebtoken.service';
import { SignInUseCase } from '../context/auth/application/use-cases/sign-in.usecase';
import { GetProfileUseCase } from '../context/user/application/use-cases/get-profile.usecase';
import { MailService } from '../context/common/domain/ports/mail-service.port';
import { MailtrapService } from '../context/common/infrastructure/adapters/mailtrap.service';
import { ByNamesRolUseCase } from '../context/rol/application/use-cases/by-names-rol.usecase';
import { FarmRepository } from '../context/farm/domain/ports/farm.repository';
import { PrismaFarmRepository } from '../context/farm/infrastructure/adapters/repositories/farm.repository';
import { CreateFarmUseCase } from '../context/farm/application/use-cases/create-farm.usecase';
import { SignUpUseCase } from '../context/auth/application/use-cases/sign-up.usecase';
import { CreateUserUseCase } from '../context/user/application/use-cases/create-user.usecase';
import { AllFarmUseCase } from '../context/farm/application/use-cases/all-farm.usecase';

import { PigRepository } from '../context/pig/domain/ports/pig.repository';
import { PrismaPigRepository } from '../context/pig/infrastructure/adapters/repositories/prisma-pig.repository';
import { GetFarmByIdUseCase } from '../context/farm/application/use-cases/get-farm-by-id.usecase';
import { BreedRepository } from '../context/breed/domain/ports/breed-repository.port';
import { PrismaBreedRepository } from '../context/breed/infrastructure/adapters/repositories/prisma-breed.repository';
import { GetBreedByIdUseCase } from '../context/breed/application/use-cases/get-breed-by-id.usecase';
import { SettingRepository } from '../context/farm/domain/ports/setting.repository';
import { PrismaSettingRepository } from '../context/farm/infrastructure/adapters/repositories/prisma-setting.repository';
import { CreateBreedUseCase } from '../context/breed/application/use-cases/create-breed.usecase';
import { PrismaPhaseRepository } from '../context/farm/infrastructure/adapters/repositories/prisma-phase.repository';
import { PhaseRepository } from '../context/farm/domain/ports/phase.repository';
import { PrismaReproductiveStageRepository } from '../context/farm/infrastructure/adapters/repositories/prisma-reproductive-stage.repository';
import { ReproductiveStageRepository } from '../context/farm/domain/ports/reproductive-stage.repository';
import { VerifyUseCase } from '../context/auth/application/use-cases/verify.usecase';
import { CreateUserProviderUseCase } from '../context/user/application/use-cases/create-user-provider.usecase';
import { GetUserByEmailUseCase } from '../context/user/application/use-cases/get-user-by-email.usecase';
import { GetPhaseByIdUseCase } from '../context/farm/application/use-cases/phases/get-phase-by-id.usecase';
import { PigReproductiveCalculatorUseCase } from '../context/pig/application/use-cases/pig-reproductive-calculator.usecase';
import { GetBreedByNameUseCase } from '../context/breed/application/use-cases/get-breed-by-name.usecase';
import { GetPhaseByNameUseCase } from '../context/farm/application/use-cases/phases/get-phase-by-name.usecase';
import { GetSettingByFarmIdUseCase } from '../context/farm/application/use-cases/settings/get-settings-by-farm-id.usecase';
import { AllSettingUseCase } from '../context/farm/application/use-cases/settings/all-settings.usecase';
import { AllReproductiveStageUseCase } from '../context/farm/application/use-cases/reproductive-stage/all-reproductive-stage.usecase';
import { GetReproductiveStageByIdUseCase } from '../context/farm/application/use-cases/reproductive-stage/get-reproductive-by-id.usecase';
import { AllPhaseUseCase } from '../context/farm/application/use-cases/phases/all-phase-by.usecase';
import { AllBreedUseCase } from '../context/breed/application/use-cases/all-breed.usecase';
import { AllPigUseCase } from '../context/pig/application/use-cases/all-pig.usecase';
import { UpdatePigUseCase } from '../context/pig/application/use-cases/update-pig.usecase';
import { CreatePigUseCase } from '../context/pig/application/use-cases/create-pig.usecase';
import { NotificationRepository } from '../context/notifications/domain/ports/notification.repository';
import { PrismaNotificationRepository } from '../context/notifications/infrastructure/prisma-notification.repository';
import { CreateSowNotificationsUseCase } from '../context/notifications/application/use-cases/create-sow-notification.usecase';
import { DeleteSowNotificationUseCase } from '../context/notifications/application/use-cases/delete-sow-notification.usecase';
import { CategoryRepository } from '../context/category/domain/ports/category.repository';
import { PrismaCategoryRepository } from '../context/category/infrastructure/adapters/repositories/prisma-category.repository';
import { ProductRepository } from '../context/product/domain/ports/product.repository';
import { PrismaProductRepository } from '../context/product/infrastructure/adapters/repositories/prisma-product.repository';
import { CreateProductUseCase } from '../context/product/application/use-cases/create-product.usecase';
import { UpdateProductUseCase } from '../context/product/application/use-cases/update-product.usecase';
import { GetCategoryByIdUseCase } from '../context/category/application/use-cases/get-category-by-id.usecase';
import { UpdateSettingUseCase } from '../context/farm/application/use-cases/settings/update-settings.usecase';
import { UpdateBreedUseCase } from '../context/breed/application/use-cases/update-breed.usecase';
import { AllCategoryUseCase } from '../context/category/application/use-cases/all-category.usecase';
import { CreateCategoryUseCase } from '../context/category/application/use-cases/create-category.usecase';
import { UpdateCategoryUseCase } from '../context/category/application/use-cases/update-category.usecase';
import { GetProductByIdUseCase } from '../context/product/application/use-cases/get-product-by-id.usecase';
import { CorralRepository } from '../context/corral/domain/ports/corral.repository';
import { PrismaCorralRepository } from '../context/corral/infrastructure/persistence/prisma-corral.repository';
import { CreateCorralUseCase } from '../context/corral/application/use-cases/create-corral.usecase';
import { UpdateCorralUseCase } from '../context/corral/application/use-cases/update-corral.usecase';
import { AllCorralUseCase } from '../context/corral/application/use-cases/all-corral.usecase';
import { DeviceRepository } from '../context/device/domain/ports/device.repository';
import { PrismaDeviceRepository } from '../context/device/infrastructure/repositories/prisma-device.repository';
import { CreateDeviceUseCase } from '../context/device/application/use-cases/create-device.usecase';
import { AllDevicesUseCase } from '../context/device/application/use-cases/all-devices.usecase';
import { SendDailyNotificationsUseCase } from '../context/notifications/application/use-cases/send-daily-notification.usecase';
import { NotificationSender } from '../context/notifications/domain/ports/notification-sender.port';
import { FirebaseNotificationAdapter } from '../context/notifications/infrastructure/firebase-notification.adapter';
import { AllNotificationUseCase } from '../context/notifications/application/use-cases/all-notification.usecase';
import { AllPigByIdsUseCase } from '../context/pig/application/use-cases/all-pig-by-ids.usecase';
import { GetProductByNameUseCase } from '../context/product/application/use-cases/get-product-by-name.usecase';
import { GetCategoryByNameUseCase } from '../context/category/application/use-cases/get-category-by-name.usecase';
import { DeletePigUseCase } from '../context/pig/application/use-cases/delete-pig.usecase';

export function configureContainer(prismaClient: PrismaClient) {
  container.registerInstance('PrismaClient', prismaClient);

  // todo: Servicios
  container.registerSingleton<HashService>('HashService', BcryptHashService);
  container.registerSingleton<TokenService>('TokenService', JwtTokenService);
  container.registerSingleton<MailService>('MailService', MailtrapService);
  container.registerSingleton<NotificationSender>(
    'NotificationSender',
    FirebaseNotificationAdapter,
  );

  // todo: Repositorios
  container.registerSingleton<RolRepository>(
    'RolRepository',
    PrismaRolRepository,
  );
  container.registerSingleton<UserRepository>(
    'UserRepository',
    PrismaUserRepository,
  );
  container.registerSingleton<SettingRepository>(
    'SettingRepository',
    PrismaSettingRepository,
  );
  container.registerSingleton<PhaseRepository>(
    'PhaseRepository',
    PrismaPhaseRepository,
  );
  container.registerSingleton<ReproductiveStageRepository>(
    'ReproductiveStageRepository',
    PrismaReproductiveStageRepository,
  );
  container.registerSingleton<BreedRepository>(
    'BreedRepository',
    PrismaBreedRepository,
  );
  container.registerSingleton<PigRepository>(
    'PigRepository',
    PrismaPigRepository,
  );

  container.registerSingleton<FarmRepository>(
    'FarmRepository',
    PrismaFarmRepository,
  );
  container.registerSingleton<NotificationRepository>(
    'NotificationRepository',
    PrismaNotificationRepository,
  );
  container.registerSingleton<CategoryRepository>(
    'CategoryRepository',
    PrismaCategoryRepository,
  );
  container.registerSingleton<ProductRepository>(
    'ProductRepository',
    PrismaProductRepository,
  );
  container.registerSingleton<CorralRepository>(
    'CorralRepository',
    PrismaCorralRepository,
  );
  container.registerSingleton<DeviceRepository>(
    'DeviceRepository',
    PrismaDeviceRepository,
  );

  // Casos de uso
  container.registerSingleton<SignUpUseCase>('SignUpUseCase', SignUpUseCase);
  container.registerSingleton<SignInUseCase>('SignInUseCase', SignInUseCase);
  container.registerSingleton<VerifyUseCase>('VerifyUseCase', VerifyUseCase);

  //notificaciones
  container.registerSingleton<SendDailyNotificationsUseCase>(
    'SendDailyNotificationsUseCase',
    SendDailyNotificationsUseCase,
  );
  container.registerSingleton<AllNotificationUseCase>(
    'AllNotificationUseCase',
    AllNotificationUseCase,
  );

  // rol
  container.registerSingleton<ByIdsRolUseCase>(
    'ByIdsRolUseCase',
    ByIdsRolUseCase,
  );
  container.registerSingleton<ByNamesRolUseCase>(
    'ByNamesRolUseCase',
    ByNamesRolUseCase,
  );
  // user
  container.registerSingleton<GetUserByEmailUseCase>(
    'GetUserByEmailUseCase',
    GetUserByEmailUseCase,
  );
  container.registerSingleton<CreateUserProviderUseCase>(
    'CreateUserProviderUseCase',
    CreateUserProviderUseCase,
  );
  container.registerSingleton<CreateUserUseCase>(
    'CreateUserUseCase',
    CreateUserUseCase,
  );
  container.registerSingleton<AllUserUseCase>('AllUserUseCase', AllUserUseCase);
  container.registerSingleton<DeleteManyUserUseCase>(
    'DeleteManyUserUseCase',
    DeleteManyUserUseCase,
  );
  container.registerSingleton<AllRolUseCase>('AllRolUseCase', AllRolUseCase);
  container.registerSingleton<GetProfileUseCase>(
    'GetProfileUseCase',
    GetProfileUseCase,
  );

  // todo: granja
  container.registerSingleton<GetSettingByFarmIdUseCase>(
    'GetSettingByFarmIdUseCase',
    GetSettingByFarmIdUseCase,
  );
  container.registerSingleton<AllSettingUseCase>(
    'AllSettingUseCase',
    AllSettingUseCase,
  );
  container.registerSingleton<UpdateSettingUseCase>(
    'UpdateSettingUseCase',
    UpdateSettingUseCase,
  );

  container.registerSingleton<AllReproductiveStageUseCase>(
    'AllReproductiveStageUseCase',
    AllReproductiveStageUseCase,
  );

  container.registerSingleton<GetReproductiveStageByIdUseCase>(
    'GetReproductiveStageByIdUseCase',
    GetReproductiveStageByIdUseCase,
  );

  container.registerSingleton<GetFarmByIdUseCase>(
    'GetFarmByIdUseCase',
    GetFarmByIdUseCase,
  );
  container.registerSingleton<CreateFarmUseCase>(
    'CreateFarmUseCase',
    CreateFarmUseCase,
  );
  container.registerSingleton<AllFarmUseCase>('AllFarmUseCase', AllFarmUseCase);

  // razas
  container.registerSingleton<GetBreedByIdUseCase>(
    'GetBreedByIdUseCase',
    GetBreedByIdUseCase,
  );
  container.registerSingleton<CreateBreedUseCase>(
    'CreateBreedUseCase',
    CreateBreedUseCase,
  );
  container.registerSingleton<UpdateBreedUseCase>(
    'UpdateBreedUseCase',
    UpdateBreedUseCase,
  );
  container.registerSingleton<GetBreedByNameUseCase>(
    'GetBreedByNameUseCase',
    GetBreedByNameUseCase,
  );
  container.registerSingleton<AllBreedUseCase>(
    'AllBreedUseCase',
    AllBreedUseCase,
  );

  // fases
  container.registerSingleton<GetPhaseByIdUseCase>(
    'GetPhaseByIdUseCase',
    GetPhaseByIdUseCase,
  );
  container.registerSingleton<GetPhaseByNameUseCase>(
    'GetPhaseByNameUseCase',
    GetPhaseByNameUseCase,
  );
  container.registerSingleton<AllPhaseUseCase>(
    'AllPhaseUseCase',
    AllPhaseUseCase,
  );

  // pigs
  container.registerSingleton<PigReproductiveCalculatorUseCase>(
    'PigReproductiveCalculatorUseCase',
    PigReproductiveCalculatorUseCase,
  );
  container.registerSingleton<DeletePigUseCase>(
    'DeletePigUseCase',
    DeletePigUseCase,
  );
  container.registerSingleton<AllPigUseCase>('AllPigUseCase', AllPigUseCase);
  container.registerSingleton<CreatePigUseCase>(
    'CreatePigUseCase',
    CreatePigUseCase,
  );
  container.registerSingleton<UpdatePigUseCase>(
    'UpdatePigUseCase',
    UpdatePigUseCase,
  );
  container.registerSingleton<AllPigByIdsUseCase>(
    'AllPigByIdsUseCase',
    AllPigByIdsUseCase,
  );
  // notificaciones
  container.registerSingleton<CreateSowNotificationsUseCase>(
    'CreateSowNotificationsUseCase',
    CreateSowNotificationsUseCase,
  );
  container.registerSingleton<DeleteSowNotificationUseCase>(
    'DeleteSowNotificationUseCase',
    DeleteSowNotificationUseCase,
  );

  // category
  container.registerSingleton<GetCategoryByIdUseCase>(
    'GetCategoryByIdUseCase',
    GetCategoryByIdUseCase,
  );
  container.registerSingleton<GetCategoryByNameUseCase>(
    'GetCategoryByNameUseCase',
    GetCategoryByNameUseCase,
  );
  container.registerSingleton<CreateCategoryUseCase>(
    'CreateCategoryUseCase',
    CreateCategoryUseCase,
  );
  container.registerSingleton<UpdateCategoryUseCase>(
    'UpdateCategoryUseCase',
    UpdateCategoryUseCase,
  );
  container.registerSingleton<AllCategoryUseCase>(
    'AllCategoryUseCase',
    AllCategoryUseCase,
  );

  // product
  container.registerSingleton<CreateProductUseCase>(
    'CreateProductUseCase',
    CreateProductUseCase,
  );
  container.registerSingleton<UpdateProductUseCase>(
    'UpdateProductUseCase',
    UpdateProductUseCase,
  );
  container.registerSingleton<GetProductByIdUseCase>(
    'GetProductByIdUseCase',
    GetProductByIdUseCase,
  );
  container.registerSingleton<GetProductByNameUseCase>(
    'GetProductByNameUseCase',
    GetProductByNameUseCase,
  );

  // corrals
  container.registerSingleton<CreateCorralUseCase>(
    'CreateCorralUseCase',
    CreateCorralUseCase,
  );
  container.registerSingleton<UpdateCorralUseCase>(
    'UpdateCorralUseCase',
    UpdateCorralUseCase,
  );
  container.registerSingleton<AllCorralUseCase>(
    'AllCorralUseCase',
    AllCorralUseCase,
  );

  // devices
  container.registerSingleton<CreateDeviceUseCase>(
    'CreateDeviceUseCase',
    CreateDeviceUseCase,
  );
  container.registerSingleton<AllDevicesUseCase>(
    'AllDevicesUseCase',
    AllDevicesUseCase,
  );
}
