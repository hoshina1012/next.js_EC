-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RacketTypes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    CONSTRAINT "RacketTypes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RacketTypes_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RacketTypes" ("id", "productId", "typeId") SELECT "id", "productId", "typeId" FROM "RacketTypes";
DROP TABLE "RacketTypes";
ALTER TABLE "new_RacketTypes" RENAME TO "RacketTypes";
CREATE UNIQUE INDEX "RacketTypes_id_key" ON "RacketTypes"("id");
CREATE TABLE "new_RubberColors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    CONSTRAINT "RubberColors_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RubberColors_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RubberColors" ("colorId", "id", "productId") SELECT "colorId", "id", "productId" FROM "RubberColors";
DROP TABLE "RubberColors";
ALTER TABLE "new_RubberColors" RENAME TO "RubberColors";
CREATE UNIQUE INDEX "RubberColors_id_key" ON "RubberColors"("id");
CREATE TABLE "new_ShoesSizes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,
    CONSTRAINT "ShoesSizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShoesSizes_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShoesSizes" ("id", "productId", "sizeId") SELECT "id", "productId", "sizeId" FROM "ShoesSizes";
DROP TABLE "ShoesSizes";
ALTER TABLE "new_ShoesSizes" RENAME TO "ShoesSizes";
CREATE UNIQUE INDEX "ShoesSizes_id_key" ON "ShoesSizes"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
