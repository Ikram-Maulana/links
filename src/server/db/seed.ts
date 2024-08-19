import { linksSeedData } from "@/data";
import { eq, sql } from "drizzle-orm";
import { db } from ".";
import { links } from "./schema";

const seedLinks = async () => {
  console.log("Seeding links...");

  const startTime = performance.now();

  try {
    await db.transaction(async () => {
      for (const link of linksSeedData) {
        const linkExistsPrepared = db
          .select()
          .from(links)
          .where(eq(links.slug, sql.placeholder("slug")))
          .prepare();
        const [existingLink] = await linkExistsPrepared.execute({
          slug: link.slug,
        });

        if (existingLink) {
          console.error(`Link with slug ${link.slug} already exists.`);
          continue;
        }

        const insertLinkPrepared = db
          .insert(links)
          .values(link)
          .$returningId()
          .prepare();
        await insertLinkPrepared.execute();
        console.log(`Link with slug ${link.slug} has been inserted.`);
      }
    });

    console.log("Seeding links done.");
  } catch (error) {
    console.error("Error seeding links:", error);
  } finally {
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime.toFixed(2)}ms`);

    process.exit();
  }
};

await seedLinks();
