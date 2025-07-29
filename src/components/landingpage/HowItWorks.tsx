// components/HowItWorks.tsx

'use client'
import { motion } from "framer-motion";

const steps = [
  "Create your club and invite members",
  "Plan events and assign roles",
  "Track tasks and progress visually",
  "Manage your club’s budget with ease",
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <p className="text-muted-foreground mb-12">
          Get started in just a few steps — ClubOS handles the rest.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-muted/20 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">Step {index + 1}</h3>
              <p className="text-muted-foreground">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
