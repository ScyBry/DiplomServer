import { Module } from '@nestjs/common';
import { CabinetService } from './cabinet.service';
import { CabinetController } from './cabinet.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CabinetController],
  providers: [CabinetService],
})
export class CabinetModule {}
