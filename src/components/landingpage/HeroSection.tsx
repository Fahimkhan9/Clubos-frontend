"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Background blur glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60rem] h-[60rem] bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
        >
          Organize Your Club. <br />
          Empower Every Member.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Manage clubs, events, tasks, budgets, and more — all in one place. ClubOS simplifies student organization management like never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <Button size="lg" className="text-base px-6 py-3">
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-6 py-3 flex items-center gap-2"
          >
            <Sparkles size={18} />
            Live Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
