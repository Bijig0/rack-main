import { db } from './drizzle';
import { pdf } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // Check if 'rental appraisal' exists
  const existing = await db.select().from(pdf).where(eq(pdf.name, 'rental appraisal'));

  if (existing.length === 0) {
    await db.insert(pdf).values({ name: 'rental appraisal' });
    console.log('✅ Seeded pdf table with "rental appraisal"');
  } else {
    console.log('✅ PDF "rental appraisal" already exists');
  }

  console.log('🎉 Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
