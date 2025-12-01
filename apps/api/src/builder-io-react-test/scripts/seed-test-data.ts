import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';
const sql = postgres(connectionString);

async function seedTestData() {
  console.log('Seeding test data...');

  // First ensure the PDF entry exists
  const pdfResult = await sql`
    INSERT INTO pdf (name, created_at, updated_at)
    VALUES ('rental appraisal', NOW(), NOW())
    ON CONFLICT (name) DO UPDATE SET updated_at = NOW()
    RETURNING id
  `;
  const pdfId = pdfResult[0].id;
  console.log('PDF ID:', pdfId);

  // Insert sample rental appraisal data
  const sampleData = {
    coverPageData: {
      addressCommonName: "123 Test Street, Sydney NSW 2000",
      reportDate: "2024-12-01"
    },
    propertyInfo: {
      bedroomCount: { value: 3, source: "CoreLogic" },
      bathroomCount: { value: 2, source: "CoreLogic" },
      yearBuilt: { value: 1985, source: "Council Records" },
      landArea: { value: 650, unit: "sqm", source: "Title" },
      floorArea: { value: 180, unit: "sqm", source: "Estimated" },
      propertyType: { type: "House", subtype: "Detached" },
      estimatedValue: {
        low: 850000,
        high: 950000,
        median: 900000,
        currency: "AUD"
      },
      appraisalSummary: {
        estimatedRentPerWeek: 750,
        estimatedRentPerMonth: 3250,
        confidence: "High",
        notes: "Strong rental demand in the area"
      },
      nearbySchools: [
        { name: "Sydney Grammar School", type: "Secondary", distance: 1.2, rating: 9.5 },
        { name: "Crown Street Public School", type: "Primary", distance: 0.8, rating: 8.0 }
      ]
    },
    locationAndSuburbData: {
      distanceFromCBD: { distance: 5, unit: "km" },
      populationAmount: { total: 45000, density: 5200 },
      fiveYearPopulationGrowth: { growthPercentage: 8.5, trend: "increasing" },
      occupancyChart: { ownerOccupied: 45, rented: 50, other: 5 }
    },
    planningZoningData: {
      zoneCode: { code: "R2", name: "Low Density Residential" },
      zoneDescription: { description: "Primarily residential with some local services", purpose: "Housing" },
      planningScheme: { name: "Sydney LEP", authority: "City of Sydney" },
      landUse: { current: "Residential", permitted: ["Dwelling", "Dual Occupancy"], prohibited: ["Industrial"] }
    },
    environmentalData: {
      floodRiskData: { floodZone: "Low", riskLevel: "Minimal", aep: 1 },
      bushfireRisk: { riskLevel: "Low", bmoRequirements: null },
      heritageData: { isListed: false, listingType: null, significance: null }
    },
    infrastructureData: {
      waterData: { provider: "Sydney Water", supply: "Mains", quality: "Excellent" },
      electricity: { provider: "Ausgrid", nearbyTransmissionLines: [] },
      sewageData: { provider: "Sydney Water", system: "Mains Sewer", capacity: "Adequate" }
    }
  };

  const reportResult = await sql`
    INSERT INTO rental_appraisal_data (data, created_at, updated_at)
    VALUES (${JSON.stringify(sampleData)}::jsonb, NOW(), NOW())
    RETURNING id
  `;
  console.log('Report data ID:', reportResult[0].id);

  // Insert sample DOM bindings
  const bindings = [
    { path: '#property-address', stateBinding: 'coverPageData.addressCommonName', properties: { dataType: 'string' } },
    { path: '#report-date', stateBinding: 'coverPageData.reportDate', properties: { dataType: 'string' } },
    { path: '#bedroom-count', stateBinding: 'propertyInfo.bedroomCount.value', properties: { dataType: 'number' } },
    { path: '#bathroom-count', stateBinding: 'propertyInfo.bathroomCount.value', properties: { dataType: 'number' } },
    { path: '#year-built', stateBinding: 'propertyInfo.yearBuilt.value', properties: { dataType: 'number' } },
    { path: '#land-area', stateBinding: 'propertyInfo.landArea.value', properties: { dataType: 'number' } },
    { path: '#floor-area', stateBinding: 'propertyInfo.floorArea.value', properties: { dataType: 'number' } },
    { path: '#property-type', stateBinding: 'propertyInfo.propertyType.type', properties: { dataType: 'string' } },
    { path: '#rent-per-week', stateBinding: 'propertyInfo.appraisalSummary.estimatedRentPerWeek', properties: { dataType: 'number' } },
    { path: '#rent-per-month', stateBinding: 'propertyInfo.appraisalSummary.estimatedRentPerMonth', properties: { dataType: 'number' } },
    { path: '#confidence', stateBinding: 'propertyInfo.appraisalSummary.confidence', properties: { dataType: 'string' } },
    { path: '#appraisal-notes', stateBinding: 'propertyInfo.appraisalSummary.notes', properties: { dataType: 'string' } },
    { path: '#estimated-value-low', stateBinding: 'propertyInfo.estimatedValue.low', properties: { dataType: 'number' } },
    { path: '#estimated-value-median', stateBinding: 'propertyInfo.estimatedValue.median', properties: { dataType: 'number' } },
    { path: '#estimated-value-high', stateBinding: 'propertyInfo.estimatedValue.high', properties: { dataType: 'number' } },
    { path: '#distance-from-cbd', stateBinding: 'locationAndSuburbData.distanceFromCBD.distance', properties: { dataType: 'number' } },
    { path: '#population', stateBinding: 'locationAndSuburbData.populationAmount.total', properties: { dataType: 'number' } },
    { path: '#population-growth', stateBinding: 'locationAndSuburbData.fiveYearPopulationGrowth.growthPercentage', properties: { dataType: 'number' } },
    { path: '#occupancy-owner', stateBinding: 'locationAndSuburbData.occupancyChart.ownerOccupied', properties: { dataType: 'number' } },
    { path: '#occupancy-rented', stateBinding: 'locationAndSuburbData.occupancyChart.rented', properties: { dataType: 'number' } },
    { path: '#occupancy-other', stateBinding: 'locationAndSuburbData.occupancyChart.other', properties: { dataType: 'number' } },
    { path: '#zone-code', stateBinding: 'planningZoningData.zoneCode.name', properties: { dataType: 'string' } },
    { path: '#zone-description', stateBinding: 'planningZoningData.zoneDescription.description', properties: { dataType: 'string' } },
    { path: '#planning-scheme', stateBinding: 'planningZoningData.planningScheme.name', properties: { dataType: 'string' } },
    { path: '#land-use', stateBinding: 'planningZoningData.landUse.current', properties: { dataType: 'string' } },
    { path: '#flood-risk', stateBinding: 'environmentalData.floodRiskData.riskLevel', properties: { dataType: 'string' } },
    { path: '#bushfire-risk', stateBinding: 'environmentalData.bushfireRisk.riskLevel', properties: { dataType: 'string' } },
    { path: '#heritage-listed', stateBinding: 'environmentalData.heritageData.isListed', properties: { dataType: 'boolean' } },
    { path: '#water-provider', stateBinding: 'infrastructureData.waterData.provider', properties: { dataType: 'string' } },
    { path: '#electricity-provider', stateBinding: 'infrastructureData.electricity.provider', properties: { dataType: 'string' } },
    { path: '#sewage-system', stateBinding: 'infrastructureData.sewageData.system', properties: { dataType: 'string' } },
  ];

  // Clear existing bindings for this PDF
  await sql`DELETE FROM dom_bindings WHERE pdf_id = ${pdfId}`;

  // Insert bindings
  for (const binding of bindings) {
    await sql`
      INSERT INTO dom_bindings (pdf_id, path, state_binding, properties, created_at, updated_at)
      VALUES (${pdfId}, ${binding.path}, ${binding.stateBinding}, ${JSON.stringify(binding.properties)}::jsonb, NOW(), NOW())
    `;
  }
  console.log(`Inserted ${bindings.length} DOM bindings`);

  console.log('Done!');
  await sql.end();
}

seedTestData().catch(console.error);
