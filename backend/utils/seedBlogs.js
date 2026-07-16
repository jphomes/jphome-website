require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const DEMO_BLOGS = [
  {
    title: "Why Indiranagar Still Commands a Premium",
    excerpt:
      "Walkable streets, mature trees, and a café culture that refuses to fade — here's what buyers are actually paying for in 2026.",
    content: `Indiranagar has never been the cheapest address in Bengaluru, and it probably never will be. What keeps demand steady is a combination of factors that spreadsheets rarely capture.

First, connectivity. The metro changed the calculus for families who work across the city but want a neighbourhood that feels lived-in, not manufactured. Second, rental depth — even owners who don't plan to sell find comfort in knowing their asset can be let within weeks.

For buyers, the advice is simple: prioritise natural light and street width over cosmetic upgrades. A well-oriented 3BHK on a quieter cross-street will outperform a flashy interior on a noisy main road every time.

If you're comparing two listings in the same budget band, walk both buildings at 7pm on a weekday. The right choice usually announces itself.`,
    coverImage:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    category: "Neighbourhood Guide",
    tags: ["Indiranagar", "Buyer Tips", "Bengaluru"],
    readTimeMinutes: 5,
  },
  {
    title: "The First-Time Buyer's Checklist Before You Visit",
    excerpt:
      "A practical walk-through of documents, red flags, and questions to ask before you fall in love with a floor plan.",
    content: `Falling for a home is easy. Verifying it is the work. Before you schedule a second visit, confirm the basics: title clarity, approved building plan, and whether the society has pending litigation or major repair dues.

On site, check water pressure on upper floors, mobile signal in interior rooms, and whether the parking allocation matches what's on paper. Ask about summer heat on the western face and monsoon seepage in the past three years — not as scepticism, but as due diligence.

Bring one sceptical friend. They'll notice the awkward column, the view that disappears at night, or the lift that groans on the way up. You'll thank them later.

Finally, align your loan pre-approval with realistic closing timelines. The best deals go to buyers who can move from offer to agreement without drama.`,
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    category: "Buyer Guide",
    tags: ["First Home", "Due Diligence"],
    readTimeMinutes: 6,
  },
  {
    title: "Villas vs. Apartments: A Honest Comparison",
    excerpt:
      "Space, maintenance, community, and resale — how to choose the right format for how you actually live.",
    content: `The villa versus apartment debate isn't about prestige. It's about maintenance appetite and daily rhythm.

Villas reward families who want gardens, home offices, and fewer shared walls. They ask for more upkeep — security, gardening, and the occasional plumbing surprise that no society office will fix for you.

Apartments trade some privacy for convenience: gyms, backup power, and a front desk that remembers your courier preferences. For many professionals, that trade is worth every square foot surrendered.

Resale liquidity differs by micro-market. In established corridors, well-maintained apartments in compact societies often move faster than standalone villas priced ambitiously. In newer layouts, villas with sensible plots can surprise you on appreciation if infrastructure arrives on schedule.

Choose the format that matches your next five years, not your weekend imagination.`,
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    category: "Market Insights",
    tags: ["Villa", "Apartment", "Lifestyle"],
    readTimeMinutes: 4,
  },
  {
    title: "What ₹2–3 Crore Buys You in Bengaluru Today",
    excerpt:
      "A realistic snapshot of size, location, and finish quality across the city's most searched price band.",
    content: `The ₹2–3 crore band is where most serious upgraders land — and where expectations collide with reality fastest.

In central neighbourhoods, this budget often means a thoughtfully renovated 3BHK in a older society, or a compact new-build with premium fittings but modest square footage. Move outward to established suburbs and the same ticket buys genuine space: a 4BHK with parking, or a villa plot with a modest built-up area.

Finish quality varies wildly at this price. Some developers sell lifestyle branding; others deliver structural substance with simpler interiors. Learn to read the difference — floor-to-floor height, window quality, and ventilation matter more than imported tile names.

Work backwards from your non-negotiables. If school proximity is fixed, accept a smaller kitchen. If you need a home office, prioritise layout over lobby aesthetics. The market will meet you halfway if you're precise.`,
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    category: "Market Insights",
    tags: ["Pricing", "Bengaluru", "Budget"],
    readTimeMinutes: 5,
  },
  {
    title: "Staging a Home for Viewings That Convert",
    excerpt:
      "Small, inexpensive adjustments that help buyers imagine themselves in the space — without hiding flaws.",
    content: `Good staging doesn't disguise problems. It removes friction. Start with light — open curtains, replace dim bulbs, and ensure every room has a clear purpose. A spare bedroom reads better as a study than as storage overflow.

Declutter surfaces ruthlessly. Kitchen counters, bathroom shelves, and balcony corners are where viewings stall. Buyers aren't judging your taste; they're measuring whether their life fits.

Add one sensory detail: fresh flowers near the entrance, or a subtle scent in living areas. Keep music off unless the street is noisy — silence helps people notice ceiling height and natural breeze.

Finally, be out of the house for third-party viewings when possible. Buyers open cabinets and ask blunt questions. They shouldn't feel they're auditioning in front of the owner.`,
    coverImage:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop",
    category: "Seller Tips",
    tags: ["Staging", "Selling"],
    readTimeMinutes: 4,
  },
  {
    title: "Rental Yields in South Bengaluru: 2026 Outlook",
    excerpt:
      "Where rents are holding firm, where they're softening, and what landlords should expect this year.",
    content: `South Bengaluru's rental market in 2026 is a tale of two tenant profiles: domestic professionals seeking walkability, and expat assignees prioritising security and service.

Corridors near tech parks continue to absorb 2 and 3BHK inventory with minimal vacancy, especially in societies with reliable power and honest maintenance billing. Premium rents, however, are testing tenant patience — landlords who price 8–10% above the last comparable deal are sitting longer.

Furnished units command a premium only when the furniture is cohesive and modern, not when it's a collection of mismatched hand-me-downs. Internet readiness and a usable work nook are now baseline expectations.

For investors, gross yields around 3–3.5% remain common in quality stock. The play is appreciation plus steady tenancy, not cash flow alone. Price your rental realistically at renewal; the best tenants are often the ones already in place.`,
    coverImage:
      "https://images.unsplash.com/photo-1605276374101-de4c0a9a472b?q=80&w=1200&auto=format&fit=crop",
    category: "Investment",
    tags: ["Rental", "Yield", "Landlord"],
    readTimeMinutes: 5,
  },
];

(async () => {
  try {
    const { resolveMongoUri } = require("./mongoUri");
    const mongo = resolveMongoUri();
    await mongoose.connect(mongo.uri);

    const existing = await Blog.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} blog posts. Skipping seed.`);
      process.exit(0);
    }

    await Blog.insertMany(DEMO_BLOGS);
    console.log(`✅ Seeded ${DEMO_BLOGS.length} demo blog posts.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed blogs:", err.message);
    process.exit(1);
  }
})();
