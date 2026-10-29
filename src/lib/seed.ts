import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { TROPHIES_DATA } from "@/data/trophies";
import { ICONIC_MOMENTS_DATA } from "@/data/moments";
import { ERAS_DATA } from "@/data/eras";

export async function seedDatabase() {
  console.log("Seeding CR7 database...");

  // 1. Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@cr7office.ir" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("siuuu2026", 10);
    await prisma.user.create({
      data: {
        name: "Cristiano Admin",
        email: "admin@cr7office.ir",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Created default admin user: admin@cr7office.ir");
  }

  // 2. Trophies
  for (let i = 0; i < TROPHIES_DATA.length; i++) {
    const t = TROPHIES_DATA[i];
    await prisma.trophy.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        count: t.count,
        years: JSON.stringify(t.years || []),
        icon: t.icon || "🏆",
        image: t.image || null,
        tier: t.tier || "gold",
        category: t.category || "club",
        description: t.description || "",
        firstWon: t.firstWon || null,
        mostRecent: t.mostRecent || null,
        order: i,
      },
      create: {
        id: t.id,
        name: t.name,
        count: t.count,
        years: JSON.stringify(t.years || []),
        icon: t.icon || "🏆",
        image: t.image || null,
        tier: t.tier || "gold",
        category: t.category || "club",
        description: t.description || "",
        firstWon: t.firstWon || null,
        mostRecent: t.mostRecent || null,
        order: i,
      },
    });
  }
  console.log(`Synced ${TROPHIES_DATA.length} trophies.`);

  // 3. Moments
  for (let i = 0; i < ICONIC_MOMENTS_DATA.length; i++) {
    const m = ICONIC_MOMENTS_DATA[i];
    await prisma.moment.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        description: m.description,
        year: typeof m.year === "number" ? m.year : parseInt(String(m.year), 10) || 2020,
        opponent: m.opponent || null,
        competition: m.competition || null,
        category: m.category || "goal",
        imageUrl: m.image,
        videoId: m.videoId || null,
        tags: JSON.stringify(m.tags || []),
        likes: m.likesCount || 0,
        aspectRatio: m.aspectRatio || "tall",
        order: i,
      },
      create: {
        id: m.id,
        title: m.title,
        description: m.description,
        year: typeof m.year === "number" ? m.year : parseInt(String(m.year), 10) || 2020,
        opponent: m.opponent || null,
        competition: m.competition || null,
        category: m.category || "goal",
        imageUrl: m.image,
        videoId: m.videoId || null,
        tags: JSON.stringify(m.tags || []),
        likes: m.likesCount || 0,
        aspectRatio: m.aspectRatio || "tall",
        order: i,
      },
    });
  }
  console.log(`Synced ${ICONIC_MOMENTS_DATA.length} moments.`);

  // 4. Eras
  for (let i = 0; i < ERAS_DATA.length; i++) {
    const e = ERAS_DATA[i];
    await prisma.era.upsert({
      where: { id: e.id },
      update: {
        name: e.club,
        years: e.period,
        description: e.narrative,
        primaryColor: e.colors?.primary || "#FEBE10",
        accentColor: e.colors?.accent || "#FEBE10",
        bgColor: e.colors?.bg || "#000000",
        textColor: e.colors?.text || "#FFFFFF",
        images: JSON.stringify(e.heroImages || [e.heroImage]),
        order: e.order || i,
      },
      create: {
        id: e.id,
        name: e.club,
        years: e.period,
        description: e.narrative,
        primaryColor: e.colors?.primary || "#FEBE10",
        accentColor: e.colors?.accent || "#FEBE10",
        bgColor: e.colors?.bg || "#000000",
        textColor: e.colors?.text || "#FFFFFF",
        images: JSON.stringify(e.heroImages || [e.heroImage]),
        order: e.order || i,
      },
    });
  }
  console.log(`Synced ${ERAS_DATA.length} eras.`);

  // 5. Default Site Settings
  const defaultSettings: Record<string, string> = {
    site_title: "CR7 — The Official Cristiano Ronaldo Tribute Experience",
    site_description:
      "A cinematic, Awwwards-caliber digital monument honoring the all-time leading goalscorer and five-time Ballon d'Or champion.",
    site_keywords: "Cristiano Ronaldo, CR7, Real Madrid, Portugal, Manchester United, Juventus, Al Nassr, Ballon d'Or, Football Legend",
    og_image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/500px-Cristiano_Ronaldo_2018.jpg",
    maintenance_mode: "false",
    visibility_cyborg: "true",
    visibility_timeline: "true",
    visibility_trophies: "true",
    visibility_moments: "true",
    visibility_stats: "true",
    cursor_effects: "true",
    sound_fx: "true",
    announcement_banner: "Official 981 Career Goals Tally — The Road to 1,000",
    footer_text: "© 2026 CR7 Office. Built with dedication to the GOAT.",
    twitter_url: "https://twitter.com/cristiano",
    instagram_url: "https://instagram.com/cristiano",
    youtube_url: "https://youtube.com/@cristiano",
    gemini_api_key: "",
    cr7_system_prompt:
      "You are Cristiano Ronaldo (CR7). You are the greatest footballer of all time. You are highly confident, hardworking, and motivational. You refer to yourself in the third person occasionally (e.g., 'Cristiano works hard'). You love your fans and always mention 'Siuuu!' when appropriate. Keep answers short, energetic, and inspiring. Never break character.",
    chat_enabled: "true",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // 6. Initial Activity Log
  await prisma.activityLog.create({
    data: {
      action: "DATABASE_INITIALIZED",
      details: "Initial schema push and seed completed successfully with verified CR7 data.",
      user: "System",
    },
  });

  console.log("Seeding finished successfully!");
  return { success: true };
}
