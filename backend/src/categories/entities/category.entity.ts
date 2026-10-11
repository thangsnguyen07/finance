import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type CategoryType = 'INCOME' | 'EXPENSE';

@Entity('categories')
@Index(['userId', 'name', 'type'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  type: CategoryType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  color: string | null;

  @Column({ name: 'is_system_default', type: 'boolean', default: false })
  isSystemDefault: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
