// components/CTASection.tsx
'use client'
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to run your club like a pro?</h2>
        <p className="text-lg mb-8">
          ClubOS is free to use for student organizations. Start managing better today.
        </p>
        <Button size="lg" variant="secondary">
          Get Started For Free
        </Button>
      </motion.div>
    </section>
  );
}
