import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1729200000000 implements MigrationInterface {
  name = 'InitialSchema1729200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // 1. Accounts Table
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "type" VARCHAR(30) NOT NULL DEFAULT 'CASH',
        "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
        "current_balance" BIGINT NOT NULL DEFAULT 0,
        "credit_limit" BIGINT,
        "statement_day" INT,
        "is_archived" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_accounts_user_id" ON "accounts" ("user_id");
      CREATE UNIQUE INDEX "IDX_accounts_user_id_name" ON "accounts" ("user_id", "name");
    `);

    // 2. Categories Table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(100) NOT NULL,
        "type" VARCHAR(20) NOT NULL,
        "icon" VARCHAR(50),
        "color" VARCHAR(30),
        "is_system_default" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_categories_user_id" ON "categories" ("user_id");
      CREATE UNIQUE INDEX "IDX_categories_user_id_name_type" ON "categories" ("user_id", "name", "type");
    `);

    // 3. Transactions Table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "client_tx_id" VARCHAR(100) NOT NULL,
        "user_id" VARCHAR(255) NOT NULL,
        "account_id" UUID NOT NULL REFERENCES "accounts" ("id") ON DELETE RESTRICT,
        "target_account_id" UUID REFERENCES "accounts" ("id") ON DELETE RESTRICT,
        "category_id" UUID REFERENCES "categories" ("id") ON DELETE SET NULL,
        "amount" BIGINT NOT NULL,
        "type" VARCHAR(20) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'CLEARED',
        "transaction_date" DATE NOT NULL,
        "description" VARCHAR(255),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("user_id");
      CREATE UNIQUE INDEX "IDX_transactions_user_id_client_tx_id" ON "transactions" ("user_id", "client_tx_id");
      CREATE INDEX "IDX_transactions_user_id_transaction_date" ON "transactions" ("user_id", "transaction_date");
    `);

    // 4. Budgets Table
    await queryRunner.query(`
      CREATE TABLE "budgets" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" VARCHAR(255) NOT NULL,
        "category_id" UUID NOT NULL REFERENCES "categories" ("id") ON DELETE CASCADE,
        "month" VARCHAR(7) NOT NULL,
        "amount" BIGINT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_budgets_user_id" ON "budgets" ("user_id");
      CREATE INDEX "IDX_budgets_user_id_month" ON "budgets" ("user_id", "month");
      CREATE UNIQUE INDEX "IDX_budgets_user_id_category_id_month" ON "budgets" ("user_id", "category_id", "month");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "budgets"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "accounts"`);
  }
}
