"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../styles/styles.css";
import { showToast } from "@/utils/toastUtils";
import { setupListeners } from "@reduxjs/toolkit/query";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import CryptoJS from "crypto-js";

const PaystackCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const params = useSearchParams();
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = params?.get("reference");
      setStatus("Processing payment...");

      const encryptedToken = localStorage.getItem("token");
      if (encryptedToken) {
        try {
          // Decrypt the token
          const bytes = CryptoJS.AES.decrypt(
            encryptedToken,
            process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key"
          );
          const token = bytes.toString(CryptoJS.enc.Utf8);

          if (reference) {
            const response = await fetch(`${baseUrl}api/subscription/verify`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ reference }),
            });

            if (!response.ok) {
              throw new Error("Failed to verify payment");
            }

            const data = await response.json();
            setResponse(data.subscription);
            showToast.success(data?.message);
            setStatus(data.message);

            console.log(data);
          }
        } catch (error: any) {
          showToast.error(
            error?.message || "An error occurred during payment verification."
          );
          setStatus("error");
        }
      } else {
        showToast.error("No token found. Please log in again.");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [params]);

  return (
    <div className="paystack-callback min-h-screen">
      <div
        className="min-h-screen d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f8f9fa", height: "100vh" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 col-lg-7 col-xl-5 col-12 col-sm-12 col-xs-12 ">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body text-center p-5">
                  {/* Success Icon */}
                  <div className="mb-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded"
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#073b3a",
                        color: "white",
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className="mb-3"
                    style={{
                      color: "#1f2937",
                      fontWeight: "600",
                      fontSize: "1.75rem",
                    }}
                  >
                    {/* Payment  */}
                    {status === "success" ? "completed" : status}
                  </h2>

                  {/* Order Number */}
                  <div
                    className="d-flex align-items-center justify-content-center mb-4"
                    style={{ color: "#6b7280" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="me-2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    <span style={{ fontSize: "0.9rem" }}>
                      Order number # {response?.plan || "N/A"}
                    </span>
                  </div>

                  {/* Transaction Details Header */}
                  <div className="text-start mb-3">
                    <h5
                      style={{
                        color: "#374151",
                        fontWeight: "500",
                        fontSize: "1.1rem",
                      }}
                    >
                      Transaction details
                    </h5>
                  </div>

                  {/* Transaction Details Table */}
                  <div className="text-start mb-4">
                    <div
                      className="row mb-3 py-2"
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <div className="col-6">
                        <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                          Date
                        </span>
                      </div>
                      <div className="col-6 text-end">
                        <span style={{ color: "#374151", fontSize: "0.95rem" }}>
                          {response?.createdAt
                            ? new Date(response?.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div
                      className="row mb-3 py-2"
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <div className="col-6">
                        <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                          Payment Method
                        </span>
                      </div>
                      <div className="col-6 text-end">
                        <span style={{ color: "#374151", fontSize: "0.95rem" }}>
                          PayStack
                        </span>
                      </div>
                    </div>

                    <div
                      className="row mb-3 py-2"
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <div className="col-6">
                        <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                          Total
                        </span>
                      </div>
                      <div className="col-6 text-end">
                        <span
                          style={{
                            color: "#374151",
                            fontSize: "0.95rem",
                            fontWeight: "500",
                          }}
                        >
                          ₦{response?.planAmount || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-3 py-2">
                      <div className="col-6">
                        <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                          Email
                        </span>
                      </div>
                      <div className="col-6 text-end">
                        <span style={{ color: "#374151", fontSize: "0.95rem" }}>
                          {response?.userEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Invoice Button */}
                  <button
                    disabled={status == "Payment in progress..."}
                    className="btn w-100 text-white mb-4"
                    style={{
                      backgroundColor: "#073b3a",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => router.push("/dashboard")}
                  >
                    {status == "Payment in progress..."
                      ? "Please wait...."
                      : "Proceed to Dashboard"}
                  </button>

                  {/* Company Information */}
                  <div
                    className="text-center"
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                    }}
                  >
                    <div className="mb-1">
                      Hello Technologies, 1500 Oceanview Blvd, Suite 300
                    </div>
                    <div className="mb-2">
                      San Francisco, CA 94123 - United States
                    </div>
                    <div>
                      <a
                        href="mailto:hello@eazyprop.com"
                        style={{ color: "#073b3a", textDecoration: "none" }}
                      >
                        hello@eazyprop.com
                      </a>
                      <span className="mx-2">•</span>
                      <span>+89 45 21 85 27</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaystackCallback;
