"use client";

import { useState } from "react";
import ContentCard from "@/components/ContentCard";

interface ContentItem {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  href?: string;
  locked?: boolean;
}

const tabs = ["All", "Webinars", "Articles", "Livestreams"] as const;
type Tab = (typeof tabs)[number];

export default function ContentPageClient({
  content,
}: {
  content: ContentItem[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered =
    activeTab === "All"
      ? content
      : content.filter(
          (item) =>
            item.category.toLowerCase() ===
            activeTab.toLowerCase().replace(/s$/, "")
        );

  return (
    <section className="py-16 md:py-24 bg-white" aria-label="Browse content">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="sr-only">Browse All Content</h2>
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter by content type">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-obsidian/60 border-card-border hover:border-card-hover hover:text-obsidian"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <ContentCard
              key={item.title}
              title={item.title}
              date={item.date}
              category={item.category}
              excerpt={item.excerpt}
              href={item.href}
              locked={item.locked}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-obsidian/60 py-12">
            No content in this category yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
