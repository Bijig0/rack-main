import { format } from "date-fns";

type Return = {
  reportDate: string;
};

const getReportDate = (date: Date = new Date()): Return => {
  return {
    reportDate: format(date, "dd/MMMM/yyyy"),
  };
};

export default getReportDate;
