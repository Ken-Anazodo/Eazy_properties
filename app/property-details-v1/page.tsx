"use client";
import VideoPopup from "@/components/elements/VideoPopup";
import Layout from "@/components/layout/Layout";
import { useFetchAllPropertyByAgentQuery, useFetchPropertyByIdQuery, useLeaveCommentsForASpecificPropertyMutation, useLogPropertyViewAndNotifyMutation, useSendMessageToAnAgentMutation } from "@/services/propertyApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "../loading";
import { useEffect, useState } from "react";
import { showToast } from "@/utils/toastUtils";
import { Boxes, User } from "lucide-react";
import ShowTimeAgo from "@/components/elements/showTimeAgo";
import LoadingSpinner from "@/components/elements/loadingSpinner";
import "/public/styles/css/main.css";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 3,
  spaceBetween: 30,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: true,

  // Navigation
  navigation: {
    nextEl: ".h1n",
    prevEl: ".h1p",
  },

  // Pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    575: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    767: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    991: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1199: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1350: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
};
const swiperOptions2 = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 3,
  spaceBetween: 30,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: true,

  // Navigation
  navigation: {
    nextEl: ".h1n",
    prevEl: ".h1p",
  },

  // Pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    575: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    767: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    991: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1199: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1350: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
};

type formInputType1 = {
  name: string,
  email: string,
  message: string
}

type formInputType2 = {
  fullName: string,
  phoneNumber: string,
  email: string,
  message: string
}


export default function PropertyDetailsV1() {

  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id") || "";
  const [commentData, setCommentData] = useState <formInputType1>({
    name: "",
    email: "",
    message: ""
  });

  const [agentMessage, setAgentMessage] = useState<formInputType2>({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: ""
  })

  // const [totalComment, setTotalComment] = useState<number>(0);
  const {data:property, isLoading, error, refetch} = useFetchPropertyByIdQuery(propertyId ?? "");
  const [logPropertyViewAndNotify] = useLogPropertyViewAndNotifyMutation();
  const [leaveCommentsForASpecificProperty, {isLoading:commentLoading, isSuccess:isCommentSuccess, data:leaveCommentData}] 
  = useLeaveCommentsForASpecificPropertyMutation();
  const [sendMessageToAnAgent, {isLoading:messageLoading, isSuccess:isMessageSuccess, data:messageData}] = useSendMessageToAnAgentMutation();
  const {isLoading:propertyLoading, error:propertyError, data:allProperty } = useFetchAllPropertyByAgentQuery(property?.agent?._id)
console.log(allProperty)
console.log(property?.agent?._id)

  useEffect(() => {
     logPropertyViewAndNotify(propertyId).unwrap()
  }, [])

  // Handle Comments
  const handleCommentOnChange = (event:any) => {
    const {name, value} = event.currentTarget;
    setCommentData((prev) => ({
      ...prev,
      [name]:value
    }))
  };

  const handleCommentSubmit = async(event:any) => {
    event.preventDefault();

    if(commentLoading){
      showToast.warning("Please wait...")
    }

    setCommentData({
      name: "",
      email: "",
      message: ""
    })

    try {
      console.log(commentData, propertyId)
      await leaveCommentsForASpecificProperty({propertyId, payload: commentData}).unwrap()
    } catch (error:any) {
      if (error) {
        showToast.error(error?.data.message)
      }
    }
  }

  useEffect(() => {
    if (isCommentSuccess) {
      refetch()
    // let newCount = property?.comments?.length;
    // setTotalComment(newCount)
      showToast.success(leaveCommentData?.message)
    }
  }, [isCommentSuccess, leaveCommentData, property])



  // Handle Messages
  const handleMessageOnChange = (event:any) => {
    const {name, value} = event.currentTarget;
    setAgentMessage((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleSubmitMessage = async(event:any) => {
    event.preventDefault()
    try{
      if (messageLoading){
        showToast.warning("Please wait...")
      } 

      await sendMessageToAnAgent({agentId:property?.agent?._id, payload:agentMessage}).unwrap();

      setAgentMessage({
        fullName: "",
        phoneNumber: "",
        email: "", 
        message: ""
      })

    }catch(error:any){
      if (error) {
        showToast.error(error?.data?.message)
        // console.log(error)
      }
    }
  };
  

  useEffect(() => {
   if (isMessageSuccess) {
     showToast.success(messageData?.message)
    //  console.log(messageData)
   }
    
  }, [isMessageSuccess, messageData])
  
  
  // const date = new Date(property?.comments[0].createdAt)
  // console.log(date)

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        {isLoading? ( <Loading /> ) 
        : error? (<p>Error loading Property</p>) 
        : (
        <div>
          <div className="hero-inner-section-area-sidebar">
            <img
              src="/assets/img/all-images/hero/hero-img1.png"
              alt="EazyProp"
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
                      Listing{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                      </svg>{" "}
                      {property?.title}
                    </Link>
                    <div className="space24" />
                    <h1>{property?.title}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*===== HERO AREA ENDS =======*/}
          {/*===== PROPERTIES AREA STARTS =======*/}
          <div className="properties-details1-area sp1">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="images-area-details">
                    <SwiperSlide className="img1">
                      <img
                        src={property?.images[0] ?? "/assets/img/all-images/properties/property-img29.png"}
                        alt="EazyProp"
                      />
                    </SwiperSlide>
                    <div className="space40" />
                    <div className="content-area">
                      <div className="content heading2">
                        <h2>{property?.title}</h2>
                        <ul>
                          <li>
                            <Link href="/#">{`${property?.beforePriceLabel}${property?.price}`}</Link>
                          </li>
                          <li>
                            <Link href="/#">{`/${property?.propertyStatus}`}</Link>
                          </li>
                        </ul>
                      </div>
                      <div className="list-area">
                        <div className="list">
                          <ul>
                            <li>Features:</li>
                            <li>
                              <Link href="/#">
                                <img
                                  src="/assets/img/icons/bed1.svg"
                                  alt="EazyProp"
                                />
                                x20 <span> | </span>
                              </Link>
                            </li>
                            <li>
                              <Link href="/#">
                                <img
                                  src="/assets/img/icons/bath1.svg"
                                  alt="EazyProp"
                                />
                                x30 <span> | </span>
                              </Link>
                            </li>
                            <li>
                              <Link href="/#">
                                <img
                                  src="/assets/img/icons/sqare1.svg"
                                  alt="EazyProp"
                                />
                                1200 sq
                              </Link>
                            </li>
                          </ul>
                          <ul className="m-0">
                            <li>Location:</li>
                            <li>
                              <Link href="/#">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995L16.9497 15.9497ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z" />
                                </svg>{" "}
                                {`${property?.address}, ${property?.state} ${property?.country}`}
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <ul className="share">
                          <li>
                            <Link href="/#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z" />
                              </svg>
                            </Link>
                          </li>
                          <li>
                            <Link href="/#">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"></path>
                              </svg>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="space48" />
                  <Swiper
                    {...swiperOptions}
                    className="property-details-slider owl-carousel"
                  >
                    {
                      property?.images.map((image:string, index:number) => (
                        <SwiperSlide className="img1 imgg" key={index}>
                          <img
                            src={image}
                            alt="EazyProp"
                          />
                        </SwiperSlide>
                      ))
                    }
                    
                   
                  </Swiper>
                  <div className="space80" />
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="details-siderbar">
                        <h3>Play Video</h3>
                        <div className="space32" />
                        <div className="vide-images">
                          <SwiperSlide className="img1">
                            <img
                              src={property.video == null? "/assets/img/all-images/properties/property-img33.png" : property.video[0]}
                              alt="EazyProp"
                            />
                          </SwiperSlide>
                          <VideoPopup />
                        </div>
                        <div className="space60" />
                        <h3>{property.title} Amenities</h3>
                        <div className="space12" />
                        <div className="row">
                          {
                          property?.amenities.map((item:string, index:number) => (
                              <div key={index} className="col-lg-6 col-md-6">
                              <div className="list-box">
                                <div className="text">
                                  <p><Boxes /> {" "} {item}</p>
                                </div>
                              </div>
                            </div>
                          )) 
                          }
                        </div>


                        {/* <div className="space60" /> */}
                        {/* <div className="download-box">
                          <h3>Apartment Complex File</h3>
                          <div className="space28" />
                          <div className="download">
                            <Link href="/#">
                              <span>
                                <img
                                  src="/assets/img/icons/pdf1.svg"
                                  alt="EazyProp"
                                />
                              </span>
                              Villa Document. pdf{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z" />
                              </svg>
                            </Link>
                            <Link href="/#" className="m-0">
                              <span>
                                <img
                                  src="/assets/img/icons/pdf2.svg"
                                  alt="EazyProp"
                                />
                              </span>
                              Villa Document. pdf{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z" />
                              </svg>
                            </Link>
                          </div>
                        </div> */}
                        {/* <div className="space60" />
                        <h3>Explore 360° View</h3>
                        <div className="space32" />
                        <div className="rotate-images">
                          <SwiperSlide className="img1">
                            <img
                              src="/assets/img/all-images/properties/property-img34.png"
                              alt="EazyProp"
                            />
                          </SwiperSlide>
                          <Link href="/#">
                            <img
                              src="/assets/img/icons/rotate.svg"
                              alt="EazyProp"
                            />
                          </Link>
                        </div> */}


                        <div className="space60" />
                        <h3>Map Locations</h3>
                        <div className="space32" />
                        <div className="map-section">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4506257.120552435!2d88.67021924228865!3d21.954385721237916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1704088968016!5m2!1sen!2sbd"
                            width={600}
                            height={450}
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <div className="space12" />
                          <div className="list">
                            <ul>
                              <li>
                                <span>Address:</span>
                                <div>{property?.address}</div>
                              </li>
                              <li>
                                <span>City:</span>
                                <div>{property?.state}</div>
                              </li>
                            </ul>
                            <ul className="m-0 ">
                              <li>
                                <span>Postal Code:</span>
                                <div>{property?.zipCode}</div>
                              </li>
                              <li>
                                <span>Area Name:</span>
                                <div>{property?.state}</div>
                              </li>
                            </ul>
                          </div>
                        </div>


                        {/* <div className="space60" />
                        <h3>Floor Plans</h3>
                        <div className="space32" />
                        <div className="accordion-area">
                          <div
                            className="accordion accordion-flush"
                            id="accordionFlushExample"
                          >
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#flush-collapseOne"
                                  aria-expanded="false"
                                  aria-controls="flush-collapseOne"
                                >
                                  <span>First Floor</span>
                                  <span className="list">
                                    <span>
                                      <img
                                        src="/assets/img/icons/bed1.svg"
                                        alt="EazyProp"
                                      />
                                      x20
                                    </span>
                                    <span>
                                      <img
                                        src="/assets/img/icons/bath1.svg"
                                        alt="EazyProp"
                                      />
                                      x30
                                    </span>
                                    <span>
                                      <img
                                        src="/assets/img/icons/sqare1.svg"
                                        alt="EazyProp"
                                      />
                                      1200 sq
                                    </span>
                                  </span>
                                </button>
                              </h2>
                              <div
                                id="flush-collapseOne"
                                className="accordion-collapse collapse"
                                data-bs-parent="#accordionFlushExample"
                              >
                                <div className="accordion-body">
                                  <SwiperSlide className="img1">
                                    <img
                                      src="/assets/img/all-images/others/map-img1.png"
                                      alt="EazyProp"
                                    />
                                  </SwiperSlide>
                                </div>
                              </div>
                            </div>
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#flush-collapseTwo"
                                  aria-expanded="false"
                                  aria-controls="flush-collapseTwo"
                                >
                                  <span>Second Floor</span>
                                  <span className="list">
                                    <span>
                                      <img
                                        src="/assets/img/icons/bed1.svg"
                                        alt="EazyProp"
                                      />
                                      x20
                                    </span>
                                    <span>
                                      <img
                                        src="/assets/img/icons/bath1.svg"
                                        alt="EazyProp"
                                      />
                                      x30
                                    </span>
                                    <span>
                                      <img
                                        src="/assets/img/icons/sqare1.svg"
                                        alt="EazyProp"
                                      />
                                      1200 sq
                                    </span>
                                  </span>
                                </button>
                              </h2>
                              <div
                                id="flush-collapseTwo"
                                className="accordion-collapse collapse"
                                data-bs-parent="#accordionFlushExample"
                              >
                                <div className="accordion-body">
                                  <SwiperSlide className="img1">
                                    <img
                                      src="/assets/img/all-images/others/map-img1.png"
                                      alt="EazyProp"
                                    />
                                  </SwiperSlide>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}


                        <div className="space60" />
                        <h3>Comments ({property?.comments?.length})</h3>
                        
                        {isLoading? ( <p className="text-center">Loading Comments, Please wait...</p> )
                        : error? ( <p className="text-center">Error Loading Comments</p> )  
                        :( property?.comments.map((comment:any, index:number) => (
                          <div key={index}>
                            <div className="space30" />
                            <div className="comments-boxarea">
                              <div className="comments-boxes">
                                <div className="comments-auhtor-box">
                                  <div className="img3 img-placeholder img-p">
                                    <User className="user-icon"/>
                                    {/* <img
                                      src="/assets/img/all-images/blog/blog-img17.png"
                                      alt="EazyProp"
                                    /> */}
                                  </div>
                                  <div className="content">
                                    <Link href="/#" className="date">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z" />
                                      </svg>{" "}
                                      <ShowTimeAgo dateAndTime={comment.createdAt}/>
                                    </Link>
                                    <Link href="/team" className="name">
                                      {comment.name}
                                    </Link>
                                  </div>
                                </div>
                                {/* <Link href="/#" className="reply">
                                  <i className="fa-solid fa-reply" /> Reply
                                </Link> */}
                              </div>
                              <div className="space16" />
                              <p>
                                {comment.message}
                              </p>
                            </div>
                          </div>
                          ))
                        )}



                        <div className="space60" />
                        <h3>Leave A Comment Below</h3>
                        <div className="space32" />
                        <div className="contact-boxarea">
                          <h3>Send Comment</h3>
                          <div className="space8" />
                          <form onSubmit={handleCommentSubmit}>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="input-area">
                                <input onChange={handleCommentOnChange} value={commentData.name} name="name" type="text" placeholder="Your Name" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="input-area">
                                <input
                                  onChange={handleCommentOnChange} 
                                  value={commentData.email}  
                                  name="email"          
                                  type="email"
                                  placeholder="Email Address"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="input-area">
                                <textarea onChange={handleCommentOnChange} value={commentData.message} name="message" placeholder="Your Message" />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="space4" />
                              <div className="input-area">
                                <button type="submit" className="theme-btn1" disabled={commentLoading}>
                                 {!commentLoading? 
                                 (<div>
                                  Find Your Dream Home {" "}
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
                                  </div>) : (
                                    <div className="d-flex justify-content-center align-items-center">
                                      <p className="me-4"> <LoadingSpinner /> </p> <p className="mt-2">Please wait...</p>
                                    </div>
                                  )} 
                                </button>
                              </div>
                            </div>
                          </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="all-side-details">
                        <div className="details-siderbar2">
                          <h4>Contact Seller</h4>
                          <div className="space24" />
                          <div className="personal-info">
                            <div className="img-placeholder">
                            {!property?.agent.image? 
                            ( <User className="user-icon" /> )
                            : ( <img
                              src={property?.agent.image}
                              alt="EazyProp"
                            /> )
                            }
                            </div>
                            <div className="content">
                              <Link href="/#">{property?.agent.name}</Link>
                              <Link href={`/mailto:${property?.agent.email}`}>
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z" />
                                </svg>
                                {property?.agent.email}
                              </Link>
                              <Link href="/tel:(234)345-4574">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z"></path>
                                </svg>
                                {property?.agent.contactNumber}
                              </Link>
                            </div>
                          </div>
                          <div className="space10" />
                          <form onSubmit={handleSubmitMessage}>
                          <div className="input-area">
                            <input onChange={handleMessageOnChange} value={agentMessage.fullName} name="fullName" type="text" placeholder="Full Name" />
                          </div>
                          <div className="input-area">
                            <input onChange={handleMessageOnChange} value={agentMessage.phoneNumber} name="phoneNumber" type="text" placeholder="Phone Number" />
                          </div>
                          <div className="input-area">
                            <input onChange={handleMessageOnChange} value={agentMessage.email} name="email" type="email" placeholder="Email Address" />
                          </div>
                          <div className="input-area">
                            <textarea onChange={handleMessageOnChange} value={agentMessage.message} name="message" placeholder="Your Message" />
                          </div>
                          <div className="input-area">
                            <button disabled={messageLoading} type="submit" className="theme-btn1">
                              {!messageLoading? 
                              (<div>
                                Find Properties {" "}
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
                                </div>) : (
                                  <div className="d-flex justify-content-center align-items-center">
                                    <p className="me-4"> <LoadingSpinner /> </p> <p className="mt-2">Please wait...</p>
                                  </div>
                              )}                        
                            </button>
                          </div>
                          </form>
                        </div>

                        {/* <div className="space30" />
                        <div className="sidebar1-area">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-home1-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-home1"
                                type="button"
                                role="tab"
                                aria-controls="pills-home1"
                                aria-selected="true"
                              >
                                For Rent
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link m-0"
                                id="pills-profile1-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-profile1"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile1"
                                aria-selected="false"
                              >
                                For Sale
                              </button>
                            </li>
                          </ul>
                          <div className="tab-content" id="pills-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="pills-home1"
                              role="tabpanel"
                              aria-labelledby="pills-home1-tab"
                              tabIndex={0}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="input-area">
                                    <input
                                      type="text"
                                      placeholder="Types keyword"
                                    />
                                  </div>
                                  <div className="input-area">
                                    <input type="text" placeholder="Address" />
                                  </div>
                                  <div className="input-area m-0">
                                    <select
                                      name="country"
                                      id="country2"
                                      className="country-area nice-select"
                                    >
                                      <option
                                        value={1}
                                        data-display="All Cities"
                                      >
                                        All Cities
                                      </option>
                                      <option>Belgium</option>
                                      <option>Brezil</option>
                                      <option>Argentina</option>
                                      <option>Bangladesh</option>
                                      <option>Germany</option>
                                    </select>
                                  </div>
                                  <div className="input-area">
                                    <select
                                      name="country"
                                      id="country3"
                                      className="country-area nice-select"
                                    >
                                      <option value={1} data-display="Bedrooms">
                                        Bedrooms
                                      </option>
                                      <option>01</option>
                                      <option>02</option>
                                      <option>03</option>
                                      <option>04</option>
                                      <option>05</option>
                                    </select>
                                  </div>
                                  <div className="input-area">
                                    <select
                                      name="country"
                                      id="country4"
                                      className="country-area nice-select"
                                    >
                                      <option
                                        value={1}
                                        data-display="Bathrooms"
                                      >
                                        Bathrooms
                                      </option>
                                      <option>01</option>
                                      <option>02</option>
                                      <option>03</option>
                                      <option>04</option>
                                      <option>05</option>
                                    </select>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Min Price"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Max Price"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Min Size"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Max Size"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <h3 />
                                </div>
                              </div>
                              <div className="space32" />
                              <h3>Amenities</h3>
                              <div className="space12" />
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Air Condition{" "}
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Selling Height{" "}
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Heating</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Window Type
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Elevator</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Fire Place</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Pet Friendly
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Parking</span>
                                    </label>
                                  </fieldset>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Disabled Access
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Floor</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Renovation</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Cable TV</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Furnishing</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Garden</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Wifi</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Intercom</span>
                                    </label>
                                  </fieldset>
                                  <div className="space32" />
                                </div>
                                <div className="col-lg-12">
                                  <div className="btn-area1">
                                    <Link href="/" className="theme-btn1">
                                      Find Your Dream Property{" "}
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
                            <div
                              className="tab-pane fade"
                              id="pills-profile1"
                              role="tabpanel"
                              aria-labelledby="pills-profile1-tab"
                              tabIndex={0}
                            >
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="input-area">
                                    <input
                                      type="text"
                                      placeholder="Types keyword"
                                    />
                                  </div>
                                  <div className="input-area">
                                    <input type="text" placeholder="Address" />
                                  </div>
                                  <div className="input-area m-0">
                                    <select
                                      name="country"
                                      id="country5"
                                      className="country-area nice-select"
                                    >
                                      <option
                                        value={1}
                                        data-display="All Cities"
                                      >
                                        All Cities
                                      </option>
                                      <option>Belgium</option>
                                      <option>Brezil</option>
                                      <option>Argentina</option>
                                      <option>Bangladesh</option>
                                      <option>Germany</option>
                                    </select>
                                  </div>
                                  <div className="input-area">
                                    <select
                                      name="country"
                                      id="country6"
                                      className="country-area nice-select"
                                    >
                                      <option value={1} data-display="Bedrooms">
                                        Bedrooms
                                      </option>
                                      <option>01</option>
                                      <option>02</option>
                                      <option>03</option>
                                      <option>04</option>
                                      <option>05</option>
                                    </select>
                                  </div>
                                  <div className="input-area">
                                    <select
                                      name="country"
                                      id="country7"
                                      className="country-area nice-select"
                                    >
                                      <option
                                        value={1}
                                        data-display="Bathrooms"
                                      >
                                        Bathrooms
                                      </option>
                                      <option>01</option>
                                      <option>02</option>
                                      <option>03</option>
                                      <option>04</option>
                                      <option>05</option>
                                    </select>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Min Price"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Max Price"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Min Size"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-6">
                                      <div className="input-area">
                                        <input
                                          type="text"
                                          placeholder="Max Size"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <h3 />
                                </div>
                              </div>
                              <div className="space32" />
                              <h3>Amenities</h3>
                              <div className="space12" />
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Air Condition{" "}
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Selling Height{" "}
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Heating</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Window Type
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Elevator</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Fire Place</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Pet Friendly
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Parking</span>
                                    </label>
                                  </fieldset>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">
                                        Disabled Access
                                      </span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Floor</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Renovation</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Cable TV</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Furnishing</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Garden</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Wifi</span>
                                    </label>
                                  </fieldset>
                                  <fieldset className="checkbox-item style-1">
                                    <label>
                                      <input type="checkbox" />
                                      <span className="btn-checkbox" />
                                      <span className="text-4">Intercom</span>
                                    </label>
                                  </fieldset>
                                  <div className="space32" />
                                </div>
                                <div className="col-lg-12">
                                  <div className="btn-area1">
                                    <Link
                                      href="/contact"
                                      className="theme-btn1"
                                    >
                                      Find Your Dream Property{" "}
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="propoerties-boxes-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="heading1 space-margin60">
                    <h2>Our Latest Properties</h2>
                    <div className="btn-area1">
                      <Link
                        href="/property-halfmap-grid"
                        className="theme-btn1"
                      >
                        See All Properties{" "}
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
              <div className="row">
                <div className="col-lg-12">
                  <Swiper
                    {...swiperOptions2}
                    className="single-slider-area owl-carousel"
                  >
                  
                  {propertyLoading? ( <p>Loading, Please wait...</p> )
                  : propertyError? ( <p>Error loading Properties</p> )
                  :(allProperty?.properties.map((_property:any, index:number) => (
                    <SwiperSlide key={index} className="property-boxarea">
                      <Link href={`/property-details-v1?id=${_property._id}`}>
                        <div className="img1 image-anime">
                          <img
                            src={_property.images[0]}
                            alt="EazyProp"
                          />
                        </div>
                      </Link>
                      <div className="category-list">
                        <ul>
                          <li>
                            <Link href={`/property-details-v1?id=${_property._id}`}>Featured</Link>
                          </li>
                          <li>
                            <Link href={`/property-details-v1?id=${_property._id}`}>For Sale</Link>
                          </li>
                        </ul>
                      </div>
                      <div className="content-area">
                        <Link href={`/property-details-v1?id=${_property._id}`}>
                          {_property.title}
                        </Link>
                        <div className="space18" />
                        <p>{_property.address}, {_property.state}, {_property.country}</p>
                        <div className="space24" />
                        <ul>
                          <li>
                            <Link href="/#">
                              <img
                                src="/assets/img/icons/bed1.svg"
                                alt="EazyProp"
                              />
                              x{_property.bedrooms}
                            </Link>
                          </li>
                          <li>
                            <Link href="/#">
                              <img
                                src="/assets/img/icons/bath1.svg"
                                alt="EazyProp"
                              />
                              x{_property.bathrooms}
                            </Link>
                          </li>
                          <li>
                            <Link href="/#">
                              <img
                                src="/assets/img/icons/sqare1.svg"
                                alt="EazyProp"
                              />
                              {_property.size} sq
                            </Link>
                          </li>
                        </ul>
                        <div className="btn-area">
                          <Link href="/#" className="nm-btn">
                            ${_property.price}
                          </Link>
                          <Link href="#" className="heart">
                            <img
                              src="/assets/img/icons/heart1.svg"
                              alt="EazyProp"
                              className="heart1"
                            />{" "}
                            <img
                              src="/assets/img/icons/heart2.svg"
                              alt="EazyProp"
                              className="heart2"
                            />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  )))}

                    
                  </Swiper>
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
                          <Link href="/contact" className="theme-btn1">
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
        )
        }
      </Layout>
    </>
  );
}
