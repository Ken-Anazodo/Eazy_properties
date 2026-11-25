"use client"

import Layout from "@/components/layout/Layout";
import { showToast } from "@/utils/toastUtils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import "/public/styles/css/main.css"

interface propertyDetailsType {
  images: string[],
  fullName: string,
  description: string,
  address: string,
  zipCode: string,
  country: string,
  state: string,
  neighborhood: string,
  location: string
}

interface propertyPriceType {
  price: string,
  unitPrice: string,
  beforePriceLabel: string,
  afterPriceLabel: string
}

interface additionalInfoType {
  propertyType: string,
  propertyStatus: string,
  propertyLabel: string,
  size: string,
  landArea: string,
  propertyId: string,
  rooms: string,
  bedrooms: string,
  bathrooms: string,
  garages: string,
  garageSize: string,
  yearBuilt: string,
  amenities: string[]
}

interface virtualTourType {
  virtualTourTypes: string[],
  description: string,
  videos: string
}

interface floorPlanDataType {
  floorName: string,
  floorPrice: string,
  pricePostfix: string,
  floorSize: string,
  sizePostfix: string,
  bedrooms: string,
  bathrooms: string,
  image: string,
  description: string
}

const defaultValue = {
  id: 161,
  name: "Nigeria",
  iso3: "NGA",
  iso2: "NG",
  numeric_code: "566",
  phone_code: "234",
  capital: "Abuja",
  currency: "NGN",
  currency_name: "Nigerian naira",
  currency_symbol: "₦",
  tld: ".ng",
  native: "Nigeria",
  region: "Africa",
  subregion: "Western Africa",
  latitude: "10.00000000",
  longitude: "8.00000000",
  emoji: "🇳🇬",
  hasStates: true,
};

export default function AddProperty() {

  // States
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageName, setImageName] = useState("");
  const [country, setCountry] = useState<any | null>(defaultValue);
  const [currentState, setCurrentState] = useState<any | null>("");
  const [propertyDetails, setPropertyDetails] = useState<propertyDetailsType>({
    images: [],
    fullName: "",
    description: "",
    address: "",
    zipCode: "",
    country: "",
    state: "",
    neighborhood: "",
    location: ""
  });

  const [propertyPriceDetails, setPropertyPriceDetails] = useState<propertyPriceType>({
    price: "",
    unitPrice: "",
    beforePriceLabel: "",
    afterPriceLabel: ""
  });

  const [additionalInfoDetails, setAdditionalInfoDetails] = useState<additionalInfoType>({
    propertyType: "",
    propertyStatus: "",
    propertyLabel: "",
    size: "",
    landArea: "",
    propertyId: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    garages: "",
    garageSize: "",
    yearBuilt: "",
    amenities: []
  });

  const [virtualTour, setVirtualTour] = useState<virtualTourType>({
    virtualTourTypes: [],
    description: "",
    videos: ""
  });

  const [floorPlanData, setFloorPlanData] = useState<floorPlanDataType>({
    floorName: "",
    floorPrice: "",
    pricePostfix: "",
    floorSize: "",
    sizePostfix: "",
    bedrooms: "",
    bathrooms: "",
    image: "",
    description: ""
  });

// Agent Information
  // const [agentInfo, setAgentInfo] = useState<string[]>([]);


  const getCloudImageNameForDisplay = (fileName: string) => {
    setImageName(fileName);
  };

  // Image Upload Processing
  const optimizeImage = (url: string) => {
    const [baseUrl, fileName] = url.split("/upload/");
    getCloudImageNameForDisplay(fileName);
    return `${baseUrl}/upload/c_scale,w_auto,q_auto,f_auto/${fileName}`;
  };


  const uploadImage = async(image:any) => {

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME ?? "";
    const preset = process.env.NEXT_PUBLIC_PRESET ?? "";
    const fileData = new FormData();
    fileData.append("file", image);
    fileData.append("upload_preset", preset);
    fileData.append("cloud_name", cloudName);

    try {
      const imgResp = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: fileData,
        }
      );

      const result = await imgResp.json();
      console.log(result)

      if (result?.secure_url) {
        const optimizedImg = optimizeImage(result?.secure_url);

        return optimizedImg;

      } else {
        console.error("Upload failed:", result);
        showToast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      showToast.error("Image upload failed. Please try again.");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  }


  const handleSelectedFilesForPropDetails = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!files) return;

    setUploading(true);
    const imageFiles = Array.from(files);

    try{
      const uploadedUrls = await Promise.all(
        imageFiles.map((image) => uploadImage(image))
      );

      const validUrls = uploadedUrls.filter((url): url is string => Boolean(url));

      setPropertyDetails(prev => ({
        ...prev,
        images: [...prev.images, ...validUrls]
      }))
    } finally {
      setUploading(false);
    }
  };




// Handle Property Details
  const handlePropertyDetailsInput = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.currentTarget;
    setPropertyDetails(prev => ({
      ...prev,
      [name]: value,
      country: country?.name || "",
      state: currentState.name || ""
    }))

    console.log(propertyDetails)
  }



// Handle Property Price Details
  const handlePropertyPriceInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.currentTarget;
    setPropertyPriceDetails(prev => ({
      ...prev,
      [name]: value,
    }))

    console.log(propertyPriceDetails)
  }


// Handle Additional Information Details
  const handleAdditionalInfoDetails = (e:any) => {
    const {name, value, checked, type} = e.currentTarget;

    if (type === "checkbox"){
      setAdditionalInfoDetails(prev => ({
        ...prev,
        amenities: checked? [...prev.amenities, value] : prev.amenities.filter(item => item !== value)
      }))
    }else{
      setAdditionalInfoDetails(prev => ({
        ...prev,
        [name]: value
      }))
    }
    console.log(additionalInfoDetails)
  }


// Handle Virtual Tour Details
const handleTourData = (e:any) => {
  const {type, checked, name, value} = e.currentTarget;
  if (type === "checkbox"){
    setVirtualTour(prev => ({
      ...prev,
      virtualTourTypes: checked? [...prev.virtualTourTypes, value] : prev.virtualTourTypes.filter(item => item !== value)
    }))
  } else {
    setVirtualTour(prev => ({
      ...prev,
      [name]: value
    }))
  }
  console.log(virtualTour)
}



const handleFloorPlanData = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const {name, value} = e.currentTarget;
  setFloorPlanData(prev => ({
    ...prev,
    [name]: value
  }))
}



const handleFloorPlanImage = async(e:React.ChangeEvent<HTMLInputElement>) => {
  const { files } = e.currentTarget;
  let file = files?.[0];
  if (!file) return;

  setUploading(true);

  try{
    const uploadedUrl = await uploadImage(file);

    if (uploadedUrl) {
      setFloorPlanData(prev => ({
        ...prev,
        image: uploadedUrl
      }))
    }
  }catch(error:any){
    showToast.error(error)
    console.log("Upload failed:", error)
  }finally{
    setUploading(false);
  } 
}

console.log(floorPlanData)


// const handleAgentInfo = (e:React.ChangeEvent<HTMLInputElement>) => {
//   const {checked, value} = e.currentTarget

//   setAgentInfo((prev) => {
//     if (checked) {
//       return [...prev, value]
//     }else {
//       return prev.filter(item => item !== value)
//     }
//   })

//   console.log(agentInfo)
// }
  

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
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
                        <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                      </svg>{" "}
                      Add Property
                    </Link>
                    <div className="space24" />
                    <h1>Add Property</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*===== HERO AREA ENDS =======*/}
          {/*===== DASHBOARD AREA STARTS =======*/}
          <div className="add-property-section sp1">
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <div className="heading1">
                    <h2>Add Property</h2>
                    <div className="space32" />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="property-main-boxarea">
                    <h3>Upload Media</h3>
                    <div className="space38" />
                    <div className="box-uploadfile text-center">
                      <div className="uploadfile">
                        <div className="btn-upload theme-btn1 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                          </svg>
                          Select Property Photos
                          <input type="file" className="ip-file" multiple onChange={handleSelectedFilesForPropDetails}/>
                        </div>
                        <p className="file-name fw-5">
                          or drag photos here <br />
                          <span>(Up to 10 photos)</span>
                        </p>
                      </div>
                      <div className="space20" />
                      <div className="box-img-upload">

                        {propertyDetails.images.map((images:string, index:number) => (
                        <div key={index} className="item-upload file-delete" 
                             style={{
                              backgroundImage: `url(${images})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              position: "relative",}}>
                          <span className="remove-file">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                            </svg>
                          </span>
                        </div>
                        ))}
                        
                      </div>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Property Details</h3>
                    <div className="space32" />
                    <div className="input-area">
                      <h5>Full Name*</h5>
                      <div className="space16" />
                      <input type="text" placeholder="Property Name" name="fullName" onChange={handlePropertyDetailsInput} value={propertyDetails.fullName}/>
                    </div>
                    <div className="space28" />
                    <div className="input-area">
                      <h5>Description</h5>
                      <div className="space16" />
                      <textarea placeholder="Property Description" name="description" onChange={handlePropertyDetailsInput} value={propertyDetails.description}/>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Full Address*</h5>
                          <div className="space16" />
                          <input
                            type="text"
                            placeholder="Property Full Address*"
                            name="address" 
                            onChange={handlePropertyDetailsInput}
                            value={propertyDetails.address}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Zip Code*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Property Zip Code" name="zipCode" onChange={handlePropertyDetailsInput} value={propertyDetails.zipCode}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 country-slct">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Country*</h5>
                          <div className="space16" />
                          <div className="">
                          <CountrySelect
                            containerClassName="log login-input"
                            defaultValue={country.name}
                            onChange={(_country) => setCountry(_country)}
                            placeHolder="Select Country"
                          />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 state-slct">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Province/State*</h5>
                          <div className="space16" />
                          <div>
                            <StateSelect
                                countryid={country?.id}
                                containerClassName="log login-input"
                                onChange={(_state) => setCurrentState(_state)}
                                placeHolder="Select State"
                              />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Neighborhood:</h5>
                          <div className="space16" />
                          <input type="text" placeholder="None" name="neighborhood" onChange={handlePropertyDetailsInput} value={propertyDetails.neighborhood}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Location*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Property Zip Code" name="location" onChange={handlePropertyDetailsInput} value={propertyDetails.location}/>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="space48" />
                        <div className="mapouter">
                          <div className="gmap_canvas">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4506257.120552435!2d88.67021924228865!3d21.954385721237916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1704088968016!5m2!1sen!2sbd"
                              width={600}
                              height={450}
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Property Price</h3>
                    <div className="space4" />
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Property Price*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Price" name="price" onChange={handlePropertyPriceInput} value={propertyPriceDetails.price}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Unit Price*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Price" name="unitPrice" onChange={handlePropertyPriceInput} value={propertyPriceDetails.unitPrice}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Before Price Label*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Price" name="beforePriceLabel" onChange={handlePropertyPriceInput} value={propertyPriceDetails.beforePriceLabel}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>After Price Label*</h5>
                          <div className="space16" />
                          <input type="text" placeholder="Price" name="afterPriceLabel" onChange={handlePropertyPriceInput} value={propertyPriceDetails.afterPriceLabel}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Additional Information</h3>
                    <div className="space4" />
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Property Type*</h5>
                          <div className="space16" />
                          <div>
                            <select className="form-select form-select-lg" name="propertyType" onChange={handleAdditionalInfoDetails} value={additionalInfoDetails.propertyType}>
                              <option value="">Choose</option>
                              <option value="villa">Villa</option>
                              <option value="studio">Studio</option>
                              <option value="park">Park</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Property Status*</h5>
                          <div className="space16" />
                          <div>
                            <select className="form-select form-select-lg" name="propertyStatus" onChange={handleAdditionalInfoDetails} value={additionalInfoDetails.propertyStatus}>
                              <option value="">Choose</option>
                              <option value="for-rent">For Rent</option>
                              <option value="for-sale">For Sale</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Property Label*</h5>
                          <div className="space16" />
                          <div>
                            <select className="form-select form-select-lg" name="propertyLabel" onChange={handleAdditionalInfoDetails} value={additionalInfoDetails.propertyLabel}>
                              <option value="">Choose</option>
                              <option value="new-listing">New Listing</option>
                              <option value="open-house">Open House</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Size (SQFT)*</h5>
                          <div className="space16" />
                          <input type="text" name="size" onChange={handleAdditionalInfoDetails} placeholder="Size" value={additionalInfoDetails.size}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Land Area (SQFT)*</h5>
                          <div className="space16" />
                          <input type="text" name="landArea" onChange={handleAdditionalInfoDetails} placeholder="Land Area (SQFT)*" value={additionalInfoDetails.landArea}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Property ID*</h5>
                          <div className="space16" />
                          <input type="text" name="propertyId" onChange={handleAdditionalInfoDetails} placeholder="Property ID*" value={additionalInfoDetails.propertyId}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Rooms*</h5>
                          <div className="space16" />
                          <input type="text" name="rooms" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.rooms}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Bedrooms*</h5>
                          <div className="space16" />
                          <input type="text" name="bedrooms" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.bedrooms}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Bathrooms*</h5>
                          <div className="space16" />
                          <input type="text" name="bathrooms" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.bathrooms}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Garages*</h5>
                          <div className="space16" />
                          <input type="text" name="garages" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.garages}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Garages Size (SQFT)*</h5>
                          <div className="space16" />
                          <input type="text" name="garageSize" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.garageSize}/>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Year Built*</h5>
                          <div className="space16" />
                          <input type="text" name="yearBuilt" onChange={handleAdditionalInfoDetails} placeholder="#" value={additionalInfoDetails.yearBuilt}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Amenities*</h3>
                    <div className="space16" />
                    <div className="row">
                      <div className="col-lg-2 col-md-6">
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Air Condition")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Air Condition"/>                           
                            <span className="btn-checkbox" />
                            <span className="text-4">Air Condition </span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Selling Height")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Selling Height" /> 
                            <span className="btn-checkbox" />
                            <span className="text-4">Selling Height </span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Heating")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Heating"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Heating</span>
                          </label>
                        </fieldset>
                      </div>

                      <div className="col-lg-2 col-md-6">
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Window Type")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Window Type"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Window Type</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Elevator")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Elevator"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Elevator</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Fire Place")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Fire Place"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Fire Place</span>
                          </label>
                        </fieldset>
                      </div>

                      <div className="col-lg-2 col-md-6">
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Pet Friendly")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Pet Friendly"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Pet Friendly</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Parking")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Parking"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Parking</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Disabled Access")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Disabled Access"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Disabled Access</span>
                          </label>
                        </fieldset>
                      </div>

                      <div className="col-lg-2 col-md-6">
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Floor")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Floor"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Floor</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Renovation")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Renovation"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Renovation</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Cable TV")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Cable TV"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Cable TV</span>
                          </label>
                        </fieldset>
                      </div>
                      <div className="col-lg-2 col-md-6">
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Furnishing")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Furnishing"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Furnishing</span>
                          </label>
                        </fieldset>
                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Garden")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Garden"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Garden</span>
                          </label>
                        </fieldset>

                        <fieldset className="checkbox-item style-1">
                          <label>
                            <input type="checkbox" 
                                   checked={additionalInfoDetails.amenities.includes("Wifi")} 
                                   onChange={handleAdditionalInfoDetails}
                                   value="Wifi"/>
                            <span className="btn-checkbox" />
                            <span className="text-4">Wifi</span>
                          </label>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Virtual Your 360°</h3>
                    <div className="space16" />
                    <div className="radio-area">
                      <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" 
                                 checked={virtualTour.virtualTourTypes.includes("Embedded Code")}
                                 onChange={handleTourData}
                                 value="Embedded Code"/>
                          <span className="btn-checkbox" />
                          <span className="text-4">Embedded Code</span>
                        </label>
                      </fieldset>
                      {/* <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" 
                                 checked={virtualTour.virtualTourTypes.includes("Upload Image")}
                                 onChange={handleTourData}
                                 value="Upload Image"/>
                          <span className="btn-checkbox" />
                          <span className="text-4">Upload Image</span>
                        </label>
                      </fieldset> */}
                    </div>
                    <div className="input-area">
                      <div className="space28" />
                      <h5>URL</h5>
                      <div className="space16" />
                      <textarea placeholder="####" 
                                name="description"
                                onChange={handleTourData}
                                value={virtualTour.description}/>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Videos</h3>
                    <div className="space4" />
                    <div className="input-area">
                      <div className="space28" />
                      <h5>Video URL:</h5>
                      <div className="space16" />
                      <input type="text" 
                             placeholder="yourtube.com" 
                             name="videos"
                             onChange={handleTourData}
                             value={virtualTour.videos}/>
                    </div>
                  </div>
                  <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Enable Floor Plan</h3>
                    <div className="space16" />
                    {/* <div className="radio-area">
                      <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" />
                          <span className="btn-checkbox" />
                          <span className="text-4">Embedded Code</span>
                        </label>
                      </fieldset>
                      <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" />
                          <span className="btn-checkbox" />
                          <span className="text-4">Upload Image</span>
                        </label>
                      </fieldset>
                    </div> */}
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Floor Name**</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="Floor Name*" 
                                 name="floorName"
                                 value={floorPlanData.floorName}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Floor Price (Only Digits):</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="floorPrice"
                                 value={floorPlanData.floorPrice}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Price Postfix:</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="pricePostfix"
                                 value={floorPlanData.pricePostfix}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Floor Size (Only Digits):</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="floorSize"
                                 value={floorPlanData.floorSize}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Size Postfix:</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="sizePostfix"
                                 value={floorPlanData.sizePostfix}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Bedrooms:</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="bedrooms"
                                 value={floorPlanData.bedrooms}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Bathrooms:</h5>
                          <div className="space16" />
                          <input type="text" 
                                 placeholder="#" 
                                 name="bathrooms"
                                 value={floorPlanData.bathrooms}
                                 onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area">
                          <h5>Floor Image</h5>
                          <div className="space16" />
                          <div className="box-floor-img uploadfile">
                            <div className="btn-upload theme-btn1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                              </svg>
                              Choose File
                              <input type="file" 
                                     className="ip-file" 
                                     onChange={handleFloorPlanImage}
                                     accept=".jpg,.jpeg,.png"
                                     name="image"/>
                            </div>
                            <p className="file-name">
                              {imageName?  `... ${imageName.substring(10, imageName.length)}` : "Or drop file here to upload"}       
                            </p>

                            <div className="imgUploadStatus w-100 d-flex justify-content-center mt-2">
                              <a> {uploading && "uploading..."} </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="space28" />
                        <div className="input-area textarea">
                          <h5>Description: </h5>
                          <div className="space16" />
                          <textarea name="description"
                                    value={floorPlanData.description}
                                    onChange={handleFloorPlanData}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="space60" />
                  <div className="upload-main-boxarea">
                    <h3>Agent Information</h3>
                    <div className="space28" />
                    <div className="input-area">
                      <h5>Choose type agent information?</h5>
                    </div>
                    <div className="radio-area">
                      <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" 
                                 checked={agentInfo.includes("Embedded Code")}
                                 value="Embedded Code"
                                 onChange={handleAgentInfo}/>
                          <span className="btn-checkbox" />
                          <span className="text-4">Embedded Code</span>
                        </label>
                      </fieldset>
                      <fieldset className="checkbox-item style-1">
                        <label>
                          <input type="checkbox" 
                                 checked={agentInfo.includes("Upload Image")}
                                 value="Upload Image"
                                 onChange={handleAgentInfo}/>
                          <span className="btn-checkbox" />
                          <span className="text-4">Upload Image</span>
                        </label>
                      </fieldset>
                    </div>
                  </div> */}
                  <div className="space48" />
                  <div className="btn-area1 text-center">
                    <Link href="/#" className="theme-btn1">
                      Add Property{" "}
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
                    <Link href="/#" className="theme-btn1 btn2">
                      Save And Preview{" "}
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
                        <div className="btn-area text-center">
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
