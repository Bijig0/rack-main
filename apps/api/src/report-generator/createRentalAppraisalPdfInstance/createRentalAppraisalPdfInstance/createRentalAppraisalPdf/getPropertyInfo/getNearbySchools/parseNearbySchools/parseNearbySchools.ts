import { parsePropertyPageRentalEstimate } from "../../utils/parsePropertyPageRentalEstimate";
import { NearbySchool } from "../types";

type Return = {
  schools: NearbySchool[];
};

/**
 * Determines school type from school name
 * Primary schools: contain "Primary", "P.S", "Elementary"
 * Secondary schools: contain "Secondary", "High", "College", "Grammar"
 * Childcare: contain "Childcare", "Early Learning", "Kindergarten", "Preschool", "Day Care"
 */
function determineSchoolType(
  name: string
): "primary" | "secondary" | "childcare" {
  const nameLower = name.toLowerCase();

  // Check for childcare indicators first (most specific)
  if (
    nameLower.includes("childcare") ||
    nameLower.includes("child care") ||
    nameLower.includes("day care") ||
    nameLower.includes("daycare") ||
    nameLower.includes("early learning") ||
    nameLower.includes("kindergarten") ||
    nameLower.includes("kinder") ||
    nameLower.includes("preschool") ||
    nameLower.includes("pre-school") ||
    nameLower.includes("nursery")
  ) {
    return "childcare";
  }

  // Check for secondary school indicators
  if (
    nameLower.includes("secondary") ||
    nameLower.includes("high school") ||
    nameLower.includes("high") ||
    nameLower.includes("college") ||
    nameLower.includes("grammar") ||
    nameLower.includes("senior")
  ) {
    return "secondary";
  }

  // Check for primary school indicators
  if (
    nameLower.includes("primary") ||
    nameLower.includes("p.s") ||
    nameLower.includes("p.s.") ||
    nameLower.includes("elementary") ||
    nameLower.includes("junior")
  ) {
    return "primary";
  }

  // Default to primary if no clear indicator
  return "primary";
}

/**
 * Parses nearby schools from propertyPageRentalEstimate.html (realestate.com.au)
 *
 * The HTML structure from realestate.com is:
 * <div id="nearby-school-list">
 *   <div class="media school-details-container">
 *     <p class="school-name mb-0">Kew Primary School</p>
 *     <p class="place-address mb-0">20 Peel Street Kew VIC 3101</p>
 *     <p class="school-distance">1.09km</p>
 *   </div>
 * </div>
 *
 * @returns Array of nearby school objects with discriminated type (primary/secondary/childcare)
 */
export async function parseNearbySchools(): Promise<Return> {
  const $ = await parsePropertyPageRentalEstimate();

  const schools: NearbySchool[] = [];

  // Find all school containers
  const schoolContainers = $("#nearby-school-list .school-details-container");

  if (schoolContainers.length === 0) {
    console.warn("⚠️  Could not find school containers in HTML");
  }

  schoolContainers.each((_, container) => {
    const nameElement = $(container).find("p.school-name");
    const addressElement = $(container).find("p.place-address");
    const distanceElement = $(container).find("p.school-distance");

    const name = nameElement.text().trim();
    const address = addressElement.text().trim();
    const distance = distanceElement.text().trim();

    if (name && address && distance) {
      const type = determineSchoolType(name);

      schools.push({
        type,
        name,
        address,
        distance,
      });
    }
  });

  if (schools.length > 0) {
    const primaryCount = schools.filter((s) => s?.type === "primary").length;
    const secondaryCount = schools.filter((s) => s?.type === "secondary").length;
    const childcareCount = schools.filter((s) => s?.type === "childcare").length;

    console.log(
      `Found ${schools.length} nearby schools: ${primaryCount} primary, ${secondaryCount} secondary, ${childcareCount} childcare`
    );
  } else {
    console.warn("⚠️  Could not find schools in HTML");
  }

  return { schools };
}
