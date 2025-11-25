// @ts-ignore
import { describe, expect, test } from "bun:test";
import type { Sections } from "../../types";
import convertSectionsToTemplateAndInputs from "./convertSectionsToTemplateAndInputs";

describe("convertSectionsToTemplateAndInputs", () => {
  test("should correctly merge multiple sections into a single template", async () => {
    const sections: Sections = [
      {
        template: {
          schemas: [
            [
              {
                name: "title",
                type: "text",
                position: { x: 20, y: 20 },
                width: 100,
                height: 10,
              },
              {
                name: "subtitle",
                type: "text",
                position: { x: 20, y: 35 },
                width: 100,
                height: 8,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [
          {
            title: "Page 1 Title",
            subtitle: "Page 1 Subtitle",
          },
        ],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "content",
                type: "text",
                position: { x: 20, y: 20 },
                width: 100,
                height: 50,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [
          {
            content: "Page 2 Content",
          },
        ],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "footer",
                type: "text",
                position: { x: 20, y: 250 },
                width: 100,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [
          {
            footer: "Page 3 Footer",
          },
        ],
      },
    ];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    // Should have 3 page schemas (one from each section)
    expect(result.template.schemas).toHaveLength(3);

    // First page should have 2 fields
    expect(result.template.schemas[0]).toHaveLength(2);
    expect(result.template.schemas[0][0].name).toBe("title");
    expect(result.template.schemas[0][1].name).toBe("subtitle");

    // Second page should have 1 field
    expect(result.template.schemas[1]).toHaveLength(1);
    expect(result.template.schemas[1][0].name).toBe("content");

    // Third page should have 1 field
    expect(result.template.schemas[2]).toHaveLength(1);
    expect(result.template.schemas[2][0].name).toBe("footer");

    // Should have ONE merged input object containing all field data
    expect(result.inputs).toHaveLength(1);
    expect(result.inputs[0]).toEqual({
      title: "Page 1 Title",
      subtitle: "Page 1 Subtitle",
      content: "Page 2 Content",
      footer: "Page 3 Footer",
    });

    // BasePdf should be generated (starts with data:application/pdf)
    expect(result.template.basePdf).toMatch(/^data:application\/pdf;base64,/);
  });

  test("should handle single section", async () => {
    const sections: Sections = [
      {
        template: {
          schemas: [
            [
              {
                name: "field1",
                type: "text",
                position: { x: 10, y: 10 },
                width: 50,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ field1: "Value 1" }],
      },
    ];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    expect(result.template.schemas).toHaveLength(1);
    expect(result.template.schemas[0]).toHaveLength(1);
    expect(result.inputs).toHaveLength(1);
  });

  test("should handle empty sections array", async () => {
    const sections: Sections = [];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    expect(result.template.schemas).toHaveLength(0);
    // Even with no sections, we return one empty input object
    expect(result.inputs).toHaveLength(1);
    expect(result.inputs[0]).toEqual({});
  });

  test("should preserve all field properties", async () => {
    const sections: Sections = [
      {
        template: {
          schemas: [
            [
              {
                name: "complexField",
                type: "text",
                position: { x: 20, y: 30 },
                width: 150,
                height: 25,
                fontSize: 14,
                fontColor: "#333333",
                fontName: "Roboto",
                lineHeight: 1.5,
                alignment: "center",
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ complexField: "Test" }],
      },
    ];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    const field = result.template.schemas[0][0];
    expect(field.name).toBe("complexField");
    expect(field.type).toBe("text");
    expect(field.position).toEqual({ x: 20, y: 30 });
    expect(field.width).toBe(150);
    expect(field.height).toBe(25);
    expect(field.fontSize).toBe(14);
    expect(field.fontColor).toBe("#333333");
    expect(field.fontName).toBe("Roboto");
    expect(field.lineHeight).toBe(1.5);
    expect(field.alignment).toBe("center");
  });

  test("should create correct number of pages in basePdf", async () => {
    const sections: Sections = [
      {
        template: {
          schemas: [
            [
              {
                name: "f1",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ f1: "1" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "f2",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ f2: "2" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "f3",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ f3: "3" }],
      },
    ];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    // The basePdf should be created with 3 pages (one per schema)
    expect(result.template.schemas).toHaveLength(3);

    // Verify basePdf is valid
    expect(result.template.basePdf).toMatch(/^data:application\/pdf;base64,/);

    // Decode and verify it's a valid PDF (starts with %PDF)
    const basePdf = result.template.basePdf as string;
    const base64Data = basePdf.split(",")[1];
    const pdfBytes = Buffer.from(base64Data, "base64");
    const pdfHeader = pdfBytes.toString("ascii", 0, 4);
    expect(pdfHeader).toBe("%PDF");
  });

  test("should create single merged input for multi-page document", async () => {
    const sections: Sections = [
      {
        template: {
          schemas: [
            [
              {
                name: "a",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ a: "A" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "b",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ b: "B" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "c",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ c: "C" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "d",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ d: "D" }],
      },
      {
        template: {
          schemas: [
            [
              {
                name: "e",
                type: "text",
                position: { x: 0, y: 0 },
                width: 10,
                height: 10,
              },
            ],
          ],
          basePdf: "",
        },
        inputs: [{ e: "E" }],
      },
    ];

    const result = await convertSectionsToTemplateAndInputs({ sections });

    // Should have 5 pages (schemas)
    expect(result.template.schemas).toHaveLength(5);

    // Should have 1 input object (one complete document)
    expect(result.inputs).toHaveLength(1);

    // Input should contain all fields
    expect(result.inputs[0]).toEqual({
      a: "A",
      b: "B",
      c: "C",
      d: "D",
      e: "E",
    });
  });
});
