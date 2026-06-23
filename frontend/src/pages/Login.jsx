import { useState } from "react";
import { Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

import API from "../services/api";
import ParticlesBg from "../components/three/ParticlesBg";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  // ---------------- LOCAL LOGIN ----------------

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {

      setErrorMsg("Please fill in all fields.");

      return;

    }

    setLoading(true);

    setErrorMsg("");

    try {

      localStorage.removeItem("token");

      const res = await API.post(

        "/auth/login",

        {

          email: email.trim().toLowerCase(),

          password

        }

      );

      localStorage.setItem(

        "token",

        res.data.token

      );

      navigate("/dashboard");

    }

    catch (err) {

      console.log(err);

      setErrorMsg(

        err.response?.data?.message ||

        "Invalid credentials"

      );

      setLoading(false);

    }

  };

  // ---------------- GOOGLE LOGIN ----------------

  const handleGoogleSuccess = async (

    credentialResponse

  ) => {

    try {

      localStorage.removeItem("token");

      const res = await API.post(

        "/auth/google",

        {

          credential:

          credentialResponse.credential

        }

      );

      localStorage.setItem(

        "token",

        res.data.token

      );

      navigate("/dashboard");

    }

    catch (err) {

      console.log(err);

      setErrorMsg(

        err.response?.data?.message ||

        err.message ||

        "Google login failed"

      );

    }

  };

  return (

    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-900">

      {/* LEFT SIDE */}

      <div className="relative hidden md:flex md:w-1/2 flex-col justify-between p-12 text-white z-10 select-none">

        <ParticlesBg />

        <motion.div

          initial={{ opacity: 0, y: -20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.6 }}

          className="flex items-center gap-3"

        >

          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-extrabold shadow-lg shadow-primary/30">

            R

          </div>

          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">

            RBAC Platform

          </span>

        </motion.div>

        <div className="my-auto max-w-lg space-y-6">

          <motion.div

            initial={{ opacity: 0, scale: 0.95 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 0.8, delay: 0.2 }}

            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-white/10 text-xs font-semibold text-accent-light"

          >

            <Shield className="h-3.5 w-3.5" />

            SecureHub

          </motion.div>

          <motion.h1

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.8, delay: 0.3 }}

            className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"

          >

            SecureHub - Multi-Tenant RBAC Content Platform

          </motion.h1>

          <motion.p

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.8, delay: 0.4 }}

            className="text-slate-400"

          >

            Experience premium RBAC security,

            audit logging and organization

            management.

          </motion.p>

        </div>

        <div className="text-xs text-slate-500">

          © 2026 All rights reserved.

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#0b1329] relative z-10">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.6 }}

          className="w-full max-w-md glass-dark rounded-2xl p-8 border border-white/5 shadow-2xl"

        >

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-white mb-2">

              Welcome Back

            </h2>

            <p className="text-sm text-slate-400">

              Sign in to access your dashboard

            </p>

          </div>

          <form

            onSubmit={handleLogin}

            className="space-y-6"

          >

            {errorMsg && (

              <motion.div

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"

              >

                <AlertCircle size={18} />

                <span>{errorMsg}</span>

              </motion.div>

            )}

            <div className="space-y-4">

              <Input

                label="Email Address"

                type="email"

                placeholder="name@company.com"

                value={email}

                onChange={(e) =>

                  setEmail(e.target.value)

                }

                icon={Mail}

              />

              <Input

                label="Password"

                type="password"

                placeholder="••••••••"

                value={password}

                onChange={(e) =>

                  setPassword(e.target.value)

                }

                icon={Lock}

              />

            </div>

            <Button

              type="submit"

              variant="primary"

              loading={loading}

              className="w-full py-3"

            >

              Sign In

            </Button>

            <div className="mt-6 flex justify-center">

              <GoogleLogin

                onSuccess={

                  handleGoogleSuccess

                }

                onError={() =>

                  setErrorMsg(

                    "Google login failed"

                  )

                }

              />

            </div>

          </form>

        </motion.div>

      </div>

    </div>

  );

}