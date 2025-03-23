-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItems" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "kindId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItems" ("id", "kindId", "orderId", "productId", "quantity", "status") SELECT "id", "kindId", "orderId", "productId", "quantity", "status" FROM "OrderItems";
DROP TABLE "OrderItems";
ALTER TABLE "new_OrderItems" RENAME TO "OrderItems";
CREATE UNIQUE INDEX "OrderItems_id_key" ON "OrderItems"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
