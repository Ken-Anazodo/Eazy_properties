"use client";

import LongBtn from "@/components/btns/longBtn";
import React from "react";
import "/public/styles/css/auth.css";
import { useSearchParams } from "next/navigation";

const page = () => {
  const params = useSearchParams();
  const email = params?.get("email");

  return (
    <div className="container-fluid">
      <main className="row">
        <div className="col w-100 d-flex justify-content-center align-items-center notify-cont">
          <div className="notify-item">
            <p className="notify-head text-center">Reset Password Request</p>
            <p className="notify-body text-center">
              Please check for your email: {email} for verification to continue
              with Reset Password. The link provided will be valid for 1 hour.
              If you can't see the email, please check your spam folder.
            </p>

            <div className="d-flex justify-content-center align-items-center w-100">
              <LongBtn btnStyle="btnColor1" btnName="Back to Log In" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
