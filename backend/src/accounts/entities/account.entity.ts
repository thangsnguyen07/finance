import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type AccountType =
  | 'CASH'
  | 'BANK'
  | 'CREDIT_CARD'
  | 'E_WALLET'
  | 'INVESTMENT';

// PostgreSQL bigint returns as string to prevent 64-bit precision loss.
// Transformer converts bigint to JavaScript number for integer VND currency.
const BIGINT_TRANSFORMER = {
  to: (value: number | null | undefined): string | null => {
    if (value === null || value === undefined) return null;
    return value.toString();
  },
  from: (value: string | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    return Number(value);
  },
};

@Entity('accounts')
@Index(['userId', 'name'], { unique: true })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: 'CASH',
  })
  type: AccountType;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({
    name: 'current_balance',
    type: 'bigint',
    default: 0,
    transformer: BIGINT_TRANSFORMER,
  })
  currentBalance: number;

  @Column({
    name: 'credit_limit',
    type: 'bigint',
    nullable: true,
    transformer: BIGINT_TRANSFORMER,
  })
  creditLimit: number | null;

  @Column({ name: 'statement_day', type: 'int', nullable: true })
  statementDay: number | null;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
