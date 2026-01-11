import Logo from "../src/assets/svg/logo.svg";
import { CustomInput, CustomPasswordInput } from "../src/components/ui/input";
import React from "react";
import { useSignIn, useAuth, useSessionList  } from "@clerk/clerk-react";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";


export const Login = () => {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth()
  const { setActive } = useSessionList();

  
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    userName: "",
    password: "",
  });


  const [errors, setErrors] = React.useState({
    userName: '',
    password: '',
  });

  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);


  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

  if (isSignedIn) {
    window.location.href = "/"; 
    return null;
  }

  if (!isLoaded || !signIn) return null;
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
        
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    const newErrors = {
      userName: formData.userName.trim() ? '' : 'Username is required',
      password: formData.password.trim() ? '' : 'Password is required',
    };
  
    setErrors(newErrors);
    return !newErrors.userName && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateForm()) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: formData.userName.trim(),
        password: formData.password,
      });

      if (!result) {
        setError("Sign in failed — no response from server");
        setIsLoading(false);
        return;
      }

      if (result.status === "complete") {
        if(setActive){
          await setActive({ session: result.createdSessionId });
        }
        window.location.href = "/"; 
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.errors?.[0]?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  min-h-screen items-center justify-center-safe bg-background px-4">

    <form className="w-lg flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex justify-center">
        <img src={Logo} alt="Logo" />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
          <MdErrorOutline className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-center">
        <h1 className="font-bold text-3xl font-poppins text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-lg font-poppins text-foreground mb-1">
          Log In Required
        </p>
      </div>
        
      <div className="overflow-y-auto flex flex-col py-4 px-3">
          <CustomInput
            className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Username here"
            label="username"
            type="text"
            value={formData.userName}
            onChange={(e) => handleInputChange('userName', e.target.value)}
            error={errors.userName}
            disabled={isLoading}
          />
          {/* {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
          )} */}

        <div className="relative mb-4">
          <CustomPasswordInput
            className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />
          {/* {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )} */}

          <button
            type="button"
            className="text-onction-blue absolute right-6 top-15 transform -translate-y-1/2 hover:text-blue-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <IoIosEyeOff className="text-md" />
            ) : (
              <FaRegEye className="text-md" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-400 h-[42px] w-full text-[12px] my-4 rounded-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </div>
      
    </form>
    </div>
  );
};
