import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Contact } from './contact.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly ContactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Contact' })
  @ApiBody({ type: Contact })
  async create(@Body() Contact: Contact) {
    await this.ContactService.create(Contact);
    return { message: 'Message sent, we will connect shortly!' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all Contacts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.ContactService.findAll(page, limit, search);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Contact' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ContactService.remove(id);
    return { message: 'Contact deleted successfully!' };
  }
}
