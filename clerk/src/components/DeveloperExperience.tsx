"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const codeExamples = [
  {
    tab: "Protect Routes",
    filename: "middleware.ts",
    code: `import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}`,
  },
  {
    tab: "Get User",
    filename: "app/dashboard/page.tsx",
    code: `import { currentUser } from "@clerk/nextjs/server"

export default async function Dashboard() {
  const user = await currentUser()

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>{user?.emailAddresses[0].emailAddress}</p>
    </div>
  )
}`,
  },
  {
    tab: "Organizations",
    filename: "app/api/org/route.ts",
    code: `import { auth } from "@clerk/nextjs/server"

export async function GET() {
  const { orgId, orgRole } = await auth()

  if (!orgId) {
    return new Response("Not in org", { status: 403 })
  }

  if (orgRole !== "org:admin") {
    return new Response("Not admin", { status: 403 })
  }

  return Response.json({ orgId, orgRole })
}`,
  },
  {
    tab: "Webhooks",
    filename: "app/api/webhooks/route.ts",
    code: `import { Webhook } from "svix"

export async function POST(req: Request) {
  const payload = await req.json()
  const headers = Object.fromEntries(req.headers)

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  const event = wh.verify(JSON.stringify(payload), headers)

  if (event.type === "user.created") {
    // Sync user to your database
    await db.users.create({ data: event.data })
  }

  return new Response("OK")
}`,
  },
];

function TypewriterCode({ code }: { code: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < code.length) {
        setDisplayed(code.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [code]);

  return (
    <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
      <code className="text-[#8B8B9E]">
        {displayed}
        {!done && (
          <motion.span
            className="inline-block w-2 h-4 bg-[#6C47FF] ml-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </code>
    </pre>
  );
}

export default function DeveloperExperience() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#6C47FF] mb-4 block">DEVELOPER EXPERIENCE</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for <span className="gradient-text">developers</span>
          </h2>
          <p className="text-lg text-[#8B8B9E] max-w-2xl mx-auto">
            Type-safe APIs, comprehensive docs, and SDKs that feel natural. Ship auth in minutes, not weeks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl bg-[#131320] border border-white/[0.06] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0E0E1A]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto">
              {codeExamples.map((ex, i) => (
                <button
                  key={ex.tab}
                  onClick={() => setActiveTab(i)}
                  className={`relative px-5 py-3 text-sm whitespace-nowrap transition-colors ${
                    activeTab === i ? "text-white" : "text-[#8B8B9E] hover:text-white/70"
                  }`}
                >
                  {activeTab === i && (
                    <motion.div
                      layoutId="code-tab"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#6C47FF]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {ex.tab}
                </button>
              ))}
            </div>

            {/* Filename bar */}
            <div className="px-4 py-2 border-b border-white/5 text-xs text-[#8B8B9E] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="#6C47FF" strokeWidth="1" />
                <path d="M5 4L9 7L5 10" stroke="#6C47FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {codeExamples[activeTab].filename}
            </div>

            {/* Code area */}
            <div className="p-6 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TypewriterCode code={codeExamples[activeTab].code} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "10M+", label: "Monthly authentications" },
            { value: "100K+", label: "Applications" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "<50ms", label: "Auth latency" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-[#8B8B9E] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
