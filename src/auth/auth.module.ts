import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule {}
