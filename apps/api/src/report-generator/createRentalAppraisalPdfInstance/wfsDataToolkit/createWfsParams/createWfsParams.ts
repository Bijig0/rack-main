import { TypeName } from "../../createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createEnvironmentalSection/getEnvironmentalData/utils/typeNames/typeNames.generated";

export const DEFAULT_BUFFER = 0.001; // Small buffer around the point

export const DEFAULT_SERVICE = "WFS";
export const DEFAULT_VERSION = "2.0.0";
export const DEFAULT_REQUEST = "GetFeature";
export const DEFAULT_OUTPUT_FORMAT = "application/json";

type Args = {
  lon: number;
  lat: number;
  service?: string;
  version?: string;
  request?: string;
  outputFormat?: string;
  buffer?: number;
  bbox?: [number, number, number, number];
  typeName: TypeName;
};

export const createWfsParams = ({
  lon,
  lat,
  service = DEFAULT_SERVICE,
  version = DEFAULT_VERSION,
  request = DEFAULT_REQUEST,
  outputFormat = DEFAULT_OUTPUT_FORMAT,
  buffer = DEFAULT_BUFFER,
  typeName,
}: Args) => {
  const wfsParams = {
    SERVICE: service,
    VERSION: version,
    REQUEST: request,
    OUTPUTFORMAT: outputFormat,
    typeName,
  };

  const bboxWfsParams = {
    ...wfsParams,
    BBOX: `${lon - buffer},${lat - buffer},${lon + buffer},${
      lat + buffer
    },EPSG:4326`,
  };

  return bboxWfsParams;
};
