import { describe, expect, it } from "bun:test";
import { NearbySchoolsSchema } from "../types";
import { cleanNearbySchoolsText } from "./cleanNearbySchoolsText";

describe("cleanNearbySchoolsText", () => {
  it("validates and returns schools array with discriminated union types", () => {
    const schools = [
      { type: "primary" as const, name: "Kew Primary School", address: "20 Peel Street Kew VIC 3101", distance: "1.09km" },
      { type: "secondary" as const, name: "Kew High School", address: "50 High Street Kew VIC 3101", distance: "2.5km" },
      { type: "childcare" as const, name: "Kew Childcare Centre", address: "10 Park Road Kew VIC 3101", distance: "0.5km" },
    ];

    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools });

    expect(result).toEqual(schools);
    expect(NearbySchoolsSchema.safeParse(result).success).toBe(true);
  });

  it("returns null for empty array", () => {
    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools: [] });
    expect(result).toBe(null);
  });

  it("validates single primary school", () => {
    const schools = [
      { type: "primary" as const, name: "Kew Primary School", address: "20 Peel Street", distance: "1km" },
    ];

    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools });
    expect(result).toHaveLength(1);
    expect(result![0].type).toBe("primary");
  });

  it("validates single secondary school", () => {
    const schools = [
      { type: "secondary" as const, name: "Melbourne High", address: "100 College Street", distance: "3km" },
    ];

    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools });
    expect(result).toHaveLength(1);
    expect(result![0].type).toBe("secondary");
  });

  it("validates single childcare center", () => {
    const schools = [
      { type: "childcare" as const, name: "Little Learners Childcare", address: "5 Nursery Lane", distance: "0.3km" },
    ];

    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools });
    expect(result).toHaveLength(1);
    expect(result![0].type).toBe("childcare");
  });

  it("validates mixed school types", () => {
    const schools = [
      { type: "primary" as const, name: "School A", address: "Address A", distance: "1km" },
      { type: "childcare" as const, name: "School B", address: "Address B", distance: "2km" },
      { type: "secondary" as const, name: "School C", address: "Address C", distance: "3km" },
      { type: "primary" as const, name: "School D", address: "Address D", distance: "4km" },
    ];

    const { cleanedSchools: result } = cleanNearbySchoolsText({ schools });
    expect(result).toHaveLength(4);

    const primaryCount = result!.filter(s => s.type === "primary").length;
    const secondaryCount = result!.filter(s => s.type === "secondary").length;
    const childcareCount = result!.filter(s => s.type === "childcare").length;

    expect(primaryCount).toBe(2);
    expect(secondaryCount).toBe(1);
    expect(childcareCount).toBe(1);
  });
});
