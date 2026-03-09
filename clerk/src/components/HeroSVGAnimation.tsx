"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.2, duration: 1.5, ease: "easeInOut" },
      opacity: { delay: i * 0.2, duration: 0.3 },
    },
  }),
};

const nodeAppear = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.15 + 0.3,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  }),
};

export default function HeroSVGAnimation() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 600 400" fill="none" className="w-full h-auto">
        {/* Grid dots background */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 18 }).map((_, col) => (
            <motion.circle
              key={`dot-${row}-${col}`}
              cx={30 + col * 32}
              cy={30 + row * 32}
              r="1"
              fill="#6C47FF"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: (row + col) * 0.02, duration: 0.5 }}
            />
          ))
        )}

        {/* Connection lines */}
        <motion.path
          d="M150 120 L300 80 L450 120"
          stroke="url(#gradient1)"
          strokeWidth="2"
          variants={draw}
          custom={0}
          initial="hidden"
          animate="visible"
          strokeLinecap="round"
        />
        <motion.path
          d="M300 80 L300 200"
          stroke="url(#gradient1)"
          strokeWidth="2"
          variants={draw}
          custom={1}
          initial="hidden"
          animate="visible"
          strokeLinecap="round"
        />
        <motion.path
          d="M150 120 L150 250 L300 320 L450 250 L450 120"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          variants={draw}
          custom={2}
          initial="hidden"
          animate="visible"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <motion.path
          d="M300 200 L150 250"
          stroke="url(#gradient1)"
          strokeWidth="2"
          variants={draw}
          custom={3}
          initial="hidden"
          animate="visible"
          strokeLinecap="round"
        />
        <motion.path
          d="M300 200 L450 250"
          stroke="url(#gradient1)"
          strokeWidth="2"
          variants={draw}
          custom={3}
          initial="hidden"
          animate="visible"
          strokeLinecap="round"
        />

        {/* Central auth node */}
        <motion.g variants={nodeAppear} custom={1} initial="hidden" animate="visible">
          <circle cx="300" cy="200" r="35" fill="#131320" stroke="#6C47FF" strokeWidth="2" />
          <circle cx="300" cy="192" r="10" fill="none" stroke="#6C47FF" strokeWidth="1.5" />
          <path d="M290 205C290 200 294 197 300 197C306 197 310 200 310 205" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pulsing ring */}
          <motion.circle
            cx="300"
            cy="200"
            r="35"
            fill="none"
            stroke="#6C47FF"
            strokeWidth="1"
            animate={{ r: [35, 50, 35], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>

        {/* User node (top center) */}
        <motion.g variants={nodeAppear} custom={0} initial="hidden" animate="visible">
          <rect x="275" y="55" width="50" height="50" rx="12" fill="#131320" stroke="#17CCFC" strokeWidth="1.5" />
          <circle cx="300" cy="72" r="6" fill="#17CCFC" />
          <path d="M289 88C289 84 294 81 300 81C306 81 311 84 311 88" stroke="#17CCFC" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* SSO node (left) */}
        <motion.g variants={nodeAppear} custom={2} initial="hidden" animate="visible">
          <rect x="110" y="95" width="80" height="50" rx="12" fill="#131320" stroke="#6C47FF" strokeWidth="1.5" />
          <text x="150" y="118" textAnchor="middle" fill="#8B8B9E" fontSize="10" fontFamily="monospace">SSO</text>
          <text x="150" y="132" textAnchor="middle" fill="#6C47FF" fontSize="8" fontFamily="monospace">SAML/OIDC</text>
        </motion.g>

        {/* MFA node (right) */}
        <motion.g variants={nodeAppear} custom={2} initial="hidden" animate="visible">
          <rect x="410" y="95" width="80" height="50" rx="12" fill="#131320" stroke="#6C47FF" strokeWidth="1.5" />
          <text x="450" y="118" textAnchor="middle" fill="#8B8B9E" fontSize="10" fontFamily="monospace">MFA</text>
          <text x="450" y="132" textAnchor="middle" fill="#6C47FF" fontSize="8" fontFamily="monospace">TOTP/SMS</text>
        </motion.g>

        {/* Session node (bottom left) */}
        <motion.g variants={nodeAppear} custom={4} initial="hidden" animate="visible">
          <rect x="100" y="225" width="100" height="50" rx="12" fill="#131320" stroke="#17CCFC" strokeWidth="1.5" />
          <text x="150" y="248" textAnchor="middle" fill="#8B8B9E" fontSize="10" fontFamily="monospace">Sessions</text>
          <text x="150" y="262" textAnchor="middle" fill="#17CCFC" fontSize="8" fontFamily="monospace">JWT tokens</text>
        </motion.g>

        {/* Org node (bottom right) */}
        <motion.g variants={nodeAppear} custom={4} initial="hidden" animate="visible">
          <rect x="400" y="225" width="100" height="50" rx="12" fill="#131320" stroke="#17CCFC" strokeWidth="1.5" />
          <text x="450" y="248" textAnchor="middle" fill="#8B8B9E" fontSize="10" fontFamily="monospace">Orgs</text>
          <text x="450" y="262" textAnchor="middle" fill="#17CCFC" fontSize="8" fontFamily="monospace">Multi-tenant</text>
        </motion.g>

        {/* App node (bottom center) */}
        <motion.g variants={nodeAppear} custom={5} initial="hidden" animate="visible">
          <rect x="255" y="295" width="90" height="50" rx="12" fill="#131320" stroke="#8B6FFF" strokeWidth="1.5" />
          <text x="300" y="318" textAnchor="middle" fill="#8B8B9E" fontSize="10" fontFamily="monospace">Your App</text>
          <text x="300" y="332" textAnchor="middle" fill="#8B6FFF" fontSize="8" fontFamily="monospace">{"<SignIn />"}</text>
        </motion.g>

        {/* Animated data particles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`particle-${i}`}
            r="3"
            fill="#6C47FF"
            animate={{
              cx: [300, 150, 300, 450, 300],
              cy: [80, 120, 200, 250, 320],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </motion.circle>
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6C47FF" />
            <stop offset="100%" stopColor="#17CCFC" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C47FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#17CCFC" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
