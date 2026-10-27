import React from "react";
import { getAudioStories } from "@/lib/api";
import { AudioStoriesSection } from "@/components/home/AudioStoriesSection";

export const metadata = {
  title: "Audio Stories Behind Famous Paintings | YourMuseum",
  description: "Listen to the compelling stories, historical secrets, and curatorial narratives behind the world's most famous masterpieces.",
};

export default async function AudioStoriesPage() {
  const stories = await getAudioStories();

  return (
    <div className="bg-[var(--color-bg)] py-12">
      <AudioStoriesSection stories={stories} />
    </div>
  );
}