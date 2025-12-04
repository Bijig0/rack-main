import React, { useState } from "react";
import PrivateLayout from "../../layout/Private";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { CustomInput } from "../../shared/components/allinput";
import CreditCardImg from "../../assets/images/icons/Credit-card.svg";
import CardImg from "../../assets/images/icons/card.svg";
import CheckImg from "../../assets/images/icons/check-circle.svg";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1500);
  };
  return (
    <PrivateLayout>
      <PrimaryButton
        label="Back"
        icon="pi pi-arrow-left"
        className="bg-light-color border-round-3xl text-dark"
      />
      {!showSuccess ? (
        <div className="flex mt-3 justify-content-center">
          <div className="payment-card  bg-light-color border-round-xl p-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h2 className="text-xl md:text-2xl title pb-3 font-medium text-dark mb-4">
                  Payment
                </h2>
                <div className="grid">
                  <div className="flex card-input flex-column col-12 p-0">
                    <CustomInput
                      col={12}
                      label="Card Number"
                      placeholder="1234  5678  9101  1121"
                    />
                    <img src={CreditCardImg} alt="Visa" className="h-1rem" />
                  </div>
                  <CustomInput label="Expiration" placeholder="MM/YY" col={6} />
                  <div className="flex card-input flex-column col-12 md:col-6 p-0">
                    <CustomInput
                      col={12}
                      label="CVC"
                      placeholder="1234  5678  9101  1121"
                    />
                    <img src={CardImg} alt="Visa" className="h-1rem" />
                  </div>
                  <CustomInput
                    label="Card Holder Name"
                    placeholder="MM/YY"
                    col={12}
                  />
                  <div className="col-12">
                    <PrimaryButton
                      label="Pay AUD $59"
                      icon="pi pi-lock"
                      className="w-full block justify-content-center gap-2"
                      loading={loading}
                      onClick={handlePayment}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="bg-white p-4 border-round-lg h-full">
                  <div className="flex h-full flex-column gap-4 justify-content-between">
                    <div className="">
                      <h2 className="text-xl md:text-2xl text-dark font-medium mt-0 mb-4">
                        Plan Details
                      </h2>
                      <div className="mb-2 flex bg-light-color p-3 border-round-lg justify-content-between align-items-center">
                        <span className="text-sm md:text-base text-dark font-semibold">
                          PROFESSIONAL PLAN
                        </span>
                        <span className="text-base md:text-xl text-primary-color font-medium">
                          AUD $59
                          <small className="text-dark text-base font-normal">
                            /month
                          </small>
                        </span>
                      </div>

                      <div className="flex justify-content-between align-items-center ">
                        <span>Tax(s)</span>
                        <span className="text-dark font-semibold">$1</span>
                      </div>
                    </div>
                    <div className="">
                      <div className="flex mb-3 justify-content-between align-items-center">
                        <span>Sub Total</span>
                        <span className="font-semibold text-dark">AUD $60</span>
                      </div>

                      <div className="flex justify-content-between align-items-center font-medium text-base border-top-1 pt-3">
                        <span>Total</span>
                        <span className="font-semibold text-dark">AUD $60</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 mt-3 w-full m-auto md:w-30rem bg-light-color border-round-lg">
          <div className="flex flex-column align-items-center text-center p-4">
            <img src={CheckImg} alt="" width={120} />
            <h2 className="text-2xl font-bold text-dark m-0 mb-2">
              Payment Successful
            </h2>
            <p className="text-gray-600 m-0 mb-4">
              Thank you for your payment! Your subscription was activated
              successfully.
            </p>
            <PrimaryButton
              label="Go To Dashboard"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>
      )}
    </PrivateLayout>
  );
}
