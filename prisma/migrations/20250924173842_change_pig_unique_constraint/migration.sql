/*
  Warnings:

  - A unique constraint covering the columns `[earTag,farmId,remove]` on the table `Pig` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Pig_earTag_farmId_key` ON `Pig`;

-- CreateIndex
CREATE UNIQUE INDEX `Pig_earTag_farmId_remove_key` ON `Pig`(`earTag`, `farmId`, `remove`);
