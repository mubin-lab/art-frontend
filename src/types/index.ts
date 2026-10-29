export type FrameOrientation = "horizontal" | "vertical" | "square";

export type FrameOption = {
  id: string;
  name: "Gold" | "Silver white" | "Silver";
  swatch: string;
};

export type SizeOption = {
  id: string;
  label: string;
  feetLabel?: string;
  hatLabel?: string;
  dimensions?: string;
  widthInch?: number;
  heightInch?: number;
  price: number;
};

export type CustomerFeedback = {
  customer_name: string;
  customer_img: string;
  customer_product?: string; // Image of painting hanging in customer's home / on wall
  feedback: string;
  rating: number;
  customer_location: string;
};

export type Painting = {
  id: string;
  slug: string;
  title: string;
  artistSlug: string;
  artistName: string;
  movement: string; // eyebrow, e.g. "Post-Impressionism"
  image: string;
  year: string;
  medium: string;
  location: string;
  dimensions: string;
  priceFrom: number;
  priceWas?: number;
  discountPercent?: number; // Discount percentage set by admin, e.g. 50 = '50% OFF'
  currency: "BDT" | "USD";
  freeDelivery?: boolean; // true = Free delivery, false = Standard delivery charge applies
  deliveryFee?: number; // Base delivery charge in BDT Taka (e.g. 70 = ৳70 BDT)
  hasAudio?: boolean;
  audioIcon?: "play" | "headphones" | "book";
  bestseller?: boolean;
  top100Rank?: number;
  featured?: boolean;
  orientation?: FrameOrientation;
  frames: FrameOption[];
  sizes: SizeOption[];
  description?: string;
  descriptions?: string[];
  descriptionImage?: string[]; // Array of closeup / detail / studio image URLs
  customerFeedbacks?: CustomerFeedback[]; // Admin-managed customer reviews
};

export type Artist = {
  slug: string;
  name: string;
  avatar: string;
  artworkCount: number;
  bio?: string;
  movement?: string;
};

export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: "Trustpilot";
  paintingSlug?: string;
  paintingTitle?: string;
  paintingImage?: string;
  frameLabel?: string;
  photographer?: string;
};

export type HeroSlide = {
  id: string;
  tag: string;
  linkLabel: string;
  linkHref: string;
  image: string;
  product?: {
    title: string;
    priceFrom: number;
    priceWas: number;
    artist: string;
    thumb: string;
    href: string;
  };
};

export type ArticleBlock =
  | { type: "h2"; content: string; id?: string }
  | { type: "p"; content: string }
  | { type: "quote"; quote: string; attribution?: string }
  | { type: "figure"; image: string; caption: string }
  | { type: "cta"; title: string; subtitle?: string; buttonText: string; buttonHref: string }
  | { type: "divider" };

export type Article = {
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
  artistAvatar?: string;
  date: string;
  medium: string;
  dimensions: string;
  location: string;
  movement: string;
  toc: { id: string; label: string }[];
  blocks: ArticleBlock[];
  series: { title: string; date: string; thumb: string; href: string }[];
  author: { name: string; role: string; bio: string; avatarInitials?: string };
  paintingSlug: string;
};

export type Room = {
  id: string;
  title: string;
  image: string;
  hotspots: {
    id: string;
    x: number;
    y: number;
    paintingSlug: string;
  }[];
};

export type SampleCompare = {
  id: string;
  title: string;
  artist: string;
  originalImage: string;
  canvasImage: string;
};

export type PhotoToPaintingItem = {
  id: string;
  title: string;
  originalPhoto: string;
  paintingResult: string;
  description?: string;
};

export type AudioStory = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  paintingSlug: string;
  image: string;
  audioUrl?: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  announcements: string[];
  socialLinks: { platform: string; url: string }[];
};

export type NavSubColumn = {
  category: string;
  links: { label: string; href: string; count?: number }[];
};

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  columns?: NavSubColumn[];
  featured?: {
    title: string;
    image: string;
    href: string;
  };
};

export type NavigationData = {
  mainNav: NavItem[];
  footerColumns: {
    title: string;
    links: { label: string; href: string }[];
  }[];
};

export type HomeData = {
  heroSlides: HeroSlide[];
  trustBullets: string[];
  popularLinks: { label: string; href: string }[];
  whyChoose: {
    icon: "palette" | "eye" | "frame" | "painter";
    title: string;
    description: string;
  }[];
  faqs: { question: string; answer: string }[];
};
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Framing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderItem = {
  id: string;
  paintingId: string;
  paintingTitle: string;
  paintingImage: string;
  artistName: string;
  sizeLabel: string;
  frameName: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  paymentMethod: "Cash on Delivery (COD)" | "bKash" | "Nagad" | "Bank Transfer";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
};

export type DashboardStats = {
  totalRevenueBDT: number;
  totalOrders: number;
  pendingOrders: number;
  totalArtworks: number;
  recentOrders: Order[];
};
