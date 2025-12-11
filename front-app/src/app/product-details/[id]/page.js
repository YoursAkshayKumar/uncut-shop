
import ShopDetailsMainArea from "@components/product-details/product-details-area-main";

export const metadata = {
  title: "Product Details- Uncut Designs",
};

const ProductDetailsPage = async ({ params }) => {
  const { id } = await params;
  return <ShopDetailsMainArea slug={id} />;
};

export default ProductDetailsPage;
