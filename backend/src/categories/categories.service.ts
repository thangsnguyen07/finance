import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, type CategoryType } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

export const DEFAULT_CATEGORIES: ReadonlyArray<{
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}> = [
  {
    name: 'Ăn uống & Cà phê',
    type: 'EXPENSE',
    icon: 'utensils',
    color: '#991B1B',
  },
  {
    name: 'Di chuyển & Xăng xe',
    type: 'EXPENSE',
    icon: 'car',
    color: '#B45309',
  },
  {
    name: 'Tiền nhà & Điện nước',
    type: 'EXPENSE',
    icon: 'home',
    color: '#1E3A8A',
  },
  {
    name: 'Siêu thị & Mua sắm',
    type: 'EXPENSE',
    icon: 'shopping-bag',
    color: '#7C2D12',
  },
  {
    name: 'Sức khỏe & Y tế',
    type: 'EXPENSE',
    icon: 'heart-pulse',
    color: '#BE123C',
  },
  {
    name: 'Giải trí & Học tập',
    type: 'EXPENSE',
    icon: 'book-open',
    color: '#4338CA',
  },
  {
    name: 'Tiền lương',
    type: 'INCOME',
    icon: 'banknote',
    color: '#166534',
  },
  {
    name: 'Thưởng & Phụ cấp',
    type: 'INCOME',
    icon: 'gift',
    color: '#15803D',
  },
  {
    name: 'Đầu tư & Lãi tiết kiệm',
    type: 'INCOME',
    icon: 'trending-up',
    color: '#047857',
  },
];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(userId: string, type?: CategoryType): Promise<Category[]> {
    let categories = await this.categoriesRepository.find({
      where: { userId },
      order: { isSystemDefault: 'DESC', createdAt: 'ASC' },
    });

    if (categories.length === 0) {
      const seededEntities = DEFAULT_CATEGORIES.map((item) =>
        this.categoriesRepository.create({
          userId,
          name: item.name,
          type: item.type,
          icon: item.icon,
          color: item.color,
          isSystemDefault: true,
        }),
      );
      categories = await this.categoriesRepository.save(seededEntities);
    }

    if (type) {
      return categories.filter((cat) => cat.type === type);
    }

    return categories;
  }

  async findOne(userId: string, id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const existing = await this.categoriesRepository.findOne({
      where: {
        userId,
        name: createCategoryDto.name,
        type: createCategoryDto.type,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Category "${createCategoryDto.name}" (${createCategoryDto.type}) already exists`,
      );
    }

    const category = this.categoriesRepository.create({
      userId,
      name: createCategoryDto.name,
      type: createCategoryDto.type,
      icon: createCategoryDto.icon ?? 'tag',
      color:
        createCategoryDto.color ??
        (createCategoryDto.type === 'INCOME' ? '#166534' : '#991B1B'),
      isSystemDefault: false,
    });

    return await this.categoriesRepository.save(category);
  }
}
