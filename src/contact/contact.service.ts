import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { Contact } from './contact.schema';
@Injectable()
export class ContactService {
  constructor(private readonly ContactRepository: ContactRepository) {}

  async create(Contact: Contact): Promise<Contact> {
    try {
      return await this.ContactRepository.create(Contact);
    } catch (error) {
      console.log('error::: ', error);
      if (
        error instanceof ConflictException ||
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create Contact');
      }
    }
  }

  async findAll(page?: number, limit?: number, search?: string) {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const [items, totalRecords] = await Promise.all([
        this.ContactRepository.findWithPagination(skip, limit, search),
        this.ContactRepository.countAll(search),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return {
        items,
        recordsPerPage: limit,
        totalRecords,
        currentPageNumber: page,
        totalPages,
      };
    } else {
      const items = await this.ContactRepository.findAll(search);
      return items;
    }
  }

  async findOne(id: string): Promise<Contact> {
    const Contact = await this.ContactRepository.findOne(id);
    if (!Contact) {
      throw new NotFoundException('Contact not found');
    }
    return Contact;
  }

  async remove(id: string): Promise<Contact> {
    try {
      const deletedContact = await this.ContactRepository.remove(id);
      if (!deletedContact) {
        throw new NotFoundException('Contact not found');
      }
      return deletedContact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete Contact',
          error.message,
        );
      }
    }
  }
}
