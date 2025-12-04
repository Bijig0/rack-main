const sendResponse = require("../../services/response");

const property = {
    getPricalabEstimatorPropertyDetail: async (req, res) => {
        try {
            const userId = req.decoded?._id;
            const paylaod =
                [
                    {
                        "_id": 0,
                        "address": "100 Cleveland St, Surry Hills NSW 2010",
                        "category": 1,
                        "KPIsByBedroomCategory": {
                            "0": {
                                "ADRAvg": 164.0,
                                "ADR25Percentile": 140.0,
                                "ADR75Percentile": 176.0,
                                "Revenue": 38463.0,
                                "AvgOccupancy": 84.92,
                                "NoOfListings": 27.0
                            },
                            "1": {
                                "ADRAvg": 184.0,
                                "ADR25Percentile": 140.0,
                                "ADR75Percentile": 227.0,
                                "Revenue": 51795.0,
                                "AvgOccupancy": 79.13,
                                "NoOfListings": 272.0
                            },
                            "2": {
                                "ADRAvg": 329.0,
                                "ADR25Percentile": 237.0,
                                "ADR75Percentile": 363.0,
                                "Revenue": 65350.0,
                                "AvgOccupancy": 72.31,
                                "NoOfListings": 147.0
                            }
                        }
                    },
                    {
                        "_id": 1,
                        "address": "1 Macquarie St, Sydney NSW 2000",
                        "category": 3,
                        "KPIsByBedroomCategory": {
                            "1": {
                                "ADRAvg": 323.0,
                                "ADR25Percentile": 239.0,
                                "ADR75Percentile": 383.0,
                                "Revenue": 77706.0,
                                "AvgOccupancy": 78.78,
                                "NoOfListings": 137.0
                            },
                            "2": {
                                "ADRAvg": 439.0,
                                "ADR25Percentile": 332.0,
                                "ADR75Percentile": 483.0,
                                "Revenue": 106295.0,
                                "AvgOccupancy": 81.08,
                                "NoOfListings": 187.0
                            },
                            "3": {
                                "ADRAvg": 557.0,
                                "ADR25Percentile": 446.0,
                                "ADR75Percentile": 595.0,
                                "Revenue": 127293.0,
                                "AvgOccupancy": 80.21,
                                "NoOfListings": 92.0
                            }
                        }
                    },
                    {
                        "_id": 2,
                        "address": "10 Argyle St, The Rocks NSW 2000",
                        "category": 2,
                        "KPIsByBedroomCategory": {
                            "1": {
                                "ADRAvg": 314.0,
                                "ADR25Percentile": 232.0,
                                "ADR75Percentile": 371.0,
                                "Revenue": 73428.0,
                                "AvgOccupancy": 78.07,
                                "NoOfListings": 146.0
                            },
                            "2": {
                                "ADRAvg": 433.0,
                                "ADR25Percentile": 345.0,
                                "ADR75Percentile": 483.0,
                                "Revenue": 104898.0,
                                "AvgOccupancy": 81.35,
                                "NoOfListings": 175.0
                            },
                            "3": {
                                "ADRAvg": 587.0,
                                "ADR25Percentile": 446.0,
                                "ADR75Percentile": 593.0,
                                "Revenue": 124508.0,
                                "AvgOccupancy": 80.45,
                                "NoOfListings": 97.0
                            }
                        }
                    },
                    {
                        "_id": 3,
                        "address": "47 Celia Street, Glen Iris VIC",
                        "category": 2,
                        "KPIsByBedroomCategory": {
                            "0": {
                                "ADRAvg": 138.0,
                                "ADR25Percentile": 93.0,
                                "ADR75Percentile": 159.0,
                                "Revenue": 24681.0,
                                "AvgOccupancy": 73.02,
                                "NoOfListings": 12.0
                            },
                            "1": {
                                "ADRAvg": 143.0,
                                "ADR25Percentile": 116.0,
                                "ADR75Percentile": 160.0,
                                "Revenue": 29374.0,
                                "AvgOccupancy": 73.03,
                                "NoOfListings": 180.0
                            },
                            "2": {
                                "ADRAvg": 198.0,
                                "ADR25Percentile": 152.0,
                                "ADR75Percentile": 221.0,
                                "Revenue": 40149.0,
                                "AvgOccupancy": 73.8,
                                "NoOfListings": 235.0
                            }
                        }
                    },
                    {
                        "_id": 4,
                        "address": "16 Oberon Street, Point Cook VIC",
                        "category": 5,
                        "KPIsByBedroomCategory": {
                            "3": {
                                "ADRAvg": 195.0,
                                "ADR25Percentile": 152.0,
                                "ADR75Percentile": 208.0,
                                "Revenue": 30228.0,
                                "AvgOccupancy": 60.1,
                                "NoOfListings": 118.0
                            },
                            "4": {
                                "ADRAvg": 242.0,
                                "ADR25Percentile": 192.0,
                                "ADR75Percentile": 283.0,
                                "Revenue": 40885.0,
                                "AvgOccupancy": 59.64,
                                "NoOfListings": 137.0
                            },
                            "5": {
                                "ADRAvg": 303.0,
                                "ADR25Percentile": 241.0,
                                "ADR75Percentile": 345.0,
                                "Revenue": 46323.0,
                                "AvgOccupancy": 58.99,
                                "NoOfListings": 39.0
                            }
                        }
                    },
                    {
                        "_id": 5,
                        "address": "21 Hercules St, Rockingham WA",
                        "category": 4,
                        "KPIsByBedroomCategory": {
                            "2": {
                                "ADRAvg": 211.0,
                                "ADR25Percentile": 167.0,
                                "ADR75Percentile": 239.0,
                                "Revenue": 39976.0,
                                "AvgOccupancy": 78.91,
                                "NoOfListings": 66.0
                            },
                            "3": {
                                "ADRAvg": 235.0,
                                "ADR25Percentile": 177.0,
                                "ADR75Percentile": 267.0,
                                "Revenue": 46532.0,
                                "AvgOccupancy": 81.73,
                                "NoOfListings": 49.0
                            },
                            "4": {
                                "ADRAvg": 316.0,
                                "ADR25Percentile": 237.0,
                                "ADR75Percentile": 373.0,
                                "Revenue": 58646.0,
                                "AvgOccupancy": 72.27,
                                "NoOfListings": 32.0
                            }
                        }
                    }
                ]

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Property details fetched successfully.",
                payload: paylaod,
                res,
            });
        } catch (error) {
            console.error("Error in fetching property:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error fetching propety details: ${error.message}`,
                res,
            });
        }
    },

    getPricalabEstimatorPropertyDetailById: async (req, res) => {
        try {
            const userId = req.decoded?._id;
            const propertyId = req.params.id;
            const data = [
                {
                    "_id": 0,
                    "address": "100 Cleveland St, Surry Hills NSW 2010",
                    "category": 1,
                    "KPIsByBedroomCategory": {
                        "0": {
                            "ADRAvg": 164.0,
                            "ADR25Percentile": 140.0,
                            "ADR75Percentile": 176.0,
                            "Revenue": 38463.0,
                            "AvgOccupancy": 84.92,
                            "NoOfListings": 27.0
                        },
                        "1": {
                            "ADRAvg": 184.0,
                            "ADR25Percentile": 140.0,
                            "ADR75Percentile": 227.0,
                            "Revenue": 51795.0,
                            "AvgOccupancy": 79.13,
                            "NoOfListings": 272.0
                        },
                        "2": {
                            "ADRAvg": 329.0,
                            "ADR25Percentile": 237.0,
                            "ADR75Percentile": 363.0,
                            "Revenue": 65350.0,
                            "AvgOccupancy": 72.31,
                            "NoOfListings": 147.0
                        }
                    }
                },
                {
                    "_id": 1,
                    "address": "1 Macquarie St, Sydney NSW 2000",
                   "category": 3,
                    "KPIsByBedroomCategory": {
                        "1": {
                            "ADRAvg": 323.0,
                            "ADR25Percentile": 239.0,
                            "ADR75Percentile": 383.0,
                            "Revenue": 77706.0,
                            "AvgOccupancy": 78.78,
                            "NoOfListings": 137.0
                        },
                        "2": {
                            "ADRAvg": 439.0,
                            "ADR25Percentile": 332.0,
                            "ADR75Percentile": 483.0,
                            "Revenue": 106295.0,
                            "AvgOccupancy": 81.08,
                            "NoOfListings": 187.0
                        },
                        "3": {
                            "ADRAvg": 557.0,
                            "ADR25Percentile": 446.0,
                            "ADR75Percentile": 595.0,
                            "Revenue": 127293.0,
                            "AvgOccupancy": 80.21,
                            "NoOfListings": 92.0
                        }
                    }
                },
                {
                    "_id": 2,
                    "address": "10 Argyle St, The Rocks NSW 2000",
                    "category": 2,
                    "KPIsByBedroomCategory": {
                        "1": {
                            "ADRAvg": 314.0,
                            "ADR25Percentile": 232.0,
                            "ADR75Percentile": 371.0,
                            "Revenue": 73428.0,
                            "AvgOccupancy": 78.07,
                            "NoOfListings": 146.0
                        },
                        "2": {
                            "ADRAvg": 433.0,
                            "ADR25Percentile": 345.0,
                            "ADR75Percentile": 483.0,
                            "Revenue": 104898.0,
                            "AvgOccupancy": 81.35,
                            "NoOfListings": 175.0
                        },
                        "3": {
                            "ADRAvg": 587.0,
                            "ADR25Percentile": 446.0,
                            "ADR75Percentile": 593.0,
                            "Revenue": 124508.0,
                            "AvgOccupancy": 80.45,
                            "NoOfListings": 97.0
                        }
                    }
                },
                {
                    "_id": 3,
                    "address": "47 Celia Street, Glen Iris VIC",
                    "category": 2,
                    "KPIsByBedroomCategory": {
                        "0": {
                            "ADRAvg": 138.0,
                            "ADR25Percentile": 93.0,
                            "ADR75Percentile": 159.0,
                            "Revenue": 24681.0,
                            "AvgOccupancy": 73.02,
                            "NoOfListings": 12.0
                        },
                        "1": {
                            "ADRAvg": 143.0,
                            "ADR25Percentile": 116.0,
                            "ADR75Percentile": 160.0,
                            "Revenue": 29374.0,
                            "AvgOccupancy": 73.03,
                            "NoOfListings": 180.0
                        },
                        "2": {
                            "ADRAvg": 198.0,
                            "ADR25Percentile": 152.0,
                            "ADR75Percentile": 221.0,
                            "Revenue": 40149.0,
                            "AvgOccupancy": 73.8,
                            "NoOfListings": 235.0
                        }
                    }
                },
                {
                    "_id": 4,
                    "address": "16 Oberon Street, Point Cook VIC",
                    "category": 5,
                    "KPIsByBedroomCategory": {
                        "3": {
                            "ADRAvg": 195.0,
                            "ADR25Percentile": 152.0,
                            "ADR75Percentile": 208.0,
                            "Revenue": 30228.0,
                            "AvgOccupancy": 60.1,
                            "NoOfListings": 118.0
                        },
                        "4": {
                            "ADRAvg": 242.0,
                            "ADR25Percentile": 192.0,
                            "ADR75Percentile": 283.0,
                            "Revenue": 40885.0,
                            "AvgOccupancy": 59.64,
                            "NoOfListings": 137.0
                        },
                        "5": {
                            "ADRAvg": 303.0,
                            "ADR25Percentile": 241.0,
                            "ADR75Percentile": 345.0,
                            "Revenue": 46323.0,
                            "AvgOccupancy": 58.99,
                            "NoOfListings": 39.0
                        }
                    }
                },
                {
                    "_id": 5,
                    "address": "21 Hercules St, Rockingham WA",
                    "category": 4,
                    "KPIsByBedroomCategory": {
                        "2": {
                            "ADRAvg": 211.0,
                            "ADR25Percentile": 167.0,
                            "ADR75Percentile": 239.0,
                            "Revenue": 39976.0,
                            "AvgOccupancy": 78.91,
                            "NoOfListings": 66.0
                        },
                        "3": {
                            "ADRAvg": 235.0,
                            "ADR25Percentile": 177.0,
                            "ADR75Percentile": 267.0,
                            "Revenue": 46532.0,
                            "AvgOccupancy": 81.73,
                            "NoOfListings": 49.0
                        },
                        "4": {
                            "ADRAvg": 316.0,
                            "ADR25Percentile": 237.0,
                            "ADR75Percentile": 373.0,
                            "Revenue": 58646.0,
                            "AvgOccupancy": 72.27,
                            "NoOfListings": 32.0
                        }
                    }
                }
            ];


            const property = data.find((prop) => prop._id == propertyId);
            const kpiData = property?.KPIsByBedroomCategory?.[property.category];
            const result = {
                _id: property._id,
                address: property.address,
                category: property.category,
                ...kpiData,
            }

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Property fetched successfully.",
                payload: result,
                res,
            });
        } catch (error) {
            console.error("Error in fetching property:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error fetching propety detail: ${error.message}`,
                res,
            });
        }
    },
}

module.exports = { property }