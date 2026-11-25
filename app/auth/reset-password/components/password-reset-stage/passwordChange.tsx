import ShortBtn from "@/components/btns/shortBtn";
import { useUserResetPasswordMutation } from "@/services/userAuthApi";
import React, { useState, useEffect } from "react";
import { showToast } from "@/utils/toastUtils";
import { useRouter, useSearchParams } from "next/navigation";

const PasswordChange = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userRequestPasswordReset, { isLoading, isSuccess }] =
    useUserResetPasswordMutation();
  const token = searchParams?.get("token") || "";
  const [formInput, setFormInput] = useState({
    newPassword: "",
    confirmPassword: "",
    token: token,
  });

  const getPasswordAndToken = (event: any) => {
    const { name, value } = event.currentTarget;

    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitPassword = async (event: any) => {
    event.preventDefault();

    console.log(token);

    setFormInput((prev) => ({
      ...prev,
      token: token,
    }));

    if (!formInput.newPassword || !formInput.confirmPassword)
      showToast.error("Please enter both Password and Confirm Password");

    if (formInput.newPassword != formInput.confirmPassword) {
      showToast.error("Password and Confirm Password is not a match");
    }

    try {
      await userRequestPasswordReset(formInput).unwrap();
    } catch (error: any) {
      showToast.error(error?.data.message);
      console.log(error?.data.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace("/dashboard");
    }
  }, [isSuccess, router]);

  return (
    <div>
      <div className="mb-3">
        <input
          type="password"
          name="newPassword"
          onChange={getPasswordAndToken}
          value={formInput.newPassword}
          id="password"
          className="log login-input"
          autoComplete="current-password"
          placeholder="New Password *"
        />
        <input
          type="password"
          name="confirmPassword"
          onChange={getPasswordAndToken}
          value={formInput.confirmPassword}
          id="confirmPassword"
          className="log login-input"
          autoComplete="current-password"
          placeholder="Confirm Password *"
        />
      </div>

      <div className="w-100 d-flex justify-content-end align-items-center">
        <ShortBtn
          btnName={isLoading ? "Please wait..." : "Submit"}
          btnStyle="btnColor1"
          handleClick={submitPassword}
        />
      </div>
    </div>
  );
};

export default PasswordChange;
