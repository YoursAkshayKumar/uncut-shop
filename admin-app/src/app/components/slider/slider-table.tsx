"use client";
import React from "react";
import ErrorMsg from "../common/error-msg";
import Image from "next/image";
import Pagination from "../ui/Pagination";
import { useGetAllSlidersQuery } from "@/redux/slider/sliderApi";
import SliderEditDelete from "./slider-edit-del";
import usePagination from "@/hooks/use-pagination";

const SliderTables = () => {
  const { data: sliders, isError, isLoading } = useGetAllSlidersQuery();
  const paginationData = usePagination(sliders?.result || [], 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && sliders?.result.length === 0) {
    content = <ErrorMsg msg="No Slider Found" />;
  }

  if (!isLoading && !isError && sliders?.success) {
    const sliderItems = [...sliders.result].reverse();

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
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[200px]"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px]"
                  >
                    Background Image
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px]"
                  >
                    Product Image
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px]"
                  >
                    Order
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end"
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
                          {item.title}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-normal text-[#55585B]">
                        {item.backgroundImage && (
                          <Image
                            className="w-16 h-16 rounded object-cover"
                            src={item.backgroundImage}
                            alt="background"
                            width={64}
                            height={64}
                          />
                        )}
                      </td>
                      <td className="px-3 py-3 font-normal text-[#55585B]">
                        {item.productImage && (
                          <Image
                            className="w-16 h-16 rounded object-cover"
                            src={item.productImage}
                            alt="product"
                            width={64}
                            height={64}
                          />
                        )}
                      </td>
                      <td className="px-3 py-3 font-normal text-[#55585B]">
                        {item.order}
                      </td>
                      <td className="px-3 py-3 font-normal text-[#55585B]">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-9 py-3 text-end">
                        <div className="flex items-center justify-end space-x-2">
                          <SliderEditDelete id={item._id}/>
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
            Showing 1-
            {currentItems.length} of{" "}
            {sliders?.result.length}
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

export default SliderTables;

