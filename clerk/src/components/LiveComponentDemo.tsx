"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const providers = [
  { name: "Google", icon: "G", color: "#4285F4" },
  { name: "GitHub", icon: "⌘", color: "#8B8B9E" },
  { name: "Apple", icon: "", color: "#FFFFFF" },
];

function SignInDemo() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [typingIdx, setTypingIdx] = useState(0);

  // Auto-type demo
  useEffect(() => {
    if (step === "email") {
      const demoEmail = "user@company.com";
      if (typingIdx < demoEmail.length) {
        const timeout = setTimeout(() => {
          setEmail(demoEmail.slice(0, typingIdx + 1));
          setTypingIdx(typingIdx + 1);
        }, 80 + Math.random() * 60);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setStep("code"), 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [step, typingIdx]);

  // Auto-fill code
  useEffect(() => {
    if (step === "code") {
      const codeDigits = ["3", "8", "1", "4", "2", "7"];
      codeDigits.forEach((digit, i) => {
        setTimeout(() => {
          setCode((prev) => {
            const next = [...prev];
            next[i] = digit;
            return next;
          });
          if (i === codeDigits.length - 1) {
            setTimeout(() => setStep("success"), 600);
          }
        }, 400 + i * 200);
      });
    }
  }, [step]);

  // Reset cycle
  useEffect(() => {
    if (step === "success") {
      const timeout = setTimeout(() => {
        setStep("email");
        setEmail("");
        setTypingIdx(0);
        setCode(["", "", "", "", "", ""]);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-[#131320] rounded-2xl border border-white/10 p-8 glow-purple">
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-center mb-1">Sign in</h3>
              <p className="text-sm text-[#8B8B9E] text-center mb-6">to continue to your application</p>

              {/* Social buttons */}
              <div className="flex gap-2 mb-4">
                {providers.map((p) => (
                  <motion.button
                    key={p.name}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <span style={{ color: p.color }}>{p.icon}</span>
                    <span className="text-[#8B8B9E] text-xs">{p.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-[#8B8B9E]">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email input */}
              <label className="block text-sm text-[#8B8B9E] mb-1.5">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2.5 bg-[#0A0A0F] border border-white/10 rounded-lg text-sm text-white focus:border-[#6C47FF] transition-colors outline-none"
                />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#6C47FF]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>

              <motion.button
                className="w-full mt-4 py-2.5 bg-[#6C47FF] hover:bg-[#5A38E0] text-white text-sm font-medium rounded-lg transition-colors"
                animate={email.includes(".com") ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {step === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-center mb-1">Verify your email</h3>
              <p className="text-sm text-[#8B8B9E] text-center mb-6">
                Enter the code sent to {email}
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {code.map((digit, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-10 h-12 rounded-lg border border-white/10 bg-[#0A0A0F] flex items-center justify-center text-lg font-mono"
                    style={{
                      borderColor: digit ? "#6C47FF" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <AnimatePresence>
                      {digit && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-white"
                        >
                          {digit}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center"
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.path
                    d="M8 16L14 22L24 10"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </motion.svg>
              </motion.div>
              <h3 className="text-xl font-semibold mb-1">Welcome back!</h3>
              <p className="text-sm text-[#8B8B9E]">Signed in as {email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserButtonDemo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#131320] border border-white/10"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#17CCFC] flex items-center justify-center text-sm font-semibold">
          J
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">Jane Doe</p>
          <p className="text-xs text-[#8B8B9E]">jane@company.com</p>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#131320] border border-white/10 rounded-xl p-2 shadow-2xl"
          >
            <div className="px-3 py-2 border-b border-white/5 mb-1">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-[#8B8B9E]">jane@company.com</p>
            </div>
            {["Manage account", "Switch organization", "Sign out"].map((item) => (
              <div
                key={item}
                className="px-3 py-2 text-sm text-[#8B8B9E] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LiveComponentDemo() {
  return (
    <section className="relative py-32 px-6" id="demo">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#6C47FF] mb-4 block">LIVE COMPONENTS</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Beautiful, <span className="gradient-text">pre-built</span> components
          </h2>
          <p className="text-lg text-[#8B8B9E] max-w-2xl mx-auto">
            Drop-in authentication UIs that work out of the box. Fully customizable to match your brand.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sign In Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{"<SignIn />"}</h3>
              <p className="text-sm text-[#8B8B9E]">
                Complete sign-in flow with email, social login, and verification — in a single component.
              </p>
            </div>
            <SignInDemo />
          </motion.div>

          {/* Right side: UserButton + code */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{"<UserButton />"}</h3>
              <p className="text-sm text-[#8B8B9E] mb-4">
                User profile dropdown with session management, organization switching, and sign out.
              </p>
              <UserButtonDemo />
            </div>

            {/* Code block */}
            <div className="rounded-xl bg-[#131320] border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-[#8B8B9E]">app/layout.tsx</span>
              </div>
              <pre className="p-4 text-sm font-mono overflow-x-auto">
                <code>
                  <span className="text-[#8B8B9E]">{"import { "}</span>
                  <span className="text-[#17CCFC]">ClerkProvider</span>
                  <span className="text-[#8B8B9E]">{" } from "}</span>
                  <span className="text-[#6C47FF]">{'"@clerk/nextjs"'}</span>
                  <br />
                  <br />
                  <span className="text-[#8B8B9E]">{"export default function "}</span>
                  <span className="text-[#17CCFC]">Layout</span>
                  <span className="text-[#8B8B9E]">{"({ children }) {"}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"  return ("}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"    <"}</span>
                  <span className="text-[#6C47FF]">ClerkProvider</span>
                  <span className="text-[#8B8B9E]">{">"}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"      {children}"}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"    </"}</span>
                  <span className="text-[#6C47FF]">ClerkProvider</span>
                  <span className="text-[#8B8B9E]">{">"}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"  )"}</span>
                  <br />
                  <span className="text-[#8B8B9E]">{"}"}</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
