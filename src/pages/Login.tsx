"use client";

import { FormEvent, useState } from "react";
import {
  MdAlternateEmail,
  MdOutlineAlternateEmail,
  MdOutlineLock,
} from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CustomButton, CustomInput } from "../components/common";
import { InputAdornment } from "@mui/material";
import { useApi } from "../hooks";
import { AUTH } from "../utils/endpoints";
import { ToastContainer, toast } from "react-toastify";
import { setUserAction } from "../redux/user";
import { useNavigate } from "react-router-dom";
// import { setUserAction } from "@/redux/auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { post } = useApi();
  const navigate = useNavigate();
  // const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // dispatch(setUserAction({ email, password, token: "", name: email }));
    e.preventDefault();

    post({ url: AUTH.login, data: { email, password } }).then((res) => {
      if (res?.data?.errors) {
        let emailError = res.data?.errors?.Email?.join(", ") || "";
        let passwordError = res.data?.errors?.Password?.join(", ") || "";
        toast.error(emailError + "\n " + passwordError);
      } else if (res.data) {
        toast.error(res.data);
      } else {
        dispatch(setUserAction(res));
        navigate("/");
      }
      console.log("Login: ", res);
    });

    // router.push("/");
  };

  return (
    <main className="login-background flex min-h-screen flex-col w-full">
      <div className="flex flex-col p-4 justify-center items-center w-full h-[100vh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:w-[50%] w-[80%] bg-white p-6 rounded-lg py-12 "
        >
          <h2 className="text-center text-2xl sm:text-lg pb-8 font-bold">
            login to Alfayed
          </h2>
          <CustomInput
            type="text"
            name="email"
            value={email}
            label="Email"
            placeholder="Email"
            onChange={(e: any) => setEmail(e.target.value)}
            id="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdOutlineAlternateEmail size="20" />
                </InputAdornment>
              ),
            }}
          />
          <CustomInput
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdOutlineLock size="20" />
                </InputAdornment>
              ),
              endAdornment: (
                <CustomButton onClick={() => setShowPass(!showPass)}>
                  <InputAdornment position="end">
                    {showPass ? (
                      <AiFillEyeInvisible className="text-gray-500" size={24} />
                    ) : (
                      <AiFillEye className="text-gray-500" size={24} />
                    )}
                  </InputAdornment>
                </CustomButton>
              ),
            }}
            type={!showPass ? "password" : "text"}
            name="password"
            value={password}
            label="Password"
            placeholder="Password"
            onChange={(e: any) => setPassword(e.target.value)}
            id="password"
          />
          <CustomButton
            className="bg-primary rounded-lg p-2 mt-10 !px-20 text-white w-fit !self-center"
            onClick={(e: any) => handleSubmit(e)}
            variant="contained"
          >
            {"Log in"}
          </CustomButton>
        </form>
      </div>
    </main>
  );
};

export default Login;
