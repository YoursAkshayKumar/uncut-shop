import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import SubscriptionTable from "../components/subscription/subscription-table";

const SubscriptionsPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Subscriptions" subtitle="Email Subscriptions" />
        {/* breadcrumb end */}

        {/* subscription table start */}
        <div className="grid grid-cols-12 mt-6">
          <div className="col-span-12 2xl:col-span-10">
            <SubscriptionTable />
          </div>
        </div>
        {/* subscription table end */}
      </div>
    </Wrapper>
  );
};

export default SubscriptionsPage;
