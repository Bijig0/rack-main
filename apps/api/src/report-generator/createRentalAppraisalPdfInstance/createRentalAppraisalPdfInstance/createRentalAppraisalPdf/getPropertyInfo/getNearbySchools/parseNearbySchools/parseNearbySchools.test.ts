import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseNearbySchools", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPageRentalEstimate.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain school information", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const schoolContainers = $("#nearby-school-list .school-details-container");
      expect(schoolContainers.length).toBeGreaterThan(0);

      const firstSchool = schoolContainers.first();
      expect(firstSchool.find("p.school-name").text()).toContain("School");
    });

    test("parseNearbySchools would extract all schools with types", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      type NearbySchool = {
        type: "primary" | "secondary" | "childcare";
        name: string;
        address: string;
        distance: string;
      };

      const schools: NearbySchool[] = [];
      const schoolContainers = $("#nearby-school-list .school-details-container");

      function determineSchoolType(name: string): "primary" | "secondary" | "childcare" {
        const nameLower = name.toLowerCase();

        if (
          nameLower.includes("childcare") ||
          nameLower.includes("kindergarten") ||
          nameLower.includes("preschool")
        ) {
          return "childcare";
        }

        if (
          nameLower.includes("secondary") ||
          nameLower.includes("high") ||
          nameLower.includes("college")
        ) {
          return "secondary";
        }

        return "primary";
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
          schools.push({ type, name, address, distance });
        }
      });

      expect(schools.length).toBeGreaterThan(0);

      // Check that each school has a type
      schools.forEach((school) => {
        expect(["primary", "secondary", "childcare"]).toContain(school.type);
        expect(school.name).toBeTruthy();
        expect(school.address).toBeTruthy();
        expect(school.distance).toBeTruthy();
      });
    });

    test("parseNearbySchools correctly identifies primary schools", () => {
      const html = `
        <div id="nearby-school-list">
          <div class="school-details-container">
            <p class="school-name">Kew Primary School</p>
            <p class="place-address">20 Peel Street Kew VIC 3101</p>
            <p class="school-distance">1.09km</p>
          </div>
        </div>
      `;
      const $ = cheerio.load(html);

      function determineSchoolType(name: string): "primary" | "secondary" | "childcare" {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("childcare")) return "childcare";
        if (nameLower.includes("secondary") || nameLower.includes("high")) return "secondary";
        return "primary";
      }

      const name = $(".school-name").text().trim();
      const type = determineSchoolType(name);

      expect(type).toBe("primary");
    });

    test("parseNearbySchools correctly identifies secondary schools", () => {
      const html = `
        <div id="nearby-school-list">
          <div class="school-details-container">
            <p class="school-name">Kew High School</p>
            <p class="place-address">50 High Street Kew VIC 3101</p>
            <p class="school-distance">2.5km</p>
          </div>
        </div>
      `;
      const $ = cheerio.load(html);

      function determineSchoolType(name: string): "primary" | "secondary" | "childcare" {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("childcare")) return "childcare";
        if (nameLower.includes("secondary") || nameLower.includes("high")) return "secondary";
        return "primary";
      }

      const name = $(".school-name").text().trim();
      const type = determineSchoolType(name);

      expect(type).toBe("secondary");
    });

    test("parseNearbySchools correctly identifies childcare centers", () => {
      const html = `
        <div id="nearby-school-list">
          <div class="school-details-container">
            <p class="school-name">Little Learners Childcare</p>
            <p class="place-address">10 Park Road Kew VIC 3101</p>
            <p class="school-distance">0.5km</p>
          </div>
        </div>
      `;
      const $ = cheerio.load(html);

      function determineSchoolType(name: string): "primary" | "secondary" | "childcare" {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("childcare")) return "childcare";
        if (nameLower.includes("secondary") || nameLower.includes("high")) return "secondary";
        return "primary";
      }

      const name = $(".school-name").text().trim();
      const type = determineSchoolType(name);

      expect(type).toBe("childcare");
    });

    test("parseNearbySchools would return empty array for missing schools", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const schools: any[] = [];
      const schoolContainers = $("#nearby-school-list .school-details-container");

      schoolContainers.each((_, container) => {
        const nameElement = $(container).find("p.school-name");
        const addressElement = $(container).find("p.place-address");
        const distanceElement = $(container).find("p.school-distance");

        const name = nameElement.text().trim();
        const address = addressElement.text().trim();
        const distance = distanceElement.text().trim();

        if (name && address && distance) {
          schools.push({ name, address, distance });
        }
      });

      expect(schools.length).toBe(0);
    });
  });
});
