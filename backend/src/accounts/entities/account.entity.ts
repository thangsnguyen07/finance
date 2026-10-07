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
// Transformer converts bigint to JavaScript number for VND integer currency.
const bigintTransformer = {
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
@Index(['user_id', 'name'], { unique: true })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  user_id: string;

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
    type: 'bigint',
    default: 0,
    transformer: bigintTransformer,
  })
  current_balance: number;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: bigintTransformer,
  })
  credit_limit: number | null;

  @Column({ type: 'int', nullable: true })
  statement_day: number | null;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
