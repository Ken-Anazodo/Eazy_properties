import React, { useState } from "react";
import { useUserSignUpMutation } from "@/services/userAuthApi";
import LongBtn from "@/components/btns/longBtn";
import { User } from "lucide-react";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { showToast } from "@/utils/toastUtils";

type formInputType = {
  image: string;
  state: string;
  country: string;
  password: string;
  confirmPassword: string;
};

type FormPartTwoProp = {
  setFormInput2: React.Dispatch<React.SetStateAction<formInputType>>;
  formInput2: formInputType;
  setImageName: React.Dispatch<React.SetStateAction<string>>;
  imageName: string;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
};

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

const FormPartTwo = ({
  setFormInput2,
  formInput2,
  setImageName,
  imageName,
  setUploading,
  uploading,
}: FormPartTwoProp) => {
  const [userSignUp, { isLoading }] = useUserSignUpMutation();
  const [country, setCountry] = useState<any | null>(defaultValue);
  const [currentState, setCurrentState] = useState<any | null>(null);

  const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = event.currentTarget;
    setFormInput2((prevFormInput2) => ({
      ...prevFormInput2,
      [name]: value,
      country: country?.name || "",
      state: currentState.name || "",
    }));

    const formOne = JSON.parse(localStorage.getItem("formPart1") || "");
    const allData = {
      ...formOne,
      ...formInput2,
    };
    localStorage.setItem("allData", JSON.stringify(allData));
  };

  const getCloudImageNameForDisplay = (fileName: string) => {
    setImageName(fileName);
  };

  const optimizeImage = (url: string) => {
    const [baseUrl, fileName] = url.split("/upload/");
    getCloudImageNameForDisplay(fileName);
    return `${baseUrl}/upload/c_scale,w_auto,q_auto,f_auto/${fileName}`;
  };

  const handleFileChange = async (e: any) => {
    const { files } = e.currentTarget;
    let file = files[0];

    if (!file) return;

    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME ?? "";
    const preset = process.env.NEXT_PUBLIC_PRESET ?? "";

    const fileData = new FormData();
    fileData.append("file", file);
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

      if (result?.secure_url) {
        const optimizedImg = optimizeImage(result?.secure_url);

        setFormInput2((prevFormInput2) => ({
          ...prevFormInput2,
          image: optimizedImg,
        }));

        setUploading(false);

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
  };

  return (
    <div>
      <p className="upload-desc mt-8 py-1 text-center">
        We allow .jpg .png .jpeg
      </p>
      <div className="d-flex justify-content-center align-items-center mt-2 w-100">
        <div>
          <div className="image-viewer  position-relative">
            <User className="user-icon position-absolute text-white z-2 top-50 start-50 translate-middle" />
            <div
              style={{
                backgroundImage: `url(${formInput2.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
              className="signup-img w-100 h-100 position-absolute z-1 top-0"
            >
              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            </div>
            <p className="text-white cursor-pointer">
              {formInput2.image ? "Click to Change" : "Click to upload"}
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              id="profileImg"
              name="image"
              className="img-input positon-absolute top-0 left-0 z-2 w-100 h-100 opacity-0 cursor-pointer"
            />
          </div>

          <div className="imgUploadStatus w-100 d-flex justify-content-center mt-2">
            <a> {uploading && "uploading..."} </a>
          </div>
        </div>
      </div>

      <div className="w-100 my-2 d-flex justify-content-center align-items-center">
        <a id="fileName">
          {imageName && "..."}
          {imageName.substring(10, imageName.length)}
        </a>
      </div>

      <div className="d-flex align-items-center gap-4">
        <StateSelect
          countryid={country?.id}
          containerClassName="log login-input"
          onChange={(_state) => setCurrentState(_state)}
          //   onTextChange={(_txt) => console.log(_txt)}
          //   defaultValue={currentState}
          placeHolder="Select State"
        />
        {/* <input
          type="text"
          name="state"
          onChange={handleOnchange}
          value={formInput2.state}
          id="contactNo"
          className="log login-input"
          placeholder="State *"
        /> */}

        <CountrySelect
          containerClassName="log login-input"
          defaultValue={country.name}
          onChange={(_country) => setCountry(_country)}
          //   onTextChange={(_txt) => console.log(_txt)}
          placeHolder="Select Country"
        />

        {/* <input
          type="text"
          name="country"
          onChange={handleOnchange}
          value={formInput2.country}
          id="email"
          className="log login-input"
          placeholder="Country *"
        /> */}
      </div>

      <div className="d-flex align-items-center gap-4 mb-3">
        <input
          type="password"
          name="password"
          onChange={handleOnchange}
          value={formInput2.password}
          id="password"
          className="log login-input"
          autoComplete="current-password"
          placeholder="Password *"
        />
        <input
          type="password"
          name="confirmPassword"
          onChange={handleOnchange}
          value={formInput2.confirmPassword}
          id="confirmPassword"
          className="log login-input"
          autoComplete="current-password"
          placeholder="Confirm Password *"
        />
      </div>

      <LongBtn
        btnName={isLoading ? "Please wait..." : "Sign Up"}
        btnStyle="btnColor1"
      />
    </div>
  );
};

export default FormPartTwo;
