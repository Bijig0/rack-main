import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const nearbySchoolsParseOptions = {
  strategies: [
    {
      name: "realestate-school-specific",
      selectors: ['p.Text__Typography-sc-1103tao-0'],
      extractText: ($element) => {
        const schools: string[] = [];
        const seenSchools = new Set<string>();

        // Find all <p> elements with the specific class pattern
        for (let idx = 0; idx < $element.length; idx++) {
          try {
            const $p = $element.eq(idx);
            const name = $p.text().trim();

          // Skip if empty or too short
          if (!name || name.length < 5) {
            continue;
          }

          const nameLower = name.toLowerCase();

          // Skip common headings/labels (but not actual school names)
          if (nameLower === 'schools and child care') {
            continue;
          }
          if (nameLower === 'closest to this property') {
            continue;
          }
          if (nameLower === 'nearby schools and child care closest to this property.') {
            continue;
          }

          // Skip if the name looks like a distance (e.g., "1.05km")
          if (/^\d+\.?\d*\s*km$/i.test(name)) {
            continue;
          }

          // Look for a <small> tag in parent or siblings
          const $parent = $p.parent();
          let $small = $p.next('small');
          if ($small.length === 0) {
            $small = $parent.find('small').first();
          }

          if ($small.length === 0) {
            continue;
          }

          const typeText = $small.text().trim();
          if (!typeText) {
            continue;
          }

          // Only proceed if the small tag contains school type keywords
          const typeLower = typeText.toLowerCase();
          const hasSchoolType = typeLower.includes('primary') ||
              typeLower.includes('secondary') ||
              typeLower.includes('childcare') ||
              typeLower.includes('government') ||
              typeLower.includes('independent') ||
              typeLower.includes('catholic');

          if (!hasSchoolType) {
            continue;
          }

          // Extract distance - it's usually in the grandparent or following siblings
          // Try to find distance in the grandparent's text
          const $grandparent = $parent.parent();
          let containerText = $grandparent.text();

          // The distance typically appears after the school name and type
          // Extract just the portion after this school's name
          const nameIndex = containerText.indexOf(name);
          if (nameIndex !== -1) {
            const textAfterName = containerText.substring(nameIndex + name.length);
            const distanceMatch = textAfterName.match(/(\d+\.?\d*\s*km)/i);
            var distance = distanceMatch ? distanceMatch[1] : 'Distance not available';
          } else {
            var distance = 'Distance not available';
          }

          // Avoid duplicates
          const schoolKey = `${name}|${typeText}`;
          if (seenSchools.has(schoolKey)) continue;
          seenSchools.add(schoolKey);

          // Use a unique separator that won't conflict with the pipe in typeText
          schools.push(`${name}|||${typeText}|||${distance}`);
          } catch (error) {
            // Silently continue on error
            continue;
          }
        }

        // Use a unique separator between schools that won't conflict with internal separators
        return schools.length > 0 ? schools.join("~~~~") : "";
      },
    },
  ],
  extractValue: (text: string) => {
    if (!text) return null;

    // Split by the unique school separator
    const schoolTexts = text.includes("~~~~")
      ? text.split("~~~~").map((s) => s.trim()).filter(Boolean)
      : [text.trim()].filter(Boolean);

    if (schoolTexts.length === 0) return null;

    // Parse each school text: "name|||type|||distance"
    const schools = schoolTexts
      .map((schoolText) => {
        // Split by triple pipe to get name, type, and distance
        const parts = schoolText.split("|||").map((s) => s.trim());

        if (parts.length < 2) return null; // Need at least name and type

        const name = parts[0];
        const typeText = parts[1]; // e.g., "Primary | Government"
        const distance = parts[2] || "Distance not available";

        if (!name) return null;

        // Parse type from typeText (e.g., "Primary | Government" -> "Primary")
        let type = "primary"; // default
        const typeLower = typeText.toLowerCase();

        if (typeLower.includes("primary") || typeLower.includes("prep")) {
          type = "primary";
        } else if (typeLower.includes("secondary") || typeLower.includes("high")) {
          type = "secondary";
        } else if (
          typeLower.includes("childcare") ||
          typeLower.includes("kindergarten") ||
          typeLower.includes("preschool") ||
          typeLower.includes("daycare")
        ) {
          type = "childcare";
        }

        return {
          type,
          name,
          address: typeText, // Use the full type text as address (e.g., "Primary | Government")
          distance: distance || "Distance not available",
        };
      })
      .filter((school): school is NonNullable<typeof school> => school !== null);

    return schools.length > 0 ? schools : null;
  },
  fallbackPatterns: [],
} satisfies FieldParseConfig;
