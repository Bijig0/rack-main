import { CacheEntry } from "../../types";

const createCacheEntry = ({
  data,
  timestamp,
  address,
  source,
}: CacheEntry): CacheEntry => {
  const cacheEntry = {
    data,
    timestamp,
    address,
    source,
  } satisfies CacheEntry;

  return cacheEntry;
};

export { createCacheEntry };
