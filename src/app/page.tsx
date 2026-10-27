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
  getHomeData,
  getPaintings,
  getReviews,
  getArtists,
  getAudioStories,
  getRooms,
  getSamples,
  getPhotoToPainting,
} from "@/lib/api";

export default async function HomePage() {
  const [
    homeData,
    paintings,
    reviews,
    artists,
    audioStories,
    rooms,
    samples,
    photoToPainting,
  ] = await Promise.all([
    getHomeData(),
    getPaintings({ limit: 12 }),
    getReviews({ featured: true }),
    getArtists(),
    getAudioStories(),
    getRooms(),
    getSamples(),
    getPhotoToPainting(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 6.1 Hero Section */}
      <HeroSection
        slides={homeData.heroSlides}
        review={reviews[0]}
        trustBullets={homeData.trustBullets}
      />

      {/* 6.2 Popular Links */}
      <PopularLinks links={homeData.popularLinks} />

      {/* 6.3 Bestsellers Carousel Section */}
      <BestsellersSection paintings={paintings} />

      {/* 6.4 Shop The Look Room Visualiser */}
      <ShopTheLookSection rooms={rooms} paintings={paintings} />

      {/* 6.5 Famous Paintings & Review Slider */}
      <FamousPaintingsSection reviews={reviews} />

      {/* 6.6 Reproduction Samples Comparison */}
      <SamplesCompareSection samples={samples} />

      {/* 6.7 Audio Stories Section */}
      <AudioStoriesSection stories={audioStories} />

      {/* 6.8 Why Choose YourMuseum Promise */}
      <WhyChooseSection items={homeData.whyChoose} />

      {/* 6.9 Artists Horizontal Row */}
      <ArtistsRow artists={artists} />

      {/* 6.10 Floating Framed Newsletter Section */}
      <NewsletterSection />

      {/* 6.11 Photo To Painting Before/After Slider */}
      <PhotoToPaintingSection items={photoToPainting} />

      {/* 6.12 Trust Strip */}
      <TrustStrip />

      {/* 6.13 SEO FAQ Section + JSON-LD Schema */}
      <SeoFaqSection faqs={homeData.faqs} />
    </div>
  );
}