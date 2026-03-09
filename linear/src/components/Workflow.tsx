"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const tabs = [
  {
    id: "plan",
    label: "Plan",
    title: "Set direction with roadmaps",
    description: "Plan features, set priorities, and visualize progress across your entire product. Keep stakeholders aligned with always-current roadmaps.",
    visual: {
      items: [
        { name: "Q1 Launch", progress: 85, color: "bg-linear-purple" },
        { name: "API v2", progress: 60, color: "bg-linear-blue" },
        { name: "Mobile App", progress: 35, color: "bg-linear-teal" },
        { name: "Analytics", progress: 20, color: "bg-emerald-400" },
      ],
    },
  },
  {
    id: "track",
    label: "Track",
    title: "Track every detail",
    description: "From high-level epics to individual tasks, track progress with precision. Automatic status updates keep your team in sync.",
    visual: {
      items: [
        { name: "Completed", progress: 100, color: "bg-green-400" },
        { name: "In Progress", progress: 65, color: "bg-yellow-400" },
        { name: "In Review", progress: 45, color: "bg-linear-blue" },
        { name: "Backlog", progress: 10, color: "bg-white/20" },
      ],
    },
  },
  {
    id: "build",
    label: "Build",
    title: "Build with your tools",
    description: "Deep integrations with GitHub, GitLab, Figma, and Slack. Automate your workflow from commit to deployment.",
    visual: {
      items: [
        { name: "Frontend PR", progress: 90, color: "bg-linear-purple" },
        { name: "Backend API", progress: 75, color: "bg-orange-400" },
        { name: "CI/CD Pipeline", progress: 55, color: "bg-linear-teal" },
        { name: "Deploy", progress: 30, color: "bg-pink-400" },
      ],
    },
  },
];

export default function Workflow() {
  const [activeTab, setActiveTab] = useState("plan");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-purple/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[13px] font-medium text-linear-teal uppercase tracking-widest mb-4">
            Workflow
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] gradient-text">
            Your entire workflow.
            <br />
            One tool.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — tabs + description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Tab switcher */}
            <div className="flex gap-1 glass-strong rounded-xl p-1 mb-10 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-linear-text-secondary hover:text-linear-text"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/[0.08] rounded-lg"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-linear-text mb-4">
                {activeData.title}
              </h3>
              <p className="text-linear-text-secondary text-[15px] leading-relaxed mb-8">
                {activeData.description}
              </p>
              <motion.button
                className="text-[14px] font-medium text-linear-purple hover:text-linear-blue transition-colors group"
                whileHover={{ x: 4 }}
              >
                Learn more <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            className="glass-strong rounded-2xl p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {activeData.visual.items.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-linear-text">{item.name}</span>
                    <span className="text-linear-text-secondary">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
