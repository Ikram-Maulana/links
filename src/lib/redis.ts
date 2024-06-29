/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "@/env";
import {
  type linksList,
  type publicMetadata,
  type users,
} from "@/server/db/schema";
import { Redis } from "@upstash/redis";
import { type InferSelectModel } from "drizzle-orm";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

type LinksListProps = InferSelectModel<typeof linksList>;
type ProfileDataProps = InferSelectModel<typeof users> & {
  publicMetadata: InferSelectModel<typeof publicMetadata>;
};
type PublicMetadataProps = InferSelectModel<typeof publicMetadata>;
type MetricsProps = {
  value: number;
};

type CachedArrayDataProps = LinksListProps[] | MetricsProps[];

export const getCachedData = async (key: string) => {
  try {
    let result:
      | CachedArrayDataProps
      | ProfileDataProps
      | PublicMetadataProps
      | undefined;

    if (
      key === "metrics" ||
      key === "publicMetadata" ||
      key === "profileData"
    ) {
      result = (await redis.json.get(key)) as
        | CachedArrayDataProps
        | ProfileDataProps
        | PublicMetadataProps
        | undefined;
    } else if (key.includes("slug")) {
      const cachedData = await redis.json.get(key);
      result = cachedData as
        | CachedArrayDataProps
        | ProfileDataProps
        | PublicMetadataProps
        | undefined;
    } else {
      const listCachedData = await redis.lrange(key, 0, -1);

      if (listCachedData.length > 0) {
        const promises = listCachedData.map((id) =>
          redis.json.get(`${key}:${id}`),
        );
        const results = await Promise.all(promises);
        result = results as
          | CachedArrayDataProps
          | ProfileDataProps
          | PublicMetadataProps
          | undefined;
      }
    }

    return result;
  } catch (error) {
    console.error("Failed to get data from cache:", error);
  }
};

async function addArrayDataToRedis(
  key: string,
  data: LinksListProps[] | ProfileDataProps[],
) {
  const promises = data.map(async (item) => {
    const existingData = await redis.json.get(`${key}:${item.id}`);
    if (!existingData) {
      await redis.lpush(key, item.id);
      await redis.json.set(`${key}:${item.id}`, "$", item);
    }
  });
  await Promise.all(promises);
}

async function addNonArrayDataToRedis(
  key: string,
  data: MetricsProps[] | PublicMetadataProps,
) {
  await redis.json.set(key, "$", data);
}

export const addCachedData = async (
  key: string,
  data: CachedArrayDataProps | ProfileDataProps | PublicMetadataProps,
): Promise<void> => {
  try {
    if (
      key === "metrics" ||
      key === "publicMetadata" ||
      key === "profileData" ||
      key.includes("slug")
    ) {
      if (!data) {
        return;
      }

      await addNonArrayDataToRedis(
        key,
        data as MetricsProps[] | PublicMetadataProps,
      );
    } else {
      await addArrayDataToRedis(key, data as LinksListProps[]);
    }
  } catch (error) {
    console.error("Failed to add data to cache:", error);
  }
};

export const getOneCachedData = async (key: string, id: string) => {
  try {
    const data = await redis.json.get(`${key}:${id}`);
    return [data] as LinksListProps[] | ProfileDataProps[] | null;
  } catch (error) {
    console.error("Failed to get one data from cache:", error);
  }
};

export const updateCachedData = async (
  key: string,
  id: string,
  data: LinksListProps | PublicMetadataProps,
): Promise<void> => {
  try {
    if (key === "profileData") {
      await redis.json.set(key, "$.publicMetadata", data);
    } else {
      await redis.json.set(`${key}:${id}`, "$", data);
    }
  } catch (error) {
    console.error("Failed to update data in cache:", error);
  }
};

export const updateOrCreateCachedData = async (
  key: string,
  data: PublicMetadataProps,
): Promise<void> => {
  try {
    const cachedData = await getCachedData(key);

    if (cachedData) {
      await redis.json.set(key, "$", data);
    } else {
      await addCachedData(key, data);
    }
  } catch (error) {
    console.error("Failed to update or create data in cache:", error);
  }
};

export const deleteCachedData = async (
  key: string,
  id: string,
): Promise<void> => {
  try {
    await Promise.all([redis.lrem(key, 0, id), redis.json.del(`${key}:${id}`)]);
  } catch (error) {
    console.error("Failed to delete data from cache:", error);
  }
};

export const deleteProfileImage = async () => {
  try {
    const [cachedProfileData, cachedPublicMetadataData] = await Promise.all([
      getCachedData("profileData"),
      getCachedData("publicMetadata"),
    ]);

    if (cachedProfileData && "publicMetadata" in cachedProfileData) {
      const updatedProfileData = {
        ...cachedProfileData.publicMetadata,
        avatar: null,
      };

      await redis.json.set(
        "profileData",
        "$.publicMetadata",
        updatedProfileData,
      );
    }

    if (cachedPublicMetadataData && "avatar" in cachedPublicMetadataData) {
      const updatedPublicMetadata = {
        ...cachedPublicMetadataData,
        avatar: null,
      };

      await redis.json.set("publicMetadata", "$", updatedPublicMetadata);
    }
  } catch (error) {
    console.error("Failed to delete profile image from cache:", error);
  }
};

export const revalidateMetricsCache = async (type: "create" | "delete") => {
  try {
    await redis.json.numincrby(
      "metrics",
      "$..value",
      type === "create" ? 1 : -1,
    );
  } catch (error) {
    console.error("Failed to revalidate metrics cache:", error);
  }
};

export const revalidateLinkCache = async (
  slug: string,
  data: LinksListProps,
) => {
  try {
    const cachedData = await getCachedData(`slug:${slug}`);

    if (cachedData) {
      await redis.json.set(`slug:${slug}`, "$", data);
    }
  } catch (error) {
    console.error("Failed to revalidate link cache:", error);
  }
};

export const deleteLinkCache = async (slug: string) => {
  try {
    await redis.json.del(`slug:${slug}`);
  } catch (error) {
    console.error("Failed to delete link cache:", error);
  }
};

export const deleteImageLinkCache = async (id: string, slug: string) => {
  try {
    const cachedData = await getCachedData(`slug:${slug}`);

    if (cachedData) {
      const updatedData = {
        ...cachedData,
        image: null,
      };

      await Promise.all([
        redis.json.set(`slug:${slug}`, "$", updatedData),
        redis.json.set(`linksList:${id}`, "$", updatedData),
      ]);
    }
  } catch (error) {
    console.error("Failed to delete image link cache:", error);
  }
};
