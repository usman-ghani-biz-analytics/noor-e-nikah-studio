export const themes = {
  "Royal Red & Gold": {
    bgGradient: "linear-gradient(135deg, #4A0E17 0%, #2B050B 50%, #1A0305 100%)",
    cardBg: "linear-gradient(180deg, #5A1220 0%, #3A0B12 40%, #2B050B 100%)",
    goldPrimary: "#FFD700",
    goldSecondary: "#B8860B",
    goldTertiary: "#DAA520",
    accent: "#8B0000",
    textColor: "#FFF8DC",
    borderGradient:
      "linear-gradient(135deg, #FFD700 0%, #B8860B 25%, #FFD700 50%, #DAA520 75%, #FFD700 100%)",
    inputBg: "rgba(74, 14, 23, 0.6)",
    inputBorder: "rgba(255, 215, 0, 0.2)",
    panelBg: "rgba(43, 5, 11, 0.65)",
    glowColor: "rgba(255, 215, 0, 0.3)",
    canvasBg1: "#4A0E17",
    canvasBg2: "#2B050B",
    canvasBg3: "#1A0305",
  },
  "Emerald & Gold": {
    bgGradient: "linear-gradient(135deg, #0A3B2C 0%, #062018 50%, #031A12 100%)",
    cardBg: "linear-gradient(180deg, #0E4D38 0%, #082E20 40%, #062018 100%)",
    goldPrimary: "#FFD700",
    goldSecondary: "#DAA520",
    goldTertiary: "#B8860B",
    accent: "#006B3C",
    textColor: "#F0FFF0",
    borderGradient:
      "linear-gradient(135deg, #FFD700 0%, #DAA520 25%, #FFD700 50%, #B8860B 75%, #FFD700 100%)",
    inputBg: "rgba(10, 59, 44, 0.6)",
    inputBorder: "rgba(255, 215, 0, 0.2)",
    panelBg: "rgba(6, 32, 24, 0.65)",
    glowColor: "rgba(255, 215, 0, 0.3)",
    canvasBg1: "#0A3B2C",
    canvasBg2: "#062018",
    canvasBg3: "#031A12",
  },
  "Midnight Sapphire": {
    bgGradient: "linear-gradient(135deg, #0F1B3D 0%, #091230 50%, #050A1F 100%)",
    cardBg: "linear-gradient(180deg, #16255A 0%, #0F1B3D 40%, #091230 100%)",
    goldPrimary: "#FFD700",
    goldSecondary: "#C9A84C",
    goldTertiary: "#E8C547",
    accent: "#1E3A6E",
    textColor: "#E8EEFF",
    borderGradient:
      "linear-gradient(135deg, #FFD700 0%, #C9A84C 25%, #FFD700 50%, #E8C547 75%, #FFD700 100%)",
    inputBg: "rgba(15, 27, 61, 0.6)",
    inputBorder: "rgba(255, 215, 0, 0.2)",
    panelBg: "rgba(9, 18, 48, 0.65)",
    glowColor: "rgba(255, 215, 0, 0.3)",
    canvasBg1: "#0F1B3D",
    canvasBg2: "#091230",
    canvasBg3: "#050A1F",
  },
};

export const defaultFormData = {
  customGreeting: "",
  videoDuration: 30,
  dulhaName: "Muhammad Ali",
  dulhanName: "Ayesha Fatima",
  dulhanFather: "Ahmed Khan",
  nikahDate: "2025-03-15",
  nikahTime: "18:30",
  venue: "Grand Masjid-e-Noor, Gulberg, Lahore",
};

export const DURATION_OPTIONS = [15, 20, 25, 30, 45, 60];

export function formatDate(d) {
  if (!d) return "Date TBA";
  const date = new Date(d + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(t) {
  if (!t) return "Time TBA";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return "Time TBA";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}
