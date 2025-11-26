import { builder } from "@builder.io/sdk";

// Initialize Builder with your public API key
builder.init(process.env.BUILDER_IO_PUBLIC_KEY || "4226ce365c774d7c8838384e5639a18d");

export interface FetchBuilderContentOptions {
  /** The Builder.io model name (e.g., "page", "section") */
  model: string;
  /** URL path to fetch content for (e.g., "/rental-appraisal") */
  urlPath?: string;
  /** Specific entry ID to fetch */
  entryId?: string;
  /** Custom query parameters */
  query?: Record<string, unknown>;
  /** Data to pass to the content for bindings */
  data?: Record<string, unknown>;
}

/**
 * Fetches content from Builder.io
 * @returns The Builder.io content object or null if not found
 */
export async function fetchBuilderContent(options: FetchBuilderContentOptions) {
  const { model, urlPath, entryId, query = {}, data = {} } = options;

  try {
    if (entryId) {
      // Fetch specific entry by ID
      const content = await builder.get(model, {
        query: {
          id: entryId,
          ...query,
        },
        ...data,
      }).promise();
      return content;
    }

    if (urlPath) {
      // Fetch content by URL path
      const content = await builder.get(model, {
        url: urlPath,
        ...data,
      }).promise();
      return content;
    }

    // Fetch all content for the model
    const content = await builder.get(model, {
      query,
      ...data,
    }).promise();
    return content;
  } catch (error) {
    console.error("Error fetching Builder.io content:", error);
    throw error;
  }
}

/**
 * Fetches Builder.io content and returns the HTML
 * Useful for PDF generation
 */
export async function fetchBuilderHtml(options: FetchBuilderContentOptions): Promise<string | null> {
  const content = await fetchBuilderContent(options);

  if (!content?.data?.html) {
    return null;
  }

  return content.data.html;
}

/**
 * Fetches all entries for a given model
 */
export async function fetchBuilderEntries(model: string, limit = 100) {
  try {
    const entries = await builder.getAll(model, {
      limit,
      options: {
        noTargeting: true,
      },
    });
    return entries;
  } catch (error) {
    console.error("Error fetching Builder.io entries:", error);
    throw error;
  }
}
