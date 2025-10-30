import SingleOrderArea from "@components/order-area";


export const metadata = {
  title: "Single Order- Uncut Designs",
};

const OrderPage = async ({ params }) => {
  const { id } = await params;
  return <SingleOrderArea orderId={id} />;
};

export default OrderPage;
