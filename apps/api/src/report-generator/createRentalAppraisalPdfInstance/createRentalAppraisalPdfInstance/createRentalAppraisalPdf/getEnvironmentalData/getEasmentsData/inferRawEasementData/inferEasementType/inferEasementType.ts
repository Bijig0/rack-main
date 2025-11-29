import { Geometry } from "../../../../../../wfsDataToolkit/types";

type Args = {
  geometry: Geometry;
};

type Return = {
  easementType: string;
};

const inferEasementType = ({ geometry }: Args): Return => {
  // TODO -make more detaled via AI???
  const inferredType = (() => {
    switch (geometry?.type) {
      case "LineString":
      case "MultiLineString":
        return "linear service easement (likely drainage or utility)";
      case "Polygon":
      case "MultiPolygon":
        return "area-based easement (possibly access or right of way)";
      default:
        return "unclassified easement";
    }
  })();

  return {
    easementType: inferredType,
  };
};

export default inferEasementType;
