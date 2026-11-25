"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import crypto from "crypto";

const decryptToken = (encryptedToken: any) => {
  try {
    const [iv, encrypted] = encryptedToken.split(":");
    const algorithm = "aes-256-cbc";
    const key = crypto
      .createHash("sha256")
      .update(String(process.env.NEXT_PUBLIC_ENCRYPTION_KEY))
      .digest("base64")
      .substr(0, 32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
};

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      const decryptedToken = decryptToken(token);
      if (decryptedToken) {
        document.cookie = `token=${decryptedToken}; path=/; secure; samesite=none; max-age=${
          7 * 24 * 60 * 60
        }`;
        router.push("/dashboard");
      } else {
        console.error("Failed to decrypt token");
        router.push("/auth/login");
      }
    } else {
      console.error("Token not found in URL");
      router.push("/auth/login");
    }
  }, [router]);

  return <p>Authenticating...</p>;
};

export default GoogleCallback;
