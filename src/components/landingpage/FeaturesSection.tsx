"use client";

import {
  Users2,
  CalendarCheck,
  BadgeCheck,
  Wallet,
  FileCheck2,
  UserCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Users2 className="h-6 w-6 text-primary" />,
    title: "Club & Member Management",
    description: "Create clubs, invite members, assign roles and designations easily.",
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-primary" />,
    title: "Event Management",
    description:
      "Organize events with support for attendance tracking, file sharing, and task assignments.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6 text-primary" />,
    title: "Task Board",
    description:
      "Plan and manage tasks with a drag-and-drop Jira-style board, with assignees and event links.",
  },
  {
    icon: <Wallet className="h-6 w-6 text-primary" />,
    title: "Budget Tracking",
    description:
      "Monitor club expenses and income using a simple and clear budget dashboard.",
  },
  {
    icon: <FileCheck2 className="h-6 w-6 text-primary" />,
    title: "Attendance Records",
    description:
      "Mark, update, and export event attendance. View individual records per event.",
  },
  {
    icon: <UserCircle2 className="h-6 w-6 text-primary" />,
    title: "Profile System",
    description:
      "Members can view and update their profile information across the platform.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Everything Your Club Needs</h2>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
          From events to budgets to tasks, ClubOS simplifies every part of student club management.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-background p-6 rounded-xl shadow-sm border"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
