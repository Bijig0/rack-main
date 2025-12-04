import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import PrivateLayout from "../../layout/Private";
import TitleContainer from "../../shared/components/TitleContainer";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPropertyDataByIdAction } from "../../store/actions/propertyAction";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { showToastAction } from "../../store/slices/commonSlice";

const PropertyEstimator = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [propertyData, setPropertyData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const pdfRef = useRef();

  const breadcrumbs = [
    { label: "Property Details", url: "/#/my-property" },
    { label: "Market Insights by Bedroom Category" },
  ];

  useEffect(() => {
    dispatch(
      getPropertyDataByIdAction(id, setIsLoading, (data) => {
        setPropertyData(data);
        setIsLoading(false);
      })
    );
  }, [id, dispatch]);


  const reactToPrintFn = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `Estimated Annual Revenue - ${new Date()
      .toISOString()
      .split("T")[0]}`,
    onAfterPrint: () => {
    },
    onPrintError: () => {
      dispatch(
        showToastAction({
          type: "error",
          title: "Download Failed",
          detail: "Something went wrong while generating the report. Please try again.",
        })
      );
    },
  });

  const handleDownload = () => {
    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };



  const chartData = propertyData?.Revenue
    ? [
      {
        Bedroom: `${propertyData.category}-Bedroom`,
        Revenue: propertyData.Revenue,
        ADRAvg: propertyData.ADRAvg,
        ADR25Percentile: propertyData.ADR25Percentile,
        ADR75Percentile: propertyData.ADR75Percentile,
        AvgOccupancy: propertyData.AvgOccupancy,
      },
    ]
    : [];

  return (
    <PrivateLayout>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <TitleContainer
          title={"Market Insights by Bedroom Category"}
          breadcrumbs={breadcrumbs}
          exportBtn
          searchinput={false}
          onClick={handleDownload}
          btnClass="border-round-3xl"
        />

        <div ref={pdfRef}>
          {/* Summary Cards */}
          <div className="grid my-3">
            <div className="md:col-4">
              <div className="p-4 flex flex-column justify-content-between h-full border-round-2xl shadow-2 border bg-green-50">
                <div className="">
                  <h3 className="text-xl text-dark font-bold mt-0 mb-1">
                    Estimated Annual Revenue
                  </h3>
                  <p className="text-3xl font-bold text-dark m-0">
                    ${propertyData.Revenue ? propertyData.Revenue * 12 : 0}
                  </p>
                </div>
                <div className="">
                  <p className="text-gray-700 m-0">
                    Based on {propertyData.NoOfListings || 0} listings
                  </p>
                  <p className="text-gray-700 m-0">
                    {propertyData.category} Bedroom Category
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-2">
              <div className="p-4 h-full flex flex-column justify-content-between border-round-2xl shadow-2 border bg-dark-blue text-white">
                <h3 className="text-xl font-bold mt-0 mb-2">Revenue</h3>
                <h6 className="text-base font-bold mt-0 m-0">
                  ${propertyData.Revenue || 0}/month
                </h6>
              </div>
            </div>

            <div className="md:col-2">
              <div className="p-4 h-full flex flex-column justify-content-between border-round-2xl shadow-2 border bg-golden-light text-dark">
                <h3 className="text-xl font-bold mt-0 mb-3">Average Daily Rate (ADR)</h3>
                <h4 className="text-base font-bold m-0 p-0">${propertyData.ADRAvg || 0}</h4>
              </div>
            </div>

            {/* ADR Range Card */}
            <div className="md:col-2">
              <div className="p-4 h-full border-round-2xl shadow-2 border bg-yellow-50 text-dark flex flex-column justify-content-between">
                <h3 className="text-xl font-bold mt-0 mb-4">Average Daily Rate (ADR) Range</h3>

                <div className="flex justify-content-between gap-2">
                  {/* 25th Percentile */}
                  <div className=" flex-1 bg-yellow-100 border-round-lg text-center shadow-inner ">
                    <p className="text-sm font-medium text-gray-700 m-0">25th Percentile</p>
                    <p className="text-lg font-bold m-0">${propertyData.ADR25Percentile || 0}</p>
                  </div>

                  {/* 75th Percentile */}
                  <div className="flex-1 bg-yellow-200 border-round-lg text-center shadow-inner">
                    <p className="text-sm font-medium text-gray-700 m-0">75th Percentile</p>
                    <p className="text-lg font-bold m-0">${propertyData.ADR75Percentile || 0}</p>
                  </div>
                </div>
              </div>

            </div>
            <div className="md:col-2">
              <div className="p-4 h-full flex flex-column justify-content-between border-round-2xl shadow-2 border bg-light-blue text-dark">
                <h3 className="text-xl font-bold mt-0 mb-2">Adjusted Occupancy</h3>
                <h6 className="text-base font-bold m-0 ">
                  {propertyData.AvgOccupancy || 0}%
                </h6>
              </div>
            </div>
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="grid mt-5">
              {/* 1. Revenue by Bedroom */}
              <div className="md:col-4">
                <div className="p-4 bg-white shadow-2 border-round-lg border h-full">
                  <h3 className="font-bold text-dark text-xl mb-5">
                    Revenue by Bedroom (AUD)
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Bedroom" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Revenue"
                        fill="#10b981"
                        name="Revenue ($)"
                        radius={[12, 12, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. ADR Comparison */}
              <div className="md:col-4">
                <div className="p-4 bg-white shadow-2 border-round-lg border h-full">
                  <h3 className="font-bold text-dark text-xl mb-5">
                    Average Daily Rate (AUD)
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Bedroom" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="ADR25Percentile"
                        fill="#93c5fd"
                        name="ADR 25%"
                        radius={[12, 12, 0, 0]}
                        barSize={30}
                      />
                      <Bar
                        dataKey="ADRAvg"
                        fill="#3b82f6"
                        name="ADR Avg"
                        radius={[12, 12, 0, 0]}
                        barSize={30}
                      />
                      <Bar
                        dataKey="ADR75Percentile"
                        fill="#1e3a8a"
                        name="ADR 75%"
                        radius={[12, 12, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3. Adjusted Occupancy */}
              <div className="md:col-4">
                <div className="p-4 bg-white shadow-2 border-round-lg border h-full">
                  <h3 className="font-bold text-dark text-xl mb-5">
                    Adjusted Occupancy (%)
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Bedroom" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="AvgOccupancy"
                        stroke="#f59e0b"
                        name="Occupancy (%)"
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
};

export default PropertyEstimator;
