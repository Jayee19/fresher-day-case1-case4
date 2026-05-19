const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.claim.deleteMany();
  await prisma.post.deleteMany();

  const demoAuthor = "demo-seed-user";

  const items = [
    {
      kind: "LOST",
      title: "Matte black water bottle",
      description: "Nalgene-style, small dent near base, physics club sticker peeling.",
      location: "Sports Complex · bleachers · Section B",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      authorName: "Aisha",
    },
    {
      kind: "FOUND",
      title: "Black bottle by the bleachers",
      description: "Found after intramurals, dent on bottom, half-peeled sticker.",
      location: "Sports Complex · bleachers",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80",
      authorName: "Leo",
    },
    {
      kind: "LOST",
      title: "AirPods Pro case only",
      description: "White case, tiny crack on hinge, cat sticker on front.",
      location: "Central Library · Level 2 · window seats",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      imageUrl: "https://images.unsplash.com/photo-1606220945770-bbfb34e2f192?w=800&q=80",
      authorName: "Mira",
    },
    {
      kind: "FOUND",
      title: "AirPods case with cat sticker",
      description: "White charging case, hinge crack, left on a window desk.",
      location: "Central Library · Level 2",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      authorName: "Noah",
    },
    {
      kind: "LOST",
      title: "Graphing calculator TI-84",
      description: "Name etched faintly on back cover 'K-12'.",
      location: "Engineering Block · Room 204",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      imageUrl: null,
      authorName: "Dev",
    },
    {
      kind: "FOUND",
      title: "Calculator left in 204",
      description: "TI style, faint etching on the back.",
      location: "Engineering Block · Room 204",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 46),
      imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee78f16?w=800&q=80",
      authorName: "Riya",
    },
    {
      kind: "LOST",
      title: "Blue lanyard + ID card",
      description: "Navy lanyard, ID photo has curly hair, small chip on card corner.",
      location: "Student Center · food court",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
      authorName: "Sam",
    },
    {
      kind: "FOUND",
      title: "ID on navy lanyard",
      description: "Handed to help desk, curly hair photo, chipped corner.",
      location: "Student Center · help desk",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      imageUrl: null,
      authorName: "Jo",
    },
    {
      kind: "LOST",
      title: "Vintage film camera",
      description: "Silver body, leather strap with green stitching.",
      location: "Arts Quad · bench near oak tree",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      authorName: "Elena",
    },
    {
      kind: "FOUND",
      title: "Old camera with green-stitched strap",
      description: "Silver film camera, arts quad bench.",
      location: "Arts Quad · oak tree bench",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 70),
      imageUrl: "https://images.unsplash.com/photo-1500634245200-e524d2f3b1c3?w=800&q=80",
      authorName: "Chris",
    },
    {
      kind: "LOST",
      title: "Red scarf (hand-knit)",
      description: "Bright red, loose knit, small coffee stain near fringe.",
      location: "Shuttle stop · North campus",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      imageUrl: "https://images.unsplash.com/photo-1520903920243-13d3a50e1ebd?w=800&q=80",
      authorName: "Priya",
    },
    {
      kind: "FOUND",
      title: "Bright scarf on shuttle seat",
      description: "Handmade look, faint stain on fringe.",
      location: "Shuttle · north route",
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
      imageUrl: null,
      authorName: "Alex",
    },
  ];

  for (const it of items) {
    await prisma.post.create({
      data: {
        ...it,
        authorId: demoAuthor,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
