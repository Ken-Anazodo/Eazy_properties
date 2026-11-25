"use client";
// import React, { useState } from "react";
// import { useGetAllPublicPropertiesQuery } from "@/services/propertyApi";
import styles from "@/styles/property-list5.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllPublicPropertiesQuery } from "@/services/propertyApi";
import { addPerPage, addSort } from "@/features/filter/filterSlice";
import { toggleFavoriteProperty } from "@/features/property/propertySlice";
import type { RootState } from "@/app/api/store";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface PropertyListItem {
  propertyId: string;
  keyword?: string;
  images?: string[];
  address?: string;
  city?: string;
  state?: string;
  propertyStatus?: string;
  propertyLabel?: string;
  bedrooms?: string;
  bathrooms?: string;
  size?: string;
  price?: number;
  agent?: {
    name: string;
    image: string;
  };
}

function propertylist5() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // const {
  //   data: fetchedProperties,
  //   isLoading,
  //   isError,
  // } = useGetAllPublicPropertiesQuery({
  //   page: currentPage,
  //   limit: itemsPerPage,
  // });
  // if (isLoading) {
  //   return (
  //     <div className={styles.spinnerWrapper}>
  //       <div className={styles.spinner}></div>
  //     </div>
  //   );
  // }
  // if (isError) {
  //   return (
  //     <div className="text-center py-5">
  //       <h4>Error loading properties</h4>
  //       <p>Please try again later</p>
  //     </div>
  //   );
  // }

  //   const totalPages = Math.ceil(fetchedProperties.total / itemsPerPage);

  // const { properties } = fetchedProperties;
  return (
    <div>
     hello
    </div>
  );
}

export default propertylist5;
