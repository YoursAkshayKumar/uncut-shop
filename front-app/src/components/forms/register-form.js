'use client';
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
// internal
import { Email, EyeCut, Lock, UserTwo } from "@svg/index";
import ErrorMessage from "@components/error-message/error";
import { useRegisterUserMutation, useVerifyCodeMutation, useResetPasswordMutation } from "src/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@utils/toast";


const registerSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
     .required('Please confirm your password')
     .oneOf([Yup.ref('password')], 'Passwords must match')
});

const verifySchema = Yup.object().shape({
  code: Yup.string()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .matches(/^\d+$/, 'Verification code must contain only numbers')
});


const RegisterForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  
  // react hook form for registration
  const { register, handleSubmit, formState:{ errors }, reset } = useForm({
    resolver: yupResolver(registerSchema)
  });

  // react hook form for verification
  const { 
    register: registerVerify, 
    handleSubmit: handleVerifySubmit, 
    formState:{ errors: verifyErrors }, 
    reset: resetVerify 
  } = useForm({
    resolver: yupResolver(verifySchema)
  });

  // Reset states on component mount to prevent stale state
  useEffect(() => {
    setShowVerification(false);
    setShowPasswordReset(false);
  }, []);

  // on registration submit
  const onSubmit = async (data) => {
    // Reset states first to prevent any previous state from interfering
    setShowVerification(false);
    setShowPasswordReset(false);
    
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Debug logging
      console.log('Registration result:', result);

      // Check for errors first - RTK Query error structure
      // RTK Query returns { error: { status, data } } for non-2xx responses
      if(result?.error){
        const errorStatus = result?.error?.status;
        const errorData = result?.error?.data || result?.error || {};
        const errorCode = errorData?.code;
        const errorMessage = errorData?.message;
        
        console.log('Error detected:', { errorStatus, errorCode, errorMessage, errorData });
        
        // Check if email already exists (status 409 or EMAIL_EXISTS code)
        if(errorStatus === 409 || errorStatus === '409' || errorCode === 'EMAIL_EXISTS' || 
           errorMessage?.toLowerCase().includes('already exists') || 
           errorMessage?.toLowerCase().includes('already registered')) {
          const message = errorMessage || 'This email is already registered. If you have forgotten your password, please go to password reset to change it.';
          notifyError(message);
          setUserEmail(data.email);
          setShowPasswordReset(true);
          setShowVerification(false); // Explicitly set to false
          // Don't reset form, keep the data visible so user can see what they entered
          return; // Stop here, don't proceed to verification
        } else {
          // Other errors
          const message = errorMessage || errorData?.error || 'Registration failed. Please try again.';
          notifyError(message);
          setShowVerification(false); // Explicitly set to false
          setShowPasswordReset(false);
          return; // Stop here
        }
      }
      
      // Only proceed if there's no error and we have a successful response
      // Double check that there's no error before showing verification
      if(result?.data && !result?.error && result?.data?.message) {
        // Check if the response indicates failure
        if(result.data.status === 'failed' || result.data.code === 'EMAIL_EXISTS') {
          const message = result.data.message || 'This email is already registered. If you have forgotten your password, please go to password reset to change it.';
          notifyError(message);
          setUserEmail(data.email);
          setShowPasswordReset(true);
          setShowVerification(false);
          return;
        }
        
        // Success case
        notifySuccess(result.data.message || 'Registration successful! Please check your email for verification code.');
        setUserEmail(data.email);
        setShowVerification(true);
        setShowPasswordReset(false);
        reset();
      } else {
        // No data or unexpected response
        console.warn('Unexpected response structure:', result);
        setShowVerification(false);
        setShowPasswordReset(false);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error('Registration error:', error);
      notifyError('Registration failed. Please try again.');
      setShowVerification(false); // Make sure verification is not shown
      setShowPasswordReset(false);
    }
  };

  // on password reset request
  const onPasswordResetRequest = async () => {
    try {
      const result = await resetPassword({
        verifyEmail: userEmail,
      });

      if(result?.error){
        const errorMessage = result?.error?.data?.message || 'Failed to send password reset code';
        notifyError(errorMessage);
      } else {
        notifySuccess(result?.data?.message || 'Password reset code sent to your email!');
        setShowPasswordReset(false);
        // Redirect to forgot password page or show password reset form
        router.push('/forgot');
      }
    } catch (error) {
      notifyError('Failed to request password reset. Please try again.');
    }
  };

  // on verification submit
  const onVerifySubmit = async (data) => {
    try {
      const result = await verifyCode({
        email: userEmail,
        code: data.code,
      });

      if(result?.error){
        const errorMessage = result?.error?.data?.error || 'Verification failed';
        notifyError(errorMessage);
      } else {
        notifySuccess(result?.data?.message || 'Email verified successfully!');
        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      notifyError('Verification failed. Please try again.');
    }
  };

  // Show password reset prompt if email exists - check this FIRST before verification
  if (showPasswordReset && !showVerification) {
    return (
      <div>
        <div className="mb-20 text-center">
          <h4 className="login__title mb-10">Email Already Registered</h4>
          <p className="mb-0">This email address (<strong>{userEmail}</strong>) is already registered.</p>
          <p className="mb-0">If you have forgotten your password, please go to password reset to change it.</p>
        </div>
        <div className="login__btn mt-25">
          <button 
            type="button" 
            className="tp-btn w-100"
            onClick={onPasswordResetRequest}
            disabled={isResettingPassword}
          >
            {isResettingPassword ? 'Sending...' : 'Go to Password Reset'}
          </button>
        </div>
        <div className="login__register-now mt-20 text-center">
          <p>
            Remember your password?{' '}
            <Link href="/login" style={{ color: '#22c55e', textDecoration: 'underline' }}>
              Log in instead
            </Link>
            {' or '}
            <button
              type="button"
              onClick={() => {
                setShowPasswordReset(false);
                setUserEmail("");
                reset();
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#22c55e', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              try a different email
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Show verification form if registration was successful - only if password reset is not shown
  if (showVerification && !showPasswordReset) {
    return (
      <div>
        <div className="mb-20 text-center">
          <h4 className="login__title mb-10">Verify Your Email</h4>
          <p className="mb-0">We've sent a 6-digit verification code to <strong>{userEmail}</strong></p>
          <p className="mb-0">Please enter the code below to complete your registration.</p>
        </div>
        <form onSubmit={handleVerifySubmit(onVerifySubmit)}>
          <div className="login__input-wrapper">
            <div className="login__input-item">
              <div className="login__input">
                <input
                  {...registerVerify("code", {
                    required: 'Verification code is required!',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Please enter a valid 6-digit code'
                    }
                  })}
                  name="code"
                  type="text"
                  placeholder="000000"
                  id="code"
                  maxLength={6}
                  autoFocus
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
                />
                <span>
                  <Lock />
                </span>
              </div>
              <ErrorMessage message={verifyErrors.code?.message} />
            </div>
          </div>

          <div className="login__btn mt-25">
            <button 
              type="submit" 
              className="tp-btn w-100"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="login__register-now mt-20 text-center">
            <p>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setUserEmail("");
                  resetVerify();
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#22c55e', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Go back to registration
              </button>
            </p>
          </div>
        </form>
      </div>
    );
  }

  // Registration form
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login__input-wrapper">
        <div className="login__input-item">
          <div className="login__input">
            <input
              {...register("name",{required:`Name is required!`})}
              name="name"
              type="text"
              placeholder="Enter your name"
              id="name"
            />
            <span>
              <UserTwo />
            </span>
          </div>
           <ErrorMessage message={errors.name?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input">
            <input
             {...register("email",{required:`Email is required!`})}
              name="email"
              type="email"
              placeholder="Enter your email"
              id="email"
            />
            <span>
              <Email />
            </span>
          </div>
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input-item-inner p-relative">
            <div className="login__input">
              <input
                {...register("password",{required:`Password is required!`})}
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                id="password"
              />
              <span>
                <Lock />
              </span>
            </div>
            <span
              className="login-input-eye"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <i className="fa-regular fa-eye"></i> : <EyeCut />}
            </span>
          </div>
          <ErrorMessage message={errors.password?.message} />
        </div>

        <div className="login__input-item">
          <div className="login__input-item-inner p-relative">
            <div className="login__input">
              <input
               {...register("confirmPassword")}
                name="confirmPassword"
                type={showConPass ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmPassword"
              />
              <span>
                <Lock />
              </span>
            </div>
            <span
              className="login-input-eye"
              onClick={() => setShowConPass(!showConPass)}
            >
              {showConPass ? <i className="fa-regular fa-eye"></i> : <EyeCut />}
            </span>
          </div>
          <ErrorMessage message={errors.confirmPassword?.message} />
        </div>
      </div>


      <div className="login__btn mt-25">
        <button 
          type="submit" 
          className="tp-btn w-100"
          disabled={isRegistering}
        >
          {isRegistering ? 'Registering...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
