/*
  Warnings:

  - The `friends` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `demFriends` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "friends",
ADD COLUMN     "friends" INTEGER[],
DROP COLUMN "demFriends",
ADD COLUMN     "demFriends" INTEGER[];
