# Admin Product Creation & Management Blueprint
**System**: Museum-Quality Framed Canvas Art Gallery (ক্যানভাস আর্ট ও সলিড উড ফ্রেম) - Bangladesh & BDT  
**Target Market**: Bangladesh (Native BDT ৳ currency)

---

## 1. Overview
This document serves as the complete technical blueprint for creating and updating artwork products in the admin panel. When an admin creates or edits a painting, they only need to fill in primary attributes. All secondary pricing multipliers, frame options, size variants, delivery fees, customer feedback carousels, and story blog sections are calculated and structured automatically by the system.

---

## 2. Product Field Specifications (Admin Input Form)

| Field Name | Type | Required? | Description & Logic | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Auto-generated / Text | **Yes** | Unique 5-digit ID (e.g. `10025`) or UUID. Used in SEO URLs: `/painting/{id}-{slug}` | `"10025"` |
| `slug` | Text (Auto-slugified) | **Yes** | URL-friendly lowercase string derived from title | `"the-starry-night"` |
| `title` | Text | **Yes** | Artwork title | `"The Starry Night"` |
| `artistName` | Text / Select | **Yes** | Artist full name | `"Vincent van Gogh"` |
| `artistSlug` | Select | **Yes** | Artist URL slug | `"vincent-van-gogh"` |
| `movement` | Text / Select | **Yes** | Art movement / category (Eyebrow text) | `"Post-Impressionism"` |
| `image` | Image Upload / URL | **Yes** | Primary high-resolution framed artwork image | `"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80"` |
| `orientation` | Select (Dropdown) | **Yes** | Aspect ratio: `"horizontal"` \| `"vertical"` \| `"square"` | `"horizontal"` |
| `priceFrom` | Number (BDT) | **Yes** | **Base Price** in Bangladeshi Taka for 1 Feet size | `35880` *(means ৳35,880)* |
| `discountPercent` | Number (%) | Optional | Discount percentage for badge (e.g. 50 = `50% OFF`). Leave 0 or empty for no discount | `50` |
| `freeDelivery` | Toggle (Switch) | **Yes** | `true` = Free delivery (`৳0`), `false` = Standard charge | `false` |
| `deliveryFee` | Number (BDT) | Optional | Delivery fee in Taka (only used if `freeDelivery` is `false`) | `70` *(means ৳70)* |
| `year` | Text | **Yes** | Year of original painting | `"1889"` |
| `medium` | Text | **Yes** | Original artwork medium | `"Oil on canvas"` |
| `location` | Text | **Yes** | Current museum or gallery location | `"Museum of Modern Art, New York"` |
| `dimensions` | Text | **Yes** | Dimensions of the museum original | `"73.7 cm × 92.1 cm"` |
| `bestseller` | Checkbox / Toggle | Optional | Mark as Bestseller badge in catalog | `true` |
| `featured` | Checkbox / Toggle | Optional | Show on homepage featured grid | `true` |
| `descriptionImage` | Dynamic List (Array of URLs) | **Yes** | Array of image URLs for closeup/macro brushstrokes, canvas texture, frame corners, and studio lighting | `["https://...", "https://..."]` |
| `customerFeedbacks` | Dynamic List (Array of Objects) | **Yes** | Customer reviews added during creation or updated anytime. Contains 6 fields: `customer_name`, `customer_img`, `customer_product`, `feedback`, `rating`, `customer_location` | `[ { "customer_name": "Tanvir Rahman", ... } ]` |
| `descriptions` | Dynamic List (Array of Strings) | **Yes** | Story paragraphs for the `/story` blog page. Admin clicks `+ Add Paragraph` to add each section separately | `["Paragraph 1...", "Paragraph 2..."]` |

---

## 3. End-to-End Calculations & Automatic Business Logic

### A. Automatic Canvas Sizing & Multipliers
The admin **never** has to manually input 3 separate sizes or calculate their prices.
Based on the selected `orientation`, the system automatically assigns the 3 standard sizes:

| Orientation | 1 Feet (Multiplier: 1.0x) | 2 Feet (Multiplier: 1.7x) | 3 Feet (Multiplier: 2.5x) |
| :--- | :--- | :--- | :--- |
| **`horizontal`** (3:2) | `18 × 12″` | `36 × 24″` | `54 × 36″` |
| **`vertical`** (2:3) | `12 × 18″` | `24 × 36″` | `36 × 54″` |
| **`square`** (1:1) | `18 × 18″` | `36 × 36″` | `54 × 54″` |

#### Size Price Calculation Formula:
* **Size 1 (1 Feet)**: `price = priceFrom` (e.g. `৳35,880`)
* **Size 2 (2 Feet)**: `price = Math.round((priceFrom * 1.7) / 10) * 10` (e.g. `Math.round(60,996) = ৳61,000`)
* **Size 3 (3 Feet)**: `price = Math.round((priceFrom * 2.5) / 10) * 10` (e.g. `Math.round(89,700) = ৳89,700`)

---

### B. Strike-Through Price (`priceWas`) Calculation
When admin specifies `discountPercent`:
$$	ext{priceWas} = 	ext{Math.round}\left(rac{	ext{priceFrom}}{1 - (	ext{discountPercent} / 100)}
ight)$$

* **Example**: If `priceFrom = 35880` and `discountPercent = 50`:
  $$	ext{priceWas} = rac{35880}{0.50} = \mathbf{71,760	ext{ BDT}}$$
* **UI Display**: Shows `৳35,880`, strike-through `৳71,760`, and badge `50% OFF`.
* **If No Discount**: If `discountPercent` is 0 or empty, no strike-through price and no `% OFF` badge will be rendered.

---

### C. Delivery Charge Calculation (Cart & Checkout)
1. **Free Delivery**:
   * If `freeDelivery: true` (or `deliveryFee === 0`), UI displays `Delivery: ৳0` and Delivery Charge is `৳0`.
2. **Single Product with Delivery Charge**:
   * If only 1 product in the cart has delivery fee (e.g. `৳70`), UI charges and displays exactly `৳70`.
3. **Multiple Products with Different Charges (Averaging / গড়)**:
   * When multiple products have delivery fees, instead of adding them together, the system computes the **average**:
     $$	ext{Delivery Charge} = rac{\sum 	ext{Paid Delivery Fees}}{	ext{Count of Paid Products}}$$
   * *Example*: Product A fee = `৳70`, Product B fee = `৳100`.
     $$	ext{Cart Delivery Charge} = rac{70 + 100}{2} = \mathbf{৳85}$$

---

### D. Solid Wood Frame Options (Auto-Assigned)
Every artwork automatically includes the 3 handcrafted museum solid wood frames:
```json
"frames": [
  { "id": "gold", "name": "Gold", "swatch": "#d4af37" },
  { "id": "white", "name": "Silver white", "swatch": "#f4f4f4" },
  { "id": "silver", "name": "Silver", "swatch": "#c0c0c0" }
]
```

---

### E. Customer Feedback Slider (`customerFeedbacks: object[]`)
The admin can add 1 or more customer feedback items during artwork creation, or update/add new feedbacks at any time.
On the `/painting/[slug]` page, these feedbacks are automatically rendered as an interactive slider/carousel **directly above the FAQ section**.

Each feedback item in `customerFeedbacks` contains **6 fields**:
1. `customer_name` *(String)*: Full name of the art buyer (e.g. `"Tanvir Rahman"`).
2. `customer_img` *(String)*: Avatar/portrait photo URL of the customer (e.g. Unsplash portrait URL).
3. `customer_product` *(String)*: Real photo of the framed painting received by the customer and displayed in their room/home/wall. Rendered as a clickable photo thumbnail with zoom preview in the feedback card.
4. `feedback` *(String)*: Authentic quote describing the texture, frame quality, packaging, and home display experience.
5. `rating` *(Number)*: Star rating from 1 to 5 (e.g. `5` or `4.8`).
6. `customer_location` *(String)*: Bangladeshi city or district location (e.g. `"Gulshan-2, Dhaka"`, `"Dhanmondi, Dhaka"`, `"Panchlaish, Chittagong"`, `"Zindabazar, Sylhet"`).

#### UI Behavior:
* Renders with star rating badge, quote styling, customer avatar, name, location pin, and a "Verified Buyer" badge.
* Provides next/prev arrows, touch swipe on mobile, and automatic smooth cycling every 6 seconds.

---

### F. Artwork Detail Images (`descriptionImage: string[]`)
The admin can upload or paste multiple high-resolution detail image URLs into the `descriptionImage` array:
* **Purpose**: Showcase brushstroke impasto, canvas woven grain, frame profile corners, and studio lighting.
* **UI Placement**:
  1. **Painting Detail Page (`/painting/[slug]`)**: Rendered as a thumbnail gallery directly below the framed artwork preview. Clicking any thumbnail opens the image in the high-resolution 1.75x lightbox modal.
  2. **Artwork Story & Blog Page (`/painting/[slug]/story`)**: Displayed as the "Archival Brushwork & Studio Details" gallery.

---

### G. Story & Blog Descriptions (`descriptions: string[]`)
* Admin UI has a dynamic textarea repeater:
  * `[ Textarea: Paragraph 1 - Historical Moment & Genesis ]`
  * `[ Textarea: Paragraph 2 - Artistic Style, Color & Brushwork ]`
  * `[ Textarea: Paragraph 3 - Symbolism & Meaning ]`
  * `[ Textarea: Paragraph 4 - Museum Provenance & Reproduction ]`
* When submitted, it saves as a clean array of strings: `descriptions: ["...", "...", "..."]`.
* This array feeds directly into the dedicated `/painting/{id}-{slug}/story` page.

---

## 4. Complete Database / JSON Record Example

When an admin saves a new artwork, the resulting object looks like this:

```json
{
  "id": "10025",
  "slug": "the-starry-night",
  "title": "The Starry Night",
  "artistSlug": "vincent-van-gogh",
  "artistName": "Vincent van Gogh",
  "movement": "Post-Impressionism",
  "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80",
  "orientation": "horizontal",
  "currency": "BDT",
  "priceFrom": 35880,
  "priceWas": 71760,
  "discountPercent": 50,
  "freeDelivery": false,
  "deliveryFee": 70,
  "year": "1889",
  "medium": "Oil on canvas",
  "location": "Museum of Modern Art, New York",
  "dimensions": "73.7 cm × 92.1 cm",
  "bestseller": true,
  "featured": true,
  "frames": [
    { "id": "gold", "name": "Gold", "swatch": "#d4af37" },
    { "id": "white", "name": "Silver white", "swatch": "#f4f4f4" },
    { "id": "silver", "name": "Silver", "swatch": "#c0c0c0" }
  ],
  "sizes": [
    {
      "id": "1-hat",
      "feetLabel": "1 Feet",
      "dimensions": "18 × 12″",
      "widthInch": 18,
      "heightInch": 12,
      "label": "1 Feet (18 × 12″)",
      "price": 35880
    },
    {
      "id": "2-hat",
      "feetLabel": "2 Feet",
      "dimensions": "36 × 24″",
      "widthInch": 36,
      "heightInch": 24,
      "label": "2 Feet (36 × 24″)",
      "price": 61000
    },
    {
      "id": "3-hat",
      "feetLabel": "3 Feet",
      "dimensions": "54 × 36″",
      "widthInch": 54,
      "heightInch": 36,
      "label": "3 Feet (54 × 36″)",
      "price": 89700
    }
  ],
  "descriptionImage": [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&q=80",
    "https://images.unsplash.com/photo-1582561121162-71d27194305a?w=900&q=80"
  ],
  "customerFeedbacks": [
    {
      "customer_name": "Tanvir Rahman",
      "customer_img": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
      "customer_product": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      "feedback": "The canvas print resolution and rich textured finish on this piece are breathtaking! The Gold frame has a regal, museum-grade weight. It transformed our living room wall in Gulshan.",
      "rating": 5,
      "customer_location": "Gulshan-2, Dhaka"
    },
    {
      "customer_name": "Nusrat Jahan",
      "customer_img": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
      "feedback": "Received studio approval photos before shipping, which gave me total confidence. Arrived in a reinforced wooden crate without a single scratch. Truly 100% hand-painted!",
      "rating": 5,
      "customer_location": "Dhanmondi, Dhaka"
    },
    {
      "customer_name": "Dr. Shafiqul Islam",
      "customer_img": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
      "feedback": "I ordered the 3 Feet canvas. The vibrant archival colors and canvas texture match museum originals. Delivery was prompt and the hanging hardware made installation effortless.",
      "rating": 5,
      "customer_location": "Banani DOHS, Dhaka"
    }
  ],
  "descriptions": [
    "Painted in June 1889 from the east-facing barred window of his asylum room at Saint-Rémy-de-Provence, 'The Starry Night' represents Vincent van Gogh's emotional transcendence over intense suffering...",
    "Van Gogh used thick, undulating impasto applied with ferocious confidence, blending ultramarine, cobalt, and glowing zinc-yellow hues...",
    "The stylized village at the base of the canvas is largely idealized, reminiscent of the rustic Dutch steeples of Van Gogh's youth...",
    "Today, 'The Starry Night' resides in the permanent collection of the Museum of Modern Art (MoMA) in New York, celebrated as one of Western art's greatest treasures..."
  ]
}
```

---

## 5. Admin Form UI Recommendations
1. **Live Preview Panel**: Show the live 1 Feet, 2 Feet, 3 Feet prices and discount badge updating in real-time as the admin types the Base Price and Discount %.
2. **Auto-Fill Slug**: When typing the title `"The Starry Night"`, automatically set the slug to `"the-starry-night"`.
3. **Customer Feedback Repeater Card**:
   * Provide an `[+ Add Customer Review]` button.
   * Each feedback block renders 5 simple inputs:
     - `Customer Name` (Text input)
     - `Customer Image URL / Photo Upload` (Text/File input)
     - `Customer Product Photo` (Image URL / Upload: photo of painting hanging in customer's room)
     - `Feedback Review` (Textarea)
     - `Rating` (1 to 5 Star selector / Number input)
     - `Customer Location` (Text input, e.g. "Dhanmondi, Dhaka")
   * Include a `[Delete / Trash]` icon on each feedback card.
4. **Detail Images (`descriptionImage`) Multi-Upload / Repeater**:
   * Provide an `[+ Add Detail Image]` button or multi-file drag-and-drop zone.
   * Admins can reorder detail images and preview them as small thumbnails before publishing.
5. **Story Paragraph Repeater**: Provide `[+ Add Paragraph]` and `[Trash]` buttons so the admin can write 2 to 5 paragraphs effortlessly.
6. **Delivery Charge Input**: Disable the `deliveryFee` number input when `freeDelivery` toggle is active.
