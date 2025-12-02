import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:dAA2eF5B3cfe5G42f4gFEeA3gf114gd5@metro.proxy.rlwy.net:37409/railway';
const sql = postgres(connectionString);

async function seedSampleReport() {
  console.log('Seeding sample report data...');

  // First ensure the PDF entry exists
  const pdfResult = await sql`
    INSERT INTO pdf (name, created_at, updated_at)
    VALUES ('rental appraisal', NOW(), NOW())
    ON CONFLICT (name) DO UPDATE SET updated_at = NOW()
    RETURNING id
  `;
  const pdfId = pdfResult[0].id;
  console.log('PDF ID:', pdfId);

  // Check if sample report already exists
  const existingSample = await sql`
    SELECT id FROM rental_appraisal_data WHERE identifier = 'sample' LIMIT 1
  `;

  // Sample data matching the seed-test-data.ts structure (which matches current bindings)
  const sampleData = {
    coverPageData: {
      addressCommonName: "42 Harbour View Drive, Sydney NSW 2000",
      reportDate: new Date().toISOString().split('T')[0]
    },
    propertyInfo: {
      bedroomCount: { value: 4, source: "CoreLogic" },
      bathroomCount: { value: 2, source: "CoreLogic" },
      yearBuilt: { value: 1995, source: "Council Records" },
      landArea: { value: 720, unit: "sqm", source: "Title" },
      floorArea: { value: 220, unit: "sqm", source: "Building Plans" },
      propertyType: { type: "House", subtype: "Detached" },
      estimatedValue: {
        low: 1200000,
        high: 1400000,
        median: 1300000,
        currency: "AUD"
      },
      appraisalSummary: {
        estimatedRentPerWeek: 950,
        estimatedRentPerMonth: 4120,
        confidence: "High",
        notes: "Premium location with harbour views. Strong rental demand from professionals and families. Property features modern updates and excellent street appeal."
      },
      nearbySchools: [
        { name: "Sydney Boys High School", type: "Secondary", distance: 1.5, rating: 9.8 },
        { name: "Woollahra Public School", type: "Primary", distance: 0.6, rating: 8.5 },
        { name: "Ascham School", type: "Secondary", distance: 2.1, rating: 9.2 }
      ]
    },
    locationAndSuburbData: {
      distanceFromCBD: { distance: 4, unit: "km" },
      populationAmount: { total: 52000, density: 6100 },
      fiveYearPopulationGrowth: { growthPercentage: 12.3, trend: "increasing" },
      occupancyChart: { ownerOccupied: 55, rented: 40, other: 5 }
    },
    planningZoningData: {
      zoneCode: { code: "R3", name: "Medium Density Residential" },
      zoneDescription: { description: "Residential zone allowing medium density housing with local amenities", purpose: "Mixed Housing" },
      planningScheme: { name: "Sydney LEP 2012", authority: "City of Sydney Council" },
      landUse: { current: "Residential", permitted: ["Dwelling House", "Dual Occupancy", "Multi-dwelling Housing"], prohibited: ["Industrial", "Heavy Commercial"] }
    },
    environmentalData: {
      floodRiskData: { floodZone: "None", riskLevel: "Minimal", aep: 0.5 },
      bushfireRisk: { riskLevel: "Low", bmoRequirements: null },
      heritageData: { isListed: false, listingType: null, significance: null }
    },
    infrastructureData: {
      waterData: { provider: "Sydney Water", supply: "Mains", quality: "Excellent" },
      electricity: { provider: "Ausgrid", nearbyTransmissionLines: [] },
      sewageData: { provider: "Sydney Water", system: "Mains Sewer", capacity: "Excellent" }
    }
  };

  let reportId: number;

  if (existingSample.length > 0) {
    // Update existing sample
    reportId = existingSample[0].id;
    await sql`
      UPDATE rental_appraisal_data
      SET data = ${JSON.stringify(sampleData)}::jsonb,
          updated_at = NOW(),
          status = 'pending',
          pdf_url = NULL
      WHERE identifier = 'sample'
    `;
    console.log('Updated existing sample report, ID:', reportId);
  } else {
    // Insert new sample
    const reportResult = await sql`
      INSERT INTO rental_appraisal_data (identifier, data, status, created_at, updated_at)
      VALUES ('sample', ${JSON.stringify(sampleData)}::jsonb, 'pending', NOW(), NOW())
      RETURNING id
    `;
    reportId = reportResult[0].id;
    console.log('Created new sample report, ID:', reportId);
  }

  // Make sure bindings exist for this PDF
  const existingBindings = await sql`SELECT COUNT(*) as count FROM dom_bindings WHERE pdf_id = ${pdfId}`;

  if (parseInt(existingBindings[0].count) === 0) {
    console.log('No bindings found, inserting sample bindings...');

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

    for (const binding of bindings) {
      await sql`
        INSERT INTO dom_bindings (pdf_id, path, state_binding, properties, created_at, updated_at)
        VALUES (${pdfId}, ${binding.path}, ${binding.stateBinding}, ${JSON.stringify(binding.properties)}::jsonb, NOW(), NOW())
      `;
    }
    console.log(`Inserted ${bindings.length} DOM bindings`);
  } else {
    console.log(`Found ${existingBindings[0].count} existing bindings`);
  }

  console.log('\n✅ Sample report seeded successfully!');
  console.log(`   Report ID: ${reportId}`);
  console.log(`   Identifier: sample`);
  console.log(`   PDF ID: ${pdfId}`);
  console.log('\nYou can now:');
  console.log('   - Visit /report/sample to see the report');
  console.log('   - Call /api/pdf/sample to generate the PDF');

  await sql.end();
}

seedSampleReport().catch(console.error);
