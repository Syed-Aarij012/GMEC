-- AlterTable
ALTER TABLE "Order" ADD COLUMN "royalMailOrderId" TEXT,
ADD COLUMN "royalMailTrackingNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_royalMailOrderId_key" ON "Order"("royalMailOrderId");
