import React from "react";
import {
  HeroSection,
  PopularLinks,
  BestsellersSection,
  ShopTheLookSection,
  FamousPaintingsSection,
  SamplesCompareSection,
  AudioStoriesSection,
  WhyChooseSection,
  ArtistsRow,
  NewsletterSection,
  PhotoToPaintingSection,
  TrustStrip,
  SeoFaqSection,
} from "@/components/home";
import {
  getPaintings,
  getReviews,
  getArtists,
  getAudioStories,
} from "@/lib/api";

export default async function HomePage() {
  // Dynamic collections from database
  const [paintings, reviews, artists, audioStories] = await Promise.all([
    getPaintings({ limit: 12 }),
    getReviews({ featured: true }),
    getArtists(),
    getAudioStories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 6.1 Hero Section (Curated Museum Gallery Wall Masterpieces) */}
      <HeroSection review={reviews[0]} />

      {/* 6.2 Popular Trending Movements & Artists */}
      <PopularLinks />

      {/* 6.3 Dynamic Bestsellers Carousel Section (From MongoDB) */}
      <BestsellersSection paintings={paintings} />

      {/* 6.4 Shop The Look Room Visualiser (Curated Architectural Rooms) */}
      <ShopTheLookSection paintings={paintings} />

      {/* 6.5 Famous Paintings & Review Slider (From MongoDB) */}
      <FamousPaintingsSection reviews={reviews} />

      {/* 6.6 Reproduction Samples Comparison (Museum Original vs Archival Canvas Macro Texture) */}
      <SamplesCompareSection />

      {/* 6.7 Audio Stories Section (Curated Narrative Masterpieces) */}
      <AudioStoriesSection stories={audioStories} />

      {/* 6.8 Why Choose YourMuseum Promise (Master Framing Craftsman Studio) */}
      <WhyChooseSection />

      {/* 6.9 Dynamic Artists Horizontal Row (From MongoDB) */}
      <ArtistsRow artists={artists} />

      {/* 6.10 Floating Framed Newsletter Section (Curator's Circle) */}
      <NewsletterSection />

      {/* 6.11 Photo To Painting Before/After Interactive Slider (Curated Heirloom Commissions) */}
      <PhotoToPaintingSection />

      {/* 6.12 Trust Strip (Nationwide Safe Delivery & Archival Guarantee) */}
      <TrustStrip />

      {/* 6.13 SEO FAQ Section + JSON-LD Schema */}
      <SeoFaqSection />
    </div>
  );
}
