import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ContactModule } from './contact/contact.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      expandVariables: true,
    }),
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoURI = configService.get('MONGO_URI');
        const database = configService.get('DB_MONGO_DATABASE');

        return {
          uri: mongoURI,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ContactModule,
    // TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
