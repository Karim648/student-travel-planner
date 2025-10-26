export type ListingType = "eats" | "music" | "city-hop" | "workshops" | "nature";

// --- CARD DATA (list view) ---
export type Listing = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: ListingType;
  dateRange: {
    start: string; // ISO 8601 format: YYYY-MM-DD
    end: string;   // ISO 8601 format: YYYY-MM-DD
  };
};

export const allListings: Listing[] = [
  {
    id: "1",
    name: "Lisbon Hostel Stay",
    description: "Vibrant hostel in the heart of Alfama with rooftop terrace.",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1600239482406-acfc95149698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "city-hop",
    dateRange: { start: "2025-03-01", end: "2025-05-31" },
  },
  {
    id: "2",
    name: "Barcelona City Experience",
    description:
      "Modern apartment near Gothic Quarter, perfect for student travelers.",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1641161995144-9bf2f46e4b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "music",
    dateRange: { start: "2025-04-15", end: "2025-07-15" },
  },
  {
    id: "3",
    name: "Prague Historic Stay",
    description: "Cozy hostel with free breakfast and walking tours.",
    price: 20,
    image:
      "https://images.unsplash.com/photo-1656367684314-e3e5deee96db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "city-hop",
    dateRange: { start: "2025-05-01", end: "2025-08-31" },
  },
  {
    id: "4",
    name: "Bangkok Street Food Tour",
    description:
      "Accommodation + daily food tours in vibrant neighborhoods.",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1628324716243-0c9c29971a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "eats",
    dateRange: { start: "2025-02-10", end: "2025-04-30" },
  },
  {
    id: "5",
    name: "Bali Beach Retreat",
    description: "Beachfront hostel with yoga classes and surf lessons.",
    price: 30,
    image:
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    type: "nature",
    dateRange: { start: "2025-06-01", end: "2025-09-30" },
  },
];

// --- detail dataset kept minimal ---
export type ListingDetail = {
  id: string;             // same id as card
  name: string;           // duplicate so detail page doesn’t need to look up again
  image: string;          // same hero as card
  longDescription?: string;
  address?: string;
  rating?: number;
  highlights?: string[];
};

export const listingDetails: Record<string, ListingDetail> = {
  "1": {
    id: "1",
    name: "Lisbon Hostel Stay",
    image: "https://images.unsplash.com/photo-1600239482406-acfc95149698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    longDescription:
      "In Lisbon’s historic Alfama district with a cozy lounge and rooftop views. Walkable to Fado bars and tram 28.",
    address: "Alfama, Lisbon, Portugal",
    rating: 4.6,
    highlights: ["Rooftop terrace", "Free walking tour"],
  },
  "2": {
    id: "2",
    name: "Barcelona City Experience",
    image: "https://images.unsplash.com/photo-1641161995144-9bf2f46e4b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    longDescription:
      "Central apartment near the Gothic Quarter with quick metro access and lively nightlife.",
    address: "Ciutat Vella, Barcelona, Spain",
    rating: 4.4,
    highlights: ["Near Gothic Quarter", "Late check-in"],
  },
  "3": {
    id: "3",
    name: "Prague Historic Stay",
    image: "https://images.unsplash.com/photo-1656367684314-e3e5deee96db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    longDescription:
      "Old Town hostel with free breakfast and daily walking tours; quiet at night, close to Charles Bridge.",
    address: "Old Town, Prague, Czechia",
    rating: 4.5,
    highlights: ["Free breakfast", "Walking tours"],
  },
  "4": {
    id: "4",
    name: "Bangkok Street Food Tour",
    image: "https://images.unsplash.com/photo-1628324716243-0c9c29971a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    longDescription:
      "Guesthouse near Chinatown with nightly guided street food tours across bustling markets.",
    address: "Yaowarat, Bangkok, Thailand",
    rating: 4.3,
    highlights: ["Night market access", "Food tastings"],
  },
  "5": {
    id: "5",
    name: "Bali Beach Retreat",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    longDescription:
      "Beachfront community stay in Canggu with yoga sessions and optional surf lessons.",
    address: "Canggu, Bali, Indonesia",
    rating: 4.7,
    highlights: ["Yoga classes", "Surf lessons", "Beachfront"],
  },
};

export function getListingDetailById(id: string) {
  const key = String(id).trim();
  return listingDetails[key];
}
