ALTER TABLE "Order" ADD COLUMN "invoiceNumber" TEXT;

CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

CREATE TABLE "InvoiceSequence" (
    "year" INTEGER NOT NULL,
    "nextNumber" INTEGER NOT NULL,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("year")
);
