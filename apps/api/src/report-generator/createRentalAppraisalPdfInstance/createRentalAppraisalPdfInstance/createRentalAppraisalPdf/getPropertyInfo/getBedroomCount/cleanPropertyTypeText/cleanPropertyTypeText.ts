import { PropertyType, PropertyTypeSchema } from "../types";

type Return = {
  cleanedPropertyType: PropertyType;
};

type Args = {
  propertyTypeText: string | null;
};

/**
 * Cleans a raw property type text like "house", "apartment", etc.
 * Returns a cleaned string or null if input is null/invalid.
 */
export function cleanPropertyTypeText({ propertyTypeText }: Args): Return {
  if (!propertyTypeText) return { cleanedPropertyType: null };

  const cleaned = propertyTypeText.trim().toLowerCase();

  if (cleaned.length === 0) return { cleanedPropertyType: null };

  // Validate through schema for consistency
  const cleanedPropertyType = PropertyTypeSchema.parse(cleaned);
  return { cleanedPropertyType };
}
