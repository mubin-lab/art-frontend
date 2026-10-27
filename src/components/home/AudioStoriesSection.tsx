"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Volume2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AudioStory } from "@/types";

interface AudioStoriesSectionProps {
  stories: AudioStory[];
}

export function AudioStoriesSection({ stories = [] }: AudioStoriesSectionProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const activeStory = stories.find((s) => s.id === playingId);

  return (
    <section className="py-12 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="YOURMUSEUM AUDIO STORIES"
          title="Listen to the Story Behind the Painting"
          subtitle="Every painting story, read aloud by art historians and curators."
          actionText="BROWSE ALL AUDIO →"
          actionHref="/audio-stories"
          align="center"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {stories.map((story) => {
            const isPlaying = playingId === story.id;
            return (
              <div
                key={story.id}
                className="group relative bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-[#ece7df]"
              >
                {/* Image panel with blurred background */}
                <div className="relative w-full h-[150px] sm:h-[190px] rounded-xl overflow-hidden bg-[#181615]">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-md brightness-75 scale-125"
                    style={{ backgroundImage: `url(${story.image})` }}
                  />
                  <div className="absolute inset-2 flex items-center justify-center">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={() => togglePlay(story.id)}
                    aria-label={isPlaying ? "Pause story" : "Play story"}
                    className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-ink)] hover:bg-[#ceab51] text-white hover:text-black flex items-center justify-center shadow-lg transition-colors cursor-pointer z-10"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[9px] sm:text-[10px] font-mono text-white/90 bg-black/50 px-1.5 sm:px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {story.duration}
                  </span>
                </div>

                <div className="pt-2 sm:pt-3">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] text-[#a8844a] block font-sans truncate">
                    {story.artist}
                  </span>
                  <Link
                    href={`/painting/${story.paintingSlug}`}
                    className="font-serif text-xs sm:text-sm font-semibold text-[var(--color-ink)] group-hover:text-[#a8844a] transition-colors line-clamp-2 mt-0.5"
                  >
                    {story.title}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Persistent Sticky Mini Player when active */}
        {activeStory && (
          <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-auto max-w-md mx-auto bg-[var(--color-ink)] text-white px-4 sm:px-6 py-3 rounded-full shadow-2xl flex items-center justify-between gap-3 z-50 border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <Volume2 className="w-5 h-5 text-[#ceab51] animate-pulse flex-shrink-0" />
              <div className="text-xs font-sans truncate">
                <span className="font-bold text-white block truncate">
                  {activeStory.title}
                </span>
                <span className="text-white/60 text-[11px] truncate block">
                  Playing narrative · {activeStory.duration}
                </span>
              </div>
            </div>
            <button
              onClick={() => togglePlay(activeStory.id)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white text-black flex-shrink-0 cursor-pointer"
              aria-label="Pause narrative"
            >
              <Pause className="w-4 h-4 text-white hover:text-black" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}