"use client";
import React from "react";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import { useGetAllSubscriptionsQuery, useDeleteSubscriptionMutation, useUpdateSubscriptionStatusMutation } from "@/redux/subscription/subscriptionApi";
import usePagination from "@/hooks/use-pagination";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";

const SubscriptionTable = () => {
  const { data: subscriptions, isError, isLoading } = useGetAllSubscriptionsQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [updateStatus] = useUpdateSubscriptionStatusMutation();
  const paginationData = usePagination(subscriptions?.result || [], 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this subscription?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteSubscription(id);
          if ("error" in res) {
            if ("data" in res.error) {
              const errorData = res.error.data as { message?: string };
              if (typeof errorData.message === "string") {
                return notifyError(errorData.message);
              }
            }
          } else {
            Swal.fire("Deleted!", "Subscription has been deleted.", "success");
          }
        } catch (error) {
          // Handle error
        }
      }
    });
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "unsubscribed" : "active";
    try {
      const res = await updateStatus({ id, status: newStatus as "active" | "unsubscribed" });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
      } else {
        Swal.fire(
          "Updated!",
          `Subscription ${newStatus === "active" ? "activated" : "unsubscribed"} successfully.`,
          "success"
        );
      }
    } catch (error) {
      // Handle error
    }
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && subscriptions?.result.length === 0) {
    content = <ErrorMsg msg="No Subscriptions Found" />;
  }

  if (!isLoading && !isError && subscriptions?.success) {
    const subscriptionItems = [...subscriptions.result].reverse();

    content = (
      <>
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[975px] 2xl:w-full">
            <table className="w-full text-base text-left text-gray-500 ">
              <thead>
                <tr className="border-b border-gray6 text-tiny">
                  <th
                    scope="col"
                    className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[300px]"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[200px]"
                  >
                    Subscribed Date
                  </th>
                  <th
                    scope="col"
                    className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
                  >
                    <td className="px-3 py-3 pl-0 font-normal text-[#55585B]">
                      #{item._id.slice(2, 10)}
                    </td>
                    <td className="pr-8 py-5 whitespace-nowrap">
                      <span className="font-medium text-heading text-hover-primary transition">
                        {item.email}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B]">
                      <button
                        onClick={() => handleStatusChange(item._id, item.status)}
                        className={`px-2 py-1 rounded text-xs cursor-pointer ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-9 py-3 text-end">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">
            Showing 1-{currentItems.length} of {subscriptions?.result.length}
          </p>
          <div className="pagination py-3 flex justify-end items-center">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
      {content}
    </div>
  );
};

export default SubscriptionTable;
