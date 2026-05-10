import { Property, ConstructionLog } from "./types";

export const PROPERTIES: Property[] = [
  {
    id: "p1",
    name: "Al-Ikhlas Residence",
    location: "Sunter, Jakarta Utara",
    price: 850000000,
    type: "Townhouse 45/90",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Hunian asri dengan lingkungan islami, masjid dalam kawasan, dan keamanan 24 jam.",
    status: "available",
    progress: 75,
    features: ["Masjid", "CCTV 24/7", "Area Panahan", "Taman Bermain"]
  },
  {
    id: "p2",
    name: "Nur Halal Land",
    location: "Cikarang, Bekasi",
    price: 450000000,
    type: "Tipe 36/60",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Proyek strategis dekat kawasan industri dengan skema cicilan syariah flat 10 tahun.",
    status: "available",
    progress: 30,
    features: ["Dekat Stasiun", "Bebas Banjir", "Skema Murabahah"]
  },
  {
    id: "p3",
    name: "Sakina Village",
    location: "Bogor, Jawa Barat",
    price: 600000000,
    type: "Classic 40/75",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Hunian tenang dengan udara sejuk pegunungan, legalitas SHM sudah pecah.",
    status: "reserved",
    progress: 90,
    features: ["Udara Sejuk", "SHM Ready", "Kajian Rutin"]
  },
  {
    id: "p4",
    name: "Madinah Hill Villa",
    location: "Lembang, Bandung",
    price: 1200000000,
    type: "Villa Modern 60/120",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Villa keluarga dengan konsep desain modern kontemporer dan pemandangan lembah yang menakjubkan.",
    status: "available",
    progress: 15,
    features: ["Private Garden", "View Lembah", "Smart Home System"]
  },
  {
    id: "p5",
    name: "Amanah Smart Home",
    location: "Depok, Jawa Barat",
    price: 350000000,
    type: "Compact Suite 30/50",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Solusi hunian terjangkau untuk milenial muslim dengan efisiensi ruang yang maksimal.",
    status: "sold",
    progress: 100,
    features: ["Full Furnished", "Dekat Kampus", "Security RFID"]
  }
];

export const CONSTRUCTION_LOGS: ConstructionLog[] = [
  {
    id: "l1",
    projectId: "p1",
    date: "2026-05-01",
    description: "Pemasangan Atap Pasir dan Rangka Baja Ringan Blok A",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=800&auto=format&fit=crop",
    percentage: 75
  },
  {
    id: "l2",
    projectId: "p1",
    date: "2026-04-15",
    description: "Pengecoran Lantai 2",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop",
    percentage: 60
  }
];
