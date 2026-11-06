ALTER TABLE "home_products_header" ADD COLUMN "sections" JSONB NOT NULL DEFAULT '{"header":true,"services":true,"cases":true}';
ALTER TABLE "home_product_entries" ADD COLUMN "visible" BOOLEAN NOT NULL DEFAULT true;
