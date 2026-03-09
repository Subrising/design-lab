"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface ProductCard {
  title: string;
  description: string;
  gradient: string;
  features: string[];
  visual: React.ReactNode;
}

const products: ProductCard[] = [
  {
    title: "Payments",
    description: "Accept payments from anywhere. Deploy a payments form in minutes.",
    gradient: "from-[#635bff] to-[#0048ff]",
    features: ["135+ currencies", "Optimized checkout", "3DS2 authentication", "Real-time reporting"],
    visual: <PaymentsVisual />,
  },
  {
    title: "Connect",
    description: "Build a platform or marketplace with multi-party payments.",
    gradient: "from-[#00d4ff] to-[#0048ff]",
    features: ["Onboard sellers", "Split payments", "Instant payouts", "KYC & compliance"],
    visual: <ConnectVisual />,
  },
  {
    title: "Billing",
    description: "Build and scale your recurring business model.",
    gradient: "from-[#7dd3a8] to-[#00d4ff]",
    features: ["Subscription logic", "Smart retries", "Revenue recovery", "Usage-based billing"],
    visual: <BillingVisual />,
  },
  {
    title: "Radar",
    description: "Fight fraud with machine learning, no additional development time.",
    gradient: "from-[#ff6772] to-[#635bff]",
    features: ["ML-powered", "Custom rules", "3D Secure", "Dispute handling"],
    visual: <RadarVisual />,
  },
];

export default function ScrollStory() {
  return (
    <section className="relative py-32">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-stripe-purple font-semibold mb-4 text-lg">A fully integrated suite</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Everything you need to{" "}
            <span className="gradient-text">build &amp; scale</span>
          </h2>
          <p className="text-xl text-white/50 leading-relaxed">
            From accepting payments to managing subscriptions, Stripe provides
            the infrastructure that powers commerce for millions of businesses.
          </p>
        </motion.div>
      </div>

      {/* Product cards with parallax */}
      <div className="space-y-40">
        {products.map((product, i) => (
          <ProductSection key={product.title} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProductSection({ product, index }: { product: ProductCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const cardRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-6">
      <div className={`flex flex-col lg:flex-row items-center gap-16 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${product.gradient} text-sm font-medium mb-4`}>
            {product.title}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h3>
          <p className="text-lg text-white/50 mb-8 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3">
            {product.features.map((feature, fi) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: fi * 0.1 + 0.3 }}
                className="flex items-center gap-2"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${product.gradient}`} />
                <span className="text-sm text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 mt-8 text-stripe-purple hover:text-stripe-cyan transition-colors font-medium"
          >
            Learn more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Visual card with parallax */}
        <motion.div
          style={{ y: parallaxY, rotateX: cardRotateX }}
          className="flex-1 perspective-[1200px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: isEven ? -5 : 5 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${product.gradient} p-[1px]`}
          >
            <div className="bg-[#0a2540]/90 rounded-2xl p-8 min-h-[360px] flex items-center justify-center">
              {product.visual}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* Product-specific visuals */
function PaymentsVisual() {
  return (
    <motion.div className="w-full max-w-sm mx-auto space-y-4">
      {/* Mini payment form */}
      <div className="bg-white rounded-xl p-5 text-gray-900">
        <p className="text-xs font-medium text-gray-400 mb-3">PAY WITH CARD</p>
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3">
            <span className="text-sm text-gray-400">4242 4242 4242 4242</span>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-100 rounded-lg flex-1 flex items-center px-3">
              <span className="text-sm text-gray-400">12 / 28</span>
            </div>
            <div className="h-10 bg-gray-100 rounded-lg flex-1 flex items-center px-3">
              <span className="text-sm text-gray-400">CVC</span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="h-11 bg-stripe-purple rounded-lg flex items-center justify-center"
          >
            <span className="text-sm font-semibold text-white">Pay $29.00</span>
          </motion.div>
        </div>
      </div>
      {/* Animated check */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="flex items-center justify-center gap-2"
      >
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-green-400">Payment successful</span>
      </motion.div>
    </motion.div>
  );
}

function ConnectVisual() {
  const nodes = [
    { x: 50, y: 30, label: "Platform", color: "#635bff" },
    { x: 20, y: 70, label: "Seller A", color: "#00d4ff" },
    { x: 50, y: 70, label: "Seller B", color: "#00d4ff" },
    { x: 80, y: 70, label: "Seller C", color: "#00d4ff" },
  ];

  return (
    <div className="w-full max-w-sm mx-auto relative h-48">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {[1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1="50" y1="38"
            x2={nodes[i].x} y2="62"
            stroke="#425466"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
          />
        ))}
        {/* Animated flow particles */}
        {[1, 2, 3].map((i) => (
          <motion.circle
            key={`p-${i}`}
            r="1.5"
            fill="#635bff"
            initial={{ cx: 50, cy: 38 }}
            animate={{
              cx: [50, nodes[i].x],
              cy: [38, 62],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </svg>
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring" }}
          className="absolute flex flex-col items-center"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: node.color }}
          >
            {node.label[0]}
          </div>
          <span className="text-xs text-white/50 mt-1">{node.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BillingVisual() {
  const bars = [35, 48, 42, 55, 62, 58, 72, 68, 78, 85, 80, 92];
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-white/40">Monthly Recurring Revenue</span>
        <span className="text-lg font-bold text-stripe-green">$84.2k</span>
      </div>
      <div className="flex items-end gap-1.5 h-32">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
            className="flex-1 rounded-t bg-gradient-to-t from-[#7dd3a8] to-[#00d4ff] opacity-80 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-white/30">Jan</span>
        <span className="text-[10px] text-white/30">Dec</span>
      </div>
    </div>
  );
}

function RadarVisual() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {[
        { risk: 2, label: "Normal transaction", amount: "$42.00", status: "Approved" },
        { risk: 45, label: "Unusual location", amount: "$890.00", status: "Review" },
        { risk: 92, label: "Velocity trigger", amount: "$2,340.00", status: "Blocked" },
      ].map((tx, i) => (
        <motion.div
          key={tx.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center justify-between bg-white/5 rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: tx.risk < 30 ? "#7dd3a8" : tx.risk < 70 ? "#ffbb00" : "#ff6772",
                color: "#0a2540",
              }}
            >
              {tx.risk}
            </div>
            <div>
              <p className="text-sm text-white/80">{tx.label}</p>
              <p className="text-xs text-white/40">{tx.amount}</p>
            </div>
          </div>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              color: tx.risk < 30 ? "#7dd3a8" : tx.risk < 70 ? "#ffbb00" : "#ff6772",
              backgroundColor: tx.risk < 30 ? "rgba(125,211,168,0.1)" : tx.risk < 70 ? "rgba(255,187,0,0.1)" : "rgba(255,103,114,0.1)",
            }}
          >
            {tx.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
