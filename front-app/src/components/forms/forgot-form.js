'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
// internal
import Email from "@svg/email";
import { Lock, EyeCut } from "@svg/index";
import { 
  useResetPasswordMutation, 
  useVerifyPasswordResetCodeMutation,
  useConfirmForgotPasswordMutation 
} from "src/redux/features/auth/authApi";
import ErrorMessage from "@components/error-message/error";
import { notifyError, notifySuccess } from "@utils/toast";

const emailSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

const codeSchema = Yup.object().shape({
  code: Yup.string()
    .required('Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .matches(/^\d+$/, 'Verification code must contain only numbers')
});

const passwordSchema = Yup.object().shape({
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

const ForgotForm = () => {
  const router = useRouter();
  const [step, setStep] = useState('email'); // 'email', 'code', 'password'
  const [userEmail, setUserEmail] = useState("");
  const [verifiedCode, setVerifiedCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  
  const [resetPassword, { isLoading: isSendingCode }] = useResetPasswordMutation();
  const [verifyCode, { isLoading: isVerifyingCode }] = useVerifyPasswordResetCodeMutation();
  const [confirmPassword, { isLoading: isResettingPassword }] = useConfirmForgotPasswordMutation();

  // Form for email
  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors }, reset: resetEmail } = useForm({
    resolver: yupResolver(emailSchema),
  });

  // Form for code
  const { register: registerCode, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors }, reset: resetCode } = useForm({
    resolver: yupResolver(codeSchema),
  });

  // Form for password
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Step 1: Request password reset
  const onEmailSubmit = async (data) => {
    try {
      const result = await resetPassword({
      verifyEmail: data.email,
      });

      if(result?.error){
        notifyError(result?.error?.data?.message || 'Failed to send verification code');
      } else {
        notifySuccess(result.data?.message || 'Verification code sent to your email!');
        setUserEmail(data.email);
        setStep('code');
        resetEmail();
      }
    } catch (error) {
      notifyError('Failed to send verification code. Please try again.');
    }
  };

  // Step 2: Verify code
  const onCodeSubmit = async (data) => {
    try {
      const result = await verifyCode({
        email: userEmail,
        code: data.code,
      });

      if(result?.error){
        notifyError(result?.error?.data?.error || 'Verification failed');
      } else {
        notifySuccess(result.data?.message || 'Code verified! Please set your new password.');
        setVerifiedCode(data.code);
        setStep('password');
        resetCode();
      }
    } catch (error) {
      notifyError('Verification failed. Please try again.');
    }
  };

  // Step 3: Reset password
  const onPasswordSubmit = async (data) => {
    try {
      const result = await confirmPassword({
        email: userEmail,
        code: verifiedCode,
        password: data.password,
      });

      if(result?.error){
        notifyError(result?.error?.data?.error || 'Password reset failed');
      } else {
        notifySuccess(result.data?.message || 'Password reset successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (error) {
      notifyError('Password reset failed. Please try again.');
    }
  };

  // Show code verification form
  if (step === 'code') {
    return (
      <div>
        <div className="mb-20 text-center">
          <h4 className="login__title mb-10">Verify Your Email</h4>
          <p className="mb-0">We've sent a 6-digit verification code to <strong>{userEmail}</strong></p>
          <p className="mb-0">Please enter the code below to continue.</p>
        </div>
        <form onSubmit={handleCodeSubmit(onCodeSubmit)}>
          <div className="login__input-wrapper">
            <div className="login__input-item">
              <div className="login__input">
                <input
                  {...registerCode("code", {
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
              <ErrorMessage message={codeErrors.code?.message} />
            </div>
          </div>
          <div className="login__btn mt-25">
            <button 
              type="submit" 
              className="tp-btn w-100"
              disabled={isVerifyingCode}
            >
              {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
          <div className="login__register-now mt-20 text-center">
            <p>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setUserEmail("");
                  resetCode();
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#22c55e', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Resend code
              </button>
            </p>
          </div>
        </form>
      </div>
    );
  }

  // Show password reset form
  if (step === 'password') {
    return (
      <div>
        <div className="mb-20 text-center">
          <h4 className="login__title mb-10">Set New Password</h4>
          <p className="mb-0">Enter your new password below.</p>
        </div>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <div className="login__input-wrapper">
            <div className="login__input-item">
              <div className="login__input-item-inner p-relative">
                <div className="login__input">
                  <input
                    {...registerPassword("password", {required:`Password is required!`})}
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="New Password"
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
              <ErrorMessage message={passwordErrors.password?.message} />
            </div>
            <div className="login__input-item">
              <div className="login__input-item-inner p-relative">
                <div className="login__input">
                  <input
                    {...registerPassword("confirmPassword")}
                    name="confirmPassword"
                    type={showConPass ? "text" : "password"}
                    placeholder="Confirm New Password"
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
              <ErrorMessage message={passwordErrors.confirmPassword?.message} />
            </div>
          </div>
          <div className="login__btn mt-25">
            <button 
              type="submit" 
              className="tp-btn w-100"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Show email form (default)
  return (
    <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
      <div className="login__input-wrapper">
        <div className="login__input-item">
          <div className="login__input">
            <input {...registerEmail("email")} type="email" placeholder="Email" />
            <span>
              <Email />
            </span>
          </div>
          <ErrorMessage message={emailErrors.email?.message} />
        </div>
      </div>
      <div className="login__btn">
        <button 
          type="submit" 
          className="tp-btn w-100"
          disabled={isSendingCode}
        >
          {isSendingCode ? 'Sending...' : 'Send Verification Code'}
        </button>
      </div>
    </form>
  );
};

export default ForgotForm;
