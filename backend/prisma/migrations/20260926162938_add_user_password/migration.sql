/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

  Existing rows in User (and their Basket/BasketItem rows) are local seed
  data with no password, so they are cleared here rather than backfilled.
  Re-run `prisma db seed` after migrating to repopulate.
*/
-- DeleteData
DELETE FROM "BasketItem";
DELETE FROM "Basket";
DELETE FROM "User";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
