import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Category, PublicUser } from '@expense-tracker/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: PublicUser,
  ): Promise<Category> {
    return this.categoriesService.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: PublicUser): Promise<Category[]> {
    return this.categoriesService.findAll(user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: PublicUser,
  ): Promise<Category> {
    return this.categoriesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: PublicUser): Promise<void> {
    return this.categoriesService.remove(id, user.id);
  }
}
