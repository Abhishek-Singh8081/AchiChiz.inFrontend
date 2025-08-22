import React, { useState, useRef, useEffect, useCallback } from "react";
import { auth } from "../../data/allapi";
import { useNavigate } from "react-router-dom";

const OTPPage = ({ onVerify, onResend, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // ⏱ Countdown timer effect
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 🧠 Handle input change
  const handleChange = useCallback(
    (e, index) => {
      const value = e.target.value;
      if (/^\d?$/.test(value)) {
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  // ✅ Resend OTP POST API
  const handleResend = useCallback(async () => {
    if (timer === 0) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(300);
      onResend && onResend();

      try {
        const response = await fetch(auth.RESEND_OTP, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("OTP resent successfully.");
        } else {
          alert(data.message || "Failed to resend OTP.");
        }
      } catch (error) {
        console.error("Resend OTP error:", error);
        alert("An error occurred while resending the OTP.");
      }
    }
  }, [timer, onResend, email]);

  // 🛜 Verify OTP with POST API
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      alert("Please enter a complete 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(auth.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP Verified Successfully");
        onVerify && onVerify(enteredOtp);
        navigate("/authpage");
      } else {
        alert(data.message || "Invalid OTP");
        navigate("/notfound");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("An error occurred during verification.");
      navigate("/notfound");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-center mb-2 text-gray-800">Verify OTP</h2>
      <p className="text-center text-sm text-gray-600 mb-4">
        Enter the 6-digit code sent to your email: <span className="font-semibold">{email}</span>
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 border border-gray-300 text-center text-xl rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 font-semibold rounded"
      >
        Verify OTP
      </button>

      <p className="text-center text-sm mt-4 text-gray-600">
        {timer > 0 ? (
          <>Resend OTP in <span className="font-semibold">{timer}s</span></>
        ) : (
          <button
            onClick={handleResend}
            className="text-orange-600 hover:underline font-medium"
          >
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
};

export default OTPPage;
