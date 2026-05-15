/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - Added the required column `categories` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "image",
ADD COLUMN     "categories" JSONB NOT NULL,
ADD COLUMN     "images" JSONB NOT NULL;
