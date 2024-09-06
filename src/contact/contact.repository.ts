import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './contact.schema';

export class ContactRepository {
  constructor(
    @InjectModel(Contact.name) private ContactModel: Model<ContactDocument>,
  ) {}

  async create(Contact: Contact): Promise<Contact> {
    const newContact = new this.ContactModel(Contact);
    return newContact.save();
  }

  async findAll(search?: string): Promise<Contact[]> {
    const query = this.createSearchQuery(search);
    return this.ContactModel.find(query).exec();
  }

  async findOne(id: string): Promise<Contact> {
    return this.ContactModel.findById(id).exec();
  }

  async remove(id: string): Promise<Contact> {
    return this.ContactModel.findByIdAndDelete(id).exec();
  }

  async findWithPagination(
    skip: number,
    limit: number,
    search?: string,
  ): Promise<Contact[]> {
    const query = this.createSearchQuery(search);
    return this.ContactModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(search?: string): Promise<number> {
    const query = this.createSearchQuery(search);

    return this.ContactModel.countDocuments(query).exec();
  }

  private createSearchQuery(search: string): any {
    if (!search) {
      return {};
    }
    const fieldsToSearch = ['fullName', 'message', 'email'];
    return {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };
  }
}
