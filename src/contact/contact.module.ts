import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './Contact.controller';
import { Contact, ContactSchema } from './contact.schema';
import { ContactRepository } from './contact.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
