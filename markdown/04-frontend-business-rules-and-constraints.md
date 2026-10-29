# 04 - Frontend Business Rules & Non-Negotiable Constraints

This document defines the strict business rules, legal positioning, currency standards, and sizing constraints that **MUST NEVER BE VIOLATED** when developing or modifying frontend features.

---

## 1. ⚠️ Strict Product Positioning (Consumer Trust Rule)

> [!CRITICAL]
> **NEVER** claim or advertise that we sell "100% hand-painted original oil paintings" or that artists hand-paint original oil replicas on canvas. Making false claims of real oil painting is deceptive and strictly prohibited.

### Required Terminology:
- **Correct Description**:
  - *"Museum-Quality Canvas Art Prints on Solid Wood Frames"*
  - *"High-Definition Textured Fine Art Canvas Reproduction"*
  - *"Hand-Framed Museum Masterpiece Reproduction"*
  - *"Solid Wood Framed Canvas Wall Art"*
- **Prohibited Words**:
  - ❌ *"Original 100% Hand-Painted Oil Painting"*
  - ❌ *"Painted by master artists with oil brushes"*

---

## 2. 🇧🇩 Currency & Native BDT Pricing

- **Primary Currency**: **Bangladeshi Taka (`BDT` / `৳`)**.
- **Display Conventions**:
  - Prefer the Bengali Taka symbol `৳` or `Tk`:
    ```tsx
    <Price amount={4800} /> // Outputs: ৳4,800
    ```
  - When discount is active, display strikethrough original price alongside discounted price:
    ```tsx
    <span className="text-sm line-through text-[#8c8c8c]">৳6,000</span>
    <span className="text-base font-semibold text-ink">৳4,800</span>
    ```

---

## 3. 📐 Sizing Standards: Feet & Centimeters

Bangladeshi home decorators evaluate wall art in **Feet (`ft`)** and **Centimeters (`cm`)**:

| Size ID | Tier Label | Feet Dimension | Metric Dimension | Typical Aspect Ratio |
|---|---|---|---|---|
| `s` | **Small** | `1 × 1.3 ft` | `30 × 40 cm` | 3:4 or 2:3 |
| `m` | **Medium** | `1.5 × 2 ft` | `45 × 60 cm` | 3:4 or 2:3 |
| `l` | **Large** | `2 × 3 ft` | `60 × 90 cm` | 2:3 |
| `xl` | **Extra Large** | `2.5 × 4 ft` | `75 × 120 cm` | Panoramic / Grande |

### Size Picker UI Rule:
Always present both units in the size selector pills:
```tsx
<div className="flex flex-col">
  <span className="font-semibold text-ink">{size.label} ({size.feet})</span>
  <span className="text-xs text-[#767676]">{size.cm}</span>
</div>
```

---

## 4. 🚚 Delivery System & Rate Table

| Destination | Delivery Charge | Condition |
|---|---|---|
| **Inside Dhaka City** | **৳70** | Standard 24–48 hours home delivery |
| **Outside Dhaka (All BD)** | **৳120** | RedX / Steadfast courier delivery (3–5 days) |
| **Orders over ৳15,000** | **FREE (৳0)** | Automatic free shipping at checkout |

- When a painting has `freeDelivery: true` set by admin, delivery fee is waived regardless of total order amount.

---

## 5. 🖼️ Customer Feedback & Real Wall Photos

Every customer review card in `CustomerFeedbackSlider.tsx` must showcase:
1. `customer_name`: Full name (e.g., *"Farhana Ahmed"*).
2. `customer_img`: Profile photo of the customer.
3. `customer_location`: Area in Bangladesh (e.g., *"Banani, Dhaka"*, *"Panchlaish, Chittagong"*).
4. `rating`: 1 to 5 gold stars.
5. `feedback`: Honest, emotional testimonial about the canvas print quality and framing.
6. **`customer_product`**: **MANDATORY** real photograph showing the framed canvas art mounted on their actual living room, dining room, or bedroom wall.
