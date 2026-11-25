"use client";
import PropertyFilter4 from "@/components/elements/property-filter4";
import PropertyList4 from "@/components/elements/property-list4";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useGetAllPublicPropertiesQuery } from "@/services/propertyApi";
import { useEffect, useState } from "react";

const swiperFade = {
  modules: [Autoplay, Pagination, Navigation],
  spaceBetween: 0,
  slidesPerView: 1,
  freeMode: true,
  watchSlidesProgress: true,
  autoplay: {
    delay: 2500,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
};
export default function TopmapGrid() {
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetAllPublicPropertiesQuery({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const [userLocation, setUserLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null }); // Default to Lagos

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        <div>
          <div  className="hero-inner-section-area">
            <img
              src="/assets/img/all-images/hero/hero-img1.png"
              alt="EazyProp"
              className="hero-img1"
            />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="hero-header-area text-center pb-5">
                    <Link href="/">
                      Home
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                      </svg>
                      Listing
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                      </svg>
                      Explore the best properties with our Top Map Grid
                    </Link>
                    <div className="space24 py-5" />
                    <h1>Discover Your Dream Property</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="map-others-area">
              <div className="wrap-right">
                {userLocation.lat && userLocation.lng ? (
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31407.120552435!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1704088968016!5m2!1sen!2sng`}
                    width={600}
                    height={450}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <p>Loading map...</p>
                )}
              </div>
             
            </div>
          </div>
          {/*===== HERO AREA ENDS =======*/}
          {/*===== OTHERS AREA STARTS =======*/}
          <div className="others-section-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="theme-btn1 open-search-filter-form">
                    <p className="open-text">
                      Open Search Form
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
                      </svg>
                    </p>
                    <p className="close-text">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z" />
                      </svg>
                      Close
                    </p>
                  </div>
                  <PropertyFilter4 />
                </div>
              </div>
            </div>
          </div>
          {/*===== OTHERS AREA STARTS =======*/}
          {/*===== PROPERTIES AREA STARTS =======*/}
          <div className="property-inner-section-find sp1">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  {isLoading ? (
                    <div className="loading-spinner mx-auto text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        fill="currentColor"
                      >
                        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" />
                      </svg>
                      <p>Loading please wait.......</p>
                    </div>
                  ) : isError ? (
                    <p>Error loading properties.</p>
                  ) : (
                    <PropertyList4 view="grid" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/*===== PROPERTIES AREA ENDS =======*/}
          {/*===== CTA AREA STARTS =======*/}
          <div className="cta1-section-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="cta-bg-area"
                    style={{
                      backgroundImage:
                        "url(assets/img/all-images/bg/cta-bg1.png)",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-lg-5">
                        <div className="cta-header">
                          <h2 className="text-anime-style-3">
                            Step Into Your Dream Home with EazyProp
                          </h2>
                          <div className="space16" />
                          <p data-aos="fade-left" data-aos-duration={1000}>
                            At EazyProp, we believe your next home is more than
                            just a place – it’s where your future begins you’re
                            buy.
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-2" />
                      <div
                        className="col-lg-5"
                        data-aos="zoom-in"
                        data-aos-duration={1000}
                      >
                        <div className="btn-area1 text-center">
                          <Link href="/sidebar-grid" className="theme-btn1">
                            Find Your Dream Home{" "}
                            <span className="arrow1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={24}
                                height={24}
                                fill="currentColor"
                              >
                                <path d="M12 13H4V11H12V4L20 12L12 20V13Z" />
                              </svg>
                            </span>
                            <span className="arrow2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={24}
                                height={24}
                                fill="currentColor"
                              >
                                <path d="M12 13H4V11H12V4L20 12L12 20V13Z" />
                              </svg>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
