'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveUserInfoPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || isSaving) return;

    const saveUserInfo = async () => {
      setIsSaving(true);
      setError("");
      try {
        const {
          id: userId,
          username,
          firstName,
          lastName,
          emailAddresses,
        } = user;

        const email = emailAddresses[0]?.emailAddress || "";
        const finalUsername =
          username ||
          (firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || email.split("@")[0]);

        console.log("Sending user data to API:", {
          userId,
          username: finalUsername,
          email,
          numberOfCourses: 0,
          courses: [],
        });

        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            username: finalUsername,
            email,
            numberOfCourses: 0,
            courses: [],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save user info");
        }

        const data = await response.json();
        console.log("Response from server:", data);
        router.push("/"); // Redirect to home page after successful data saving
      } catch (error) {
        console.error("Error saving user info:", error);
        setError("An error occurred while saving user information");
      } finally {
        setIsSaving(false);
      }
    };

    saveUserInfo();
  }, [isLoaded, isSignedIn, user, router, isSaving]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p>Saving your information...</p>
      {isSaving && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <p>Saving your information...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
