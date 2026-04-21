import { ArticleContent } from "@/components/website/ArticleDetailPage/ArticleDetailPage";

export const ARTICLE_MOCK: ArticleContent = {
  id: "featured-1",
  tag: "Travel Insights",
  tagColor: "blue",
  title: "The Seasonal Showdown: Choosing Between Egypt's Sun and Breeze.",
  author: "Ahmed Hassan",
  authorRole: "Travel Writer",
  authorBio:
    "Travel writer and cultural correspondent covering North Africa and the Middle East. Based between Cairo and London, Ahmed has spent 12 years documenting the rhythms of Egyptian life for international publications.",
  date: "03 March 2026",
  readTime: "8 min",
  views: "2.4k",
  heroImage: "/images/home/hero-bg.png",
  heroCaption:
    "The Great Pyramid of Giza — a timeless landmark that stands beautiful in every season.",
  intro:
    "Egypt isn't just a destination — it's a question of timing. The land of pharaohs shifts dramatically between seasons, offering two entirely different travel experiences separated only by a few months on the calendar. Whether you're drawn to the fierce clarity of a desert summer or the gentle warmth of a winter sun, Egypt holds something extraordinary for every kind of traveler.",
  primaryQuote:
    '"Egypt in winter feels like the whole country exhales — cooler temples, quieter crowds, and a light that turns every stone golden."',
  sections: [
    {
      h2: "Winter: The Golden Season",
      paragraphs: [
        "From November through February, Egypt transforms into the world's most civilized outdoor museum. Temperatures in Cairo hover around a pleasant 15–22°C, while Luxor and Aswan sit warmer at 20–28°C — ideal for long afternoons exploring temple complexes without the weight of summer heat pressing down on you.",
        "The Valley of the Kings, the temples of Karnak, and the Abu Simbel complex reveal their full grandeur when you're not battling a 45°C sun. Tourist crowds are present but manageable, and the Nile cruise season is at its absolute peak — dhows and feluccas glide past golden banks in light that photographers dream about.",
      ],
    },
    {
      h3: "What winter does best",
      paragraphs: [
        "The desert nights in winter are genuinely cold, dropping to near 5°C in some areas. This creates a remarkable contrast — blazing blue skies by day, star-heavy darkness by night. Camping near the White Desert or spending a night at a desert camp in Siwa becomes a genuinely magical experience rather than a survival test.",
      ],
    },
    {
      h2: "Summer: For the Bold Traveler",
      paragraphs: [
        "Summer in Egypt is not for the faint-hearted. Cairo in July sits at 35–40°C, and Upper Egypt can push past 45°C by mid-afternoon. Yet there's a counterintuitive logic to visiting in summer: the crowds thin dramatically, prices drop across hotels and flights, and the Mediterranean coast — Alexandria, Marsa Matrouh, and the North Coast — bursts into life as Egyptians themselves seek the sea.",
        "The Red Sea resorts of Hurghada and Sharm el-Sheikh maintain excellent diving conditions year-round, but summer brings calmer winds and exceptional underwater visibility. If your Egypt is about coral reefs rather than pharaonic temples, summer makes a compelling case.",
      ],
      quote:
        '"Summer strips Egypt down to its essentials — fewer tourists, lower prices, and a raw, unfiltered intensity that the country wears honestly."',
      quoteVariant: "orange",
    },
    {
      h2: "The Verdict",
      paragraphs: [
        "For first-time visitors focused on antiquities, temples, and the Nile, winter is objectively the superior choice. For beach lovers, budget travelers, or those who have already seen Egypt's monuments and want a different angle, summer — particularly the coast — offers genuine rewards. Egypt, unlike most destinations, doesn't have a wrong season. It just has different answers.",
      ],
    },
  ],
  tags: ["Egypt Travel", "Seasonal Guide", "Nile Cruise", "Desert Safari", "Travel Tips", "Luxury Travel"],
  faqs: [
    {
      question: "Why should I book with Egypt Us ?",
      answer: "Booking with Egypt Us means choosing experience, reliability, and personalized service. Our travel experts create well-planned itineraries, supported by licensed local guides, high-quality partners, and 24/7 customer support. Every detail is carefully managed to ensure a smooth, authentic, and memorable travel experience.",
    },
    {
      question: "Can I customize my itinerary to match my interests and budget?",
      answer: "Yes, you can request modifications or cancellations before your scheduled trip time. Our support team is available to assist you and guide you through any applicable policies.",
    },
    {
      question: "What should I do if there's an emergency during my trip?",
      answer: "In case of an emergency during your trip, we provide 24/7 support to assist you. Our team will coordinate immediate help, guide you to trusted medical services if needed, and ensure your safety and well-being throughout your journey.",
    },
    {
      question: "What happens if I need to cancel my reservation with Egypt Us ?",
      answer: "Our cancellation policy varies depending on the type of package and the notice provided. Generally, if we receive sufficient advance notice, we can refund a portion of your deposit or transfer your booking to another date. However, some rates or services may be non-refundable. Please contact us for detailed information about the specific cancellation policy for your package.",
    },
  ],
  relatedArticles: [
    {
      id: "r1",
      title: "A First-Timer's Guide to the Nile Valley",
      date: "28 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/articles/r1",
    },
    {
      id: "r2",
      title: "Red Sea vs Mediterranean: Egypt's Two Coasts",
      date: "15 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/articles/r2",
    },
    {
      id: "r3",
      title: "Desert Nights: Camping in the White Desert",
      date: "02 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/articles/r3",
    },
  ],
  breadcrumbs: [
    { label: "Articles", href: "/articles" },
    { label: "Article Details", isCurrent: true },
  ],
  type: "article",
};

export const BLOG_MOCK: ArticleContent = {
  id: "blog-1",
  tag: "Destinations",
  tagColor: "blue",
  title: "Egypt in Summer vs Winter: When Is the Best Time?",
  author: "Sara Ibrahim",
  authorRole: "Travel Editor",
  authorBio:
    "Sara Ibrahim is a Cairo-based travel editor and photographer who specializes in sustainable tourism across North Africa. She has contributed to over 40 travel publications and leads specialized Egypt photography tours each winter.",
  date: "03 March 2026",
  readTime: "6 min",
  views: "1.8k",
  heroImage: "/images/home/hero-bg.png",
  heroCaption:
    "Cairo at dusk — a city that answers very differently depending on the season you arrive.",
  intro:
    "Ask any experienced Egypt traveler when to go, and you'll often be met with a pause. The country defies easy categorization: it is simultaneously sunbaked ancient history, cool Mediterranean breeze, and turquoise reef. The answer depends almost entirely on what you're there for.",
  primaryQuote:
    '"The magic of Egypt is that both seasons are correct — they are just answering different questions."',
  sections: [
    {
      h2: "Winter Months: November to February",
      paragraphs: [
        "The classic peak season runs from November to February, and for good reason. Daytime temperatures across most of Egypt settle into an ideal band for exploration — 18°C to 26°C in Upper Egypt and the Delta, slightly cooler on the Mediterranean coast. The famous sites of Luxor, Aswan, and the Giza plateau are at their most accessible.",
        "Nile cruises are fully operational, and you will find tour operators running comprehensive packages that include balloon flights over the Valley of the Kings and full-day temple circuits that would be impossible in July heat.",
      ],
      quote:
        '"A winter sunrise over Luxor, with the balloon shadows drifting over the West Bank — this alone is worth the flight over."',
      quoteVariant: "blue",
    },
    {
      h3: "What to Prioritize in Winter",
      paragraphs: [
        "Focus your itinerary on Upper Egypt — Luxor, Aswan, and Abu Simbel — where the mild temperatures allow genuine, unhurried exploration. Add a Nile cruise segment of at least three nights to properly experience the river's rhythm between Luxor and Aswan.",
      ],
    },
    {
      h2: "Summer Months: June to August",
      paragraphs: [
        "Summer tells a radically different story. The interior reaches 45°C, making temple visits an endurance event unless confined to early morning. What opens up, however, is coastal Egypt — particularly the North Coast, Alexandria, and the Red Sea resorts.",
        "Hurghada and Sharm el-Sheikh attract a domestic and regional tourism surge in summer. Dive operators report exceptional underwater visibility. Hotel rates on the Nile corridor drop significantly, and the normally busy sites thin out considerably.",
      ],
      quote:
        '"Summer Egypt is for the Red Sea and the coast. If you\'ve already ticked off the temples, this is a completely different country."',
      quoteVariant: "orange",
    },
    {
      h2: "Our Recommendation",
      paragraphs: [
        "If you're visiting Egypt for the first time and your focus is antiquities and the Nile, book between October and March without hesitation. If you're returning, or your Egypt is one of beaches, reefs, and Roman ruins by the sea, summer delivers extraordinary value and a genuinely different experience of the country.",
      ],
    },
  ],
  tags: ["Destinations", "Seasonal Tips", "Egypt Travel", "Red Sea", "Nile Cruise", "Desert"],
  faqs: [
    {
      question: "Why should I book with Egypt Us ?",
      answer: "Booking with Egypt Us means choosing experience, reliability, and personalized service. Our travel experts create well-planned itineraries, supported by licensed local guides, high-quality partners, and 24/7 customer support. Every detail is carefully managed to ensure a smooth, authentic, and memorable travel experience.",
    },
    {
      question: "Can I customize my itinerary to match my interests and budget?",
      answer: "Yes, you can request modifications or cancellations before your scheduled trip time. Our support team is available to assist you and guide you through any applicable policies.",
    },
    {
      question: "What should I do if there's an emergency during my trip?",
      answer: "In case of an emergency during your trip, we provide 24/7 support to assist you. Our team will coordinate immediate help, guide you to trusted medical services if needed, and ensure your safety and well-being throughout your journey.",
    },
    {
      question: "What happens if I need to cancel my reservation with Egypt Us ?",
      answer: "Our cancellation policy varies depending on the type of package and the notice provided. Generally, if we receive sufficient advance notice, we can refund a portion of your deposit or transfer your booking to another date. However, some rates or services may be non-refundable. Please contact us for detailed information about the specific cancellation policy for your package.",
    },
  ],
  relatedArticles: [
    {
      id: "r1",
      title: "A First-Timer's Guide to Cairo's Khan el-Khalili",
      date: "20 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/blogs/r1",
    },
    {
      id: "r2",
      title: "Top Beach Resorts Along Egypt's Red Sea Coast",
      date: "10 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/blogs/r2",
    },
    {
      id: "r3",
      title: "Alexandria: The Not-So-Secret Second City",
      date: "01 Feb 2026",
      image: "/images/home/hero-bg.png",
      href: "/blogs/r3",
    },
  ],
  breadcrumbs: [
    { label: "Blogs", href: "/blogs" },
    { label: "Blog Details", isCurrent: true },
  ],
  type: "blog",
};
