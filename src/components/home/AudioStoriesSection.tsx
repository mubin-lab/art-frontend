"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Volume2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AudioStory } from "@/types";

interface AudioStoriesSectionProps {
  stories?: AudioStory[];
}

const STATIC_AUDIO_STORIES: AudioStory[] = [
  {
    id: "audio-1",
    title: "Swirling Madness: The Asylum Night Sky",
    artist: "Vincent van Gogh",
    duration: "4:15",
    paintingSlug: "the-starry-night",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/600px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  },
  {
    id: "audio-2",
    title: "Gold and Passion: The Secret Romance",
    artist: "Gustav Klimt",
    duration: "5:30",
    paintingSlug: "the-kiss",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/600px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
  },
  {
    id: "audio-3",
    title: "The Floating World: Surviving the Wave",
    artist: "Katsushika Hokusai",
    duration: "3:48",
    paintingSlug: "the-great-wave",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/600px-Tsunami_by_hokusai_19th_century.jpg",
  },
  {
    id: "audio-4",
    title: "Water Lilies: Reflections of Giverny",
    artist: "Claude Monet",
    duration: "6:12",
    paintingSlug: "water-lilies",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg/600px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project.jpg",
  },
  {
    id: "audio-5",
    title: "The Enigma of the Louvre: Mona Lisa",
    artist: "Leonardo da Vinci",
    duration: "5:04",
    paintingSlug: "mona-lisa",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/600px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  },
  {
    id: "audio-6",
    title: "The Delft Sphinx: Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    duration: "4:32",
    paintingSlug: "girl-with-a-pearl-earring",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/600px-1665_Girl_with_a_Pearl_Earring.jpg",
  },
];

export function AudioStoriesSection({ stories = STATIC_AUDIO_STORIES }: AudioStoriesSectionProps) {
  const effectiveStories = stories && stories.length > 0 ? stories : STATIC_AUDIO_STORIES;
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const activeStory = effectiveStories.find((s) => s.id === playingId);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 mt-8 sm:mt-12">
          {effectiveStories.map((story) => {
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
                      sizes="(max-width: 640px) 45vw, 180px"
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

                  <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[9px] sm:text-[10px] font-mono text-white/90 bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md backdrop-blur-xs">
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
          <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:w-auto max-w-md mx-auto bg-[var(--color-ink)] text-white px-4 sm:px-6 py-3 rounded-full shadow-2xl flex items-center justify-between gap-3 z-50 border border-[#ceab51]/30 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <Volume2 className="w-5 h-5 text-[#ceab51] animate-pulse flex-shrink-0" />
              <div className="text-xs font-sans truncate">
                <span className="font-bold text-white block truncate">
                  {activeStory.title}
                </span>
                <span className="text-[#b5afa6] text-[11px] truncate block">
                  Playing narrative · {activeStory.duration} · {activeStory.artist}
                </span>
              </div>
            </div>
            <button
              onClick={() => togglePlay(activeStory.id)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-[#ceab51] text-white hover:text-black flex-shrink-0 cursor-pointer transition-colors"
              aria-label="Pause narrative"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
