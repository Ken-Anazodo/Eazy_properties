"use client";

import ShowTimeAgo from "@/components/elements/showTimeAgo";
import Layout from "@/components/layout/Layout";
import { useFetchAllMessageToASpecificAgentQuery } from "@/services/propertyApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { User } from "lucide-react";
import "/public/styles/css/main.css";

export default function Message() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("id");
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setcurrentPage] = useState<number>(1);
  const [doublePage, setDoublePage] = useState<number>(2);

  const { isLoading, data, error } = useFetchAllMessageToASpecificAgentQuery(
    agentId ? { agentId, page: currentPage, limit } : skipToken
  );

  const handlePageChange = (pageNumber: number) => {
    setcurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLimit(Number.parseInt(e.target.value));
    setcurrentPage(1);
  };

  const RenderPagination = () => {
    const totalPages = Math.ceil(
      data && Number(data?.total) / Number(data?.limit)
    );


    if (totalPages <= 0) return null;

    return (
      <div className="pagination-area">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <Link
                className="page-link"
                href="#"
                aria-label="Previous"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.max(1, currentPage - 1));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
                </svg>
              </Link>
            </li>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber:number;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <Link
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </Link>
                </li>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <li className="page-item">
                <Link
                  className="page-link"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  ....
                </Link>
              </li>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <li className="page-item">
                <Link
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                >
                  {totalPages}
                </Link>
              </li>
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <Link
                className="page-link"
                href="#"
                aria-label="Next"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.min(totalPages, currentPage + 1));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        <div>
          <div className="hero-inner-section-area-sidebar">
            <img
              src="/assets/img/all-images/hero/hero-img1.png"
              alt="housebox"
              className="hero-img1"
            />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="hero-header-area text-center">
                    <Link href="/">
                      Home{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                      </svg>{" "}
                      ALL MESSAGE
                    </Link>
                    <div className="space24" />
                    <h1>ALL MESSAGE</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*===== HERO AREA ENDS =======*/}
          {/*===== DASHBOARD AREA STARTS =======*/}
          <div className="dashboard-section-area sp1">
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <div className="heading1">
                    <h2>All Message</h2>
                  </div>
                </div>
                <div className="col-lg-4" />
                <div className="col-lg-4">
                  <div className="reviews">
                    <div className="filter-group me-3">
                      <select value={limit} onChange={handleItemsPerPageChange}>
                        <option value={5}>Show:(5)</option>
                        <option value={10}>Show:(10)</option>
                        <option value={30}>Show:(30)</option>
                        <option value={50}>Show:(50)</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <select>
                        <option>Sort by (Default)</option>
                        <option>Oldest</option>
                        <option>Newest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="space30" />
				  
				  {isLoading? (<p className="text-center">Loading Messages, Please wait...</p>)
				  	: error? (<p className="text-center">Error Loading Messages</p>)
					:(<div className="dashboard-info-sider-deatils">
						<div className="dashboard-info-sider">
						{data?.messages.map(
							(messageDetails: any, index: number) => (
							<div key={index} className="message-boxarea" style={{marginTop: "10px"}}>
								<div className="img1 message-img img-placeholder">						
									<User className="user-icon" />                          
								</div>
								<div className="conatent-area">
								<div className="content">
									<Link href="/#">{messageDetails.fullName}</Link>
									<ShowTimeAgo
									dateAndTime={messageDetails.createdAt}
									/>
								</div>
								<div className="space14" />
								<p>{messageDetails.message}</p>
								</div>
							</div>
							)
						)}
						</div>
					</div>)
					}
                </div>

                <RenderPagination />
              </div>
            </div>
          </div>
          {/*===== DASHBOARD AREA ENDS =======*/}
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
                            Step Into Your Dream Home with HouseBox
                          </h2>
                          <div className="space16" />
                          <p data-aos="fade-left" data-aos-duration={1000}>
                            At HouseBox, we believe your next home is more than
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
                          <Link
                            href="/property-halfmap-grid"
                            className="theme-btn1"
                          >
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

