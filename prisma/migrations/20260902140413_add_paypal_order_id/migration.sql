-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paypalOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paypalOrderId_key" ON "Order"("paypalOrderId");
