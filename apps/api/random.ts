async function fetchPropertyInsights(propertyId: string, bearerToken: string) {
  const url = `https://propertyhub.corelogic.asia/clspa-gateway/propertyhub/user/property/${propertyId}/insights`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-GB-oxendict;q=0.9,en;q=0.8",
      authorization: `Bearer ${bearerToken}`,
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: `https://propertyhub.corelogic.asia/property/7-English-Place-Kew-VIC-3101/${propertyId}`,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function main() {
  const propertyId = "16062963";
  const bearerToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5OWUwYjYxZi0xOWExLTRkMDktYTM5Mi04M2NjYjQ4YWViMmEiLCJhcHBfYWNjdF9ndWlkIjoiNjhlZTY1NGQtZWJlNS00YmQ4LWIyYTUtZGY2MzkxMWQzZGUxIiwidXNlcl9uYW1lIjoibWVndHVyaXNtMCIsImlzcyI6Imh0dHBzOlwvXC9hY2Nlc3MtYXBpLmNvcmVsb2dpYy5hc2lhIiwiZW52X2FjY2Vzc19yZXN0cmljdCI6ZmFsc2UsImNsaWVudF9pZCI6ImRhNDk1MzkzIiwiZ2VvX2NvZGVzIjpbIk5vbmUgU2V0Il0sImF1dGhvcml0aWVzIjpbIiJdLCJzY29wZSI6WyJvcGVuaWQiXSwiZXhwIjoxNzYxMDE2NDk0LCJ1c3JfZ3VpZCI6IjAyMTU1ZDkxLWU1ZWEtNGE0MC1iZWI0LWYzZGE0Nzc2NTM1MSIsImFjY3RfZ3VpZCI6ImI0NWVjYTM0LWY0ZDItNGI1Yi05NDUwLWU5YzU4OTY2NzdjNyIsImlhdCI6MTc2MTAxMjg5NiwianRpIjoiMTMxZjkwYzAtOGRhYy00MTdiLWJhNjQtMWMwNmEzYTY4NzA5In0.SkUdcnkIB6GE9wxpd3K7DYQivgiJN2fYBzudkl06O3YNbuKZf5MKg44euks9VPa1V1ZSe-M6HBu9ZR7Zc3DerrY6TIDAd6XgQDEkholWeAxEMleVYhjNjOy_RRnx9TrvpT6M51fccECCEgu5O_4miJI3t_gOFjPYOMd2FrpBnSo";

  try {
    console.log("🔍 Fetching property insights...");
    const data = await fetchPropertyInsights(propertyId, bearerToken);
    console.log("✅ Property Insights Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching property insights:", error);
    throw error;
  }
}

// Call main
main();
