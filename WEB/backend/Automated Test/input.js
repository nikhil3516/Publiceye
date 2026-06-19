import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import { classifyComplaint } from '../../src/services/aiClassifier.ts';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("==================================================");
  console.log("🚀 Starting Backend AI Classifier Tests...");
  console.log("==================================================");

  // Path to input.json
  const inputPath = path.join(__dirname, 'input.json');
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: input.json not found at ${inputPath}`);
    process.exit(1);
  }

  // Load test cases
  const testCases = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`📋 Loaded ${testCases.length} test cases from input.json.\n`);

  const reportData = [];
  let passedCount = 0;

  for (const tc of testCases) {
    console.log(`🔍 Running Test ${tc.id}: "${tc.description.substring(0, 50)}..."`);
    
    // Call the classification function
    const result = classifyComplaint(tc.description, tc.categoryHint);

    // Verify category, severity, officer, SLA
    const categoryMatch = result.category === tc.expectedCategory;
    const severityMatch = result.severity === tc.expectedSeverity;
    const officerMatch = result.assignedOfficer.name === tc.expectedOfficer;
    const slaMatch = result.slaHours === tc.expectedSla;

    const isPassed = categoryMatch && severityMatch && officerMatch && slaMatch;
    if (isPassed) {
      passedCount++;
      console.log(`   ✅ PASS`);
    } else {
      console.log(`   ❌ FAIL`);
      if (!categoryMatch) console.log(`      - Category Mismatch: Expected [${tc.expectedCategory}], Got [${result.category}]`);
      if (!severityMatch) console.log(`      - Severity Mismatch: Expected [${tc.expectedSeverity}], Got [${result.severity}]`);
      if (!officerMatch) console.log(`      - Officer Mismatch: Expected [${tc.expectedOfficer}], Got [${result.assignedOfficer.name}]`);
      if (!slaMatch) console.log(`      - SLA Mismatch: Expected [${tc.expectedSla}], Got [${result.slaHours}]`);
    }

    // Add to report data
    reportData.push({
      "Test Case ID": tc.id,
      "Description": tc.description,
      "Category Hint": tc.categoryHint || 'None',
      "Expected Category": tc.expectedCategory,
      "Actual Category": result.category,
      "Category Match": categoryMatch ? "PASS" : "FAIL",
      "Expected Severity": tc.expectedSeverity,
      "Actual Severity": result.severity,
      "Severity Match": severityMatch ? "PASS" : "FAIL",
      "Expected Officer": tc.expectedOfficer,
      "Actual Officer": result.assignedOfficer.name,
      "Officer Match": officerMatch ? "PASS" : "FAIL",
      "Expected SLA (Hours)": tc.expectedSla,
      "Actual SLA (Hours)": result.slaHours,
      "SLA Match": slaMatch ? "PASS" : "FAIL",
      "Confidence Score (%)": result.confidenceScore,
      "Keywords Detected": result.keywords.join(', '),
      "AI Summary": result.aiSummary,
      "Overall Status": isPassed ? "PASS" : "FAIL"
    });
  }

  const passRate = ((passedCount / testCases.length) * 100).toFixed(1);
  console.log("\n==================================================");
  console.log("📊 Test Execution Summary");
  console.log("==================================================");
  console.log(`Total Tests Run: ${testCases.length}`);
  console.log(`Passed:         ${passedCount}`);
  console.log(`Failed:         ${testCases.length - passedCount}`);
  console.log(`Pass Rate:      ${passRate}%`);
  console.log("==================================================\n");

  // Create Excel Report using SheetJS (xlsx)
  console.log("💾 Generating Excel report sheet...");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(reportData);

  // Adjust column widths automatically
  const maxWds = [];
  reportData.forEach(row => {
    Object.keys(row).forEach((key, colIdx) => {
      const val = row[key] ? row[key].toString() : '';
      maxWds[colIdx] = Math.max(maxWds[colIdx] || 10, key.length, val.length);
    });
  });
  ws['!cols'] = maxWds.map(w => ({ wch: w + 2 }));

  XLSX.utils.book_append_sheet(wb, ws, "AI Classification Report");

  const reportFile = path.join(__dirname, 'testing_report.xlsx');
  XLSX.writeFile(wb, reportFile);

  console.log(`✨ Excel report successfully saved to:\n   ${reportFile}`);
  console.log("==================================================\n");
}

runTests().catch(err => {
  console.error("❌ Test script failed with error:", err);
});
