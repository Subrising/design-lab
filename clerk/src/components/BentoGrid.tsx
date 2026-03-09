"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  gradient?: string;
  children?: React.ReactNode;
  delay?: number;
}

function BentoCard({ title, description, icon, className = "", gradient, children, delay = 0 }: BentoCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group rounded-2xl bg-[#131320] border border-white/[0.06] overflow-hidden ${className}`}
    >
      {gradient && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: gradient }}
        />
      )}
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="mb-4 text-[#6C47FF]">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-[#8B8B9E] mb-4 leading-relaxed">{description}</p>
        {children && <div className="mt-auto">{children}</div>}
      </div>
    </motion.div>
  );
}

function AnimatedShield() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <motion.path
        d="M24 4L6 12V22C6 34 14 43 24 46C34 43 42 34 42 22V12L24 4Z"
        stroke="#6C47FF"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M16 24L22 30L34 18"
        stroke="#17CCFC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

function AnimatedChart() {
  const bars = [60, 80, 45, 95, 70, 85];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-4 rounded-t bg-gradient-to-t from-[#6C47FF] to-[#17CCFC]"
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function AnimatedUsers() {
  return (
    <div className="flex -space-x-2">
      {[
        "from-purple-500 to-blue-500",
        "from-cyan-500 to-teal-500",
        "from-pink-500 to-rose-500",
        "from-amber-500 to-orange-500",
        "from-indigo-500 to-violet-500",
      ].map((gradient, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: -10 }}
          whileInView={{ scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-[#131320] flex items-center justify-center text-xs font-medium`}
        >
          {String.fromCharCode(65 + i)}
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
        className="w-8 h-8 rounded-full bg-[#1A1A2E] border-2 border-[#131320] flex items-center justify-center text-xs text-[#8B8B9E]"
      >
        +5k
      </motion.div>
    </div>
  );
}

function FrameworkLogos() {
  const [active, setActive] = useState(0);
  const frameworks = [
    { name: "Next.js", letter: "N" },
    { name: "React", letter: "R" },
    { name: "Remix", letter: "Rx" },
    { name: "Express", letter: "Ex" },
    { name: "Fastify", letter: "Fa" },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {frameworks.map((fw, i) => (
        <motion.div
          key={fw.name}
          onHoverStart={() => setActive(i)}
          whileHover={{ scale: 1.1, y: -2 }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            active === i
              ? "border-[#6C47FF] text-[#6C47FF] bg-[#6C47FF]/10"
              : "border-white/10 text-[#8B8B9E]"
          }`}
        >
          {fw.name}
        </motion.div>
      ))}
    </div>
  );
}

function RBACTree() {
  return (
    <div className="space-y-2 text-xs font-mono">
      {[
        { role: "admin", perms: ["read", "write", "delete"], color: "#FF4747" },
        { role: "editor", perms: ["read", "write"], color: "#6C47FF" },
        { role: "viewer", perms: ["read"], color: "#17CCFC" },
      ].map((item, i) => (
        <motion.div
          key={item.role}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[#8B8B9E] w-12">{item.role}</span>
          <div className="flex gap-1">
            {item.perms.map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 text-[#8B8B9E]">{p}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="relative py-32 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#6C47FF] mb-4 block">FEATURES</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text">ship auth</span>
          </h2>
          <p className="text-lg text-[#8B8B9E] max-w-2xl mx-auto">
            A complete authentication and user management solution. No more building from scratch.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card: Security */}
          <BentoCard
            title="Enterprise Security"
            description="SOC 2 Type II certified. SAML SSO, MFA, bot protection, and brute-force detection built in."
            icon={<AnimatedShield />}
            className="md:col-span-2 lg:col-span-2 min-h-[280px]"
            gradient="radial-gradient(circle at 30% 50%, rgba(108,71,255,0.08) 0%, transparent 60%)"
            delay={0}
          >
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs text-[#8B8B9E]">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                SOC 2 Type II
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B8B9E]">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                HIPAA Ready
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B8B9E]">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                GDPR Compliant
              </div>
            </div>
          </BentoCard>

          {/* Tall card: Analytics */}
          <BentoCard
            title="User Analytics"
            description="Track sign-ups, active users, and conversion funnels in real time."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M4 28L12 18L18 22L28 8" stroke="#6C47FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            className="min-h-[280px]"
            gradient="radial-gradient(circle at 70% 30%, rgba(23,204,252,0.08) 0%, transparent 60%)"
            delay={0.1}
          >
            <AnimatedChart />
          </BentoCard>

          {/* Users card */}
          <BentoCard
            title="User Management"
            description="Complete user profiles with metadata, banning, impersonation, and more."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="12" r="5" stroke="#6C47FF" strokeWidth="2" />
                <path d="M6 28C6 22 10 18 16 18C22 18 26 22 26 28" stroke="#6C47FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            className="min-h-[240px]"
            gradient="radial-gradient(circle at 50% 80%, rgba(108,71,255,0.06) 0%, transparent 60%)"
            delay={0.15}
          >
            <AnimatedUsers />
          </BentoCard>

          {/* Framework support */}
          <BentoCard
            title="Any Framework"
            description="First-class SDKs for Next.js, React, Remix, Express, and more."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M4 8L16 2L28 8V24L16 30L4 24V8Z" stroke="#6C47FF" strokeWidth="2" />
              </svg>
            }
            className="min-h-[240px]"
            gradient="radial-gradient(circle at 80% 50%, rgba(108,71,255,0.06) 0%, transparent 60%)"
            delay={0.2}
          >
            <FrameworkLogos />
          </BentoCard>

          {/* RBAC */}
          <BentoCard
            title="Roles & Permissions"
            description="Fine-grained access control. Define roles and permissions per organization."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="4" stroke="#6C47FF" strokeWidth="2" />
                <path d="M10 16H22M10 10H22M10 22H16" stroke="#6C47FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            className="min-h-[240px]"
            gradient="radial-gradient(circle at 30% 70%, rgba(23,204,252,0.06) 0%, transparent 60%)"
            delay={0.25}
          >
            <RBACTree />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
