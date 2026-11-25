"use client";

import React, { useEffect, useState } from "react";
import { useUserLoginMutation } from "@/services/userAuthApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LongBtn from "@/components/btns/longBtn";
import { showToast } from "@/utils/toastUtils";
import Loading from "@/app/loading";
import CryptoJS from "crypto-js";

const LoginForm = () => {
  const navigate = useRouter();
  const [userLogin, { isLoading, error, data, isSuccess }]: any =
    useUserLoginMutation();

  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleOnChange = (event: any) => {
    const { name, value } = event.currentTarget;

    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleLoginSuccess = (token: string) => {
    if (typeof window !== "undefined") {
      // Encrypt the token
      const encryptedToken = CryptoJS.AES.encrypt(
        token,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key"
      ).toString();

      // Store the encrypted token in cookies and localStorage
      localStorage.setItem("token", encryptedToken);
      document.cookie = `token=${encryptedToken}; path=/; secure; SameSite=None;`;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (typeof window !== "undefined") {
        showToast.success("Login successful");
        localStorage.setItem("userId", data?.user.id);
        handleLoginSuccess(data?.token);
      }
      navigate.push("/dashboard");
    }
  }, [isSuccess, navigate, data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (error) {
      showToast.error(error.data?.message);
      console.log(error.data?.message);
    }

    try {
      await userLogin(formInput).unwrap();

      setFormInput({
        email: "",
        password: "",
      });
    } catch (err: any) {
      showToast.error(err.error || "An error occured in Log In");
      console.log(err);
    }
  };

  return (
    <div className="loginForm-cont container-fluid w-100 rounded-5 px-3 py-4 p-md-5">
      <div className="formTitle text-capitalize">
        <p className="fs-1">Login</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-9">
        <div>
          <input
            onChange={handleOnChange}
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            className="log login-input"
            placeholder="Email *"
            value={formInput.email}
          />
        </div>

        <div>
          <input
            onChange={handleOnChange}
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            className="log login-input"
            placeholder="Password *"
            value={formInput.password}
          />
        </div>

        <div
          onClick={() => navigate.push("/auth/reset-password?page=1")}
          className="form-txt w-100 d-flex justify-content-end mt-2 cursor-pointer"
        >
          <p style={{ cursor: "pointer" }}>Forgot your password?</p>
        </div>

        <LongBtn
          btnName={isLoading ? "Logging in..." : "Login"}
          btnStyle="btnColor1"
        />

        <div className="mt-4 d-flex justify-content-center align-items-center">
          <hr className="me-lg-4" />
          <p className="logWith cursor-pointer ms-2">Or Login with</p>
          <hr className="ms-lg-4" />
        </div>

        <div className="">
          <Link href={`${baseUrl}api/auth/google`}>
            <LongBtn btnName="Google" btnStyle="btnColor2" />
          </Link>
        </div>
      </form>

      <div className="form-txt w-100 mt-3 cursor-pointer d-flex justify-content-center align-items-center">
        <p>You do not have an account?</p>
        <Link href="/auth/signup/">
          <p className="signup cursor-pointer ms-2 text-decoration-underline">
            SIGN UP
          </p>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
