import { fetchTypeNames } from "./fetchTypeNames";
import { generateTypeNamesFile } from "./generateTypeNamesFile";

const generateTypeNames = async () => {
  const typeNames = await fetchTypeNames();

  generateTypeNamesFile(typeNames);
};

generateTypeNames();
