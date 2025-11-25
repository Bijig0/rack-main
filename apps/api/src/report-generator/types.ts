import { generate } from "@pdfme/generator";

export type Template = Parameters<typeof generate>[0]["template"];
export type Inputs = Parameters<typeof generate>[0]["inputs"];

export type Section = {
  template: Template;
  inputs: Inputs;
};

export type Sections = Section[];