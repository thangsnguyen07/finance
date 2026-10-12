import { IsUUID, IsString, Matches, IsInt, Min } from 'class-validator';

export class UpsertBudgetDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in YYYY-MM format',
  })
  month: string;

  @IsInt()
  @Min(1000)
  amount: number;
}
