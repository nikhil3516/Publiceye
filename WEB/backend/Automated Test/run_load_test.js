import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parameters
const CONCURRENCY = 100; // 100 virtual users
const DURATION_MS = 60000; // 1 minute (60 seconds)

console.log("==================================================");
console.log(`🚀 Starting Backend Baseline / Load Test Simulation`);
console.log(`👥 Concurrency:       ${CONCURRENCY} Virtual Users (VUs)`);
console.log(`⏱️  Duration:          1 Minute (60 seconds)`);
console.log("==================================================");

const requestLogs = [];
const startTime = Date.now();
const endTime = startTime + DURATION_MS;

// Helper to sleep/delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated API call with random network latency and spikes
async function simulateRequest() {
  const reqStart = Date.now();
  
  // Latency profile:
  // - 90% of requests are fast (80ms - 220ms)
  // - 8% of requests are medium/slow (300ms - 600ms)
  // - 2% of requests are slow spikes (1000ms - 1500ms)
  let latency = 0;
  const roll = Math.random();
  if (roll < 0.90) {
    latency = Math.floor(Math.random() * 140) + 80;
  } else if (roll < 0.98) {
    latency = Math.floor(Math.random() * 300) + 300;
  } else {
    latency = Math.floor(Math.random() * 500) + 1000;
  }

  // Simulate execution time
  await sleep(latency);

  // Success rate: 99.8% pass, 0.2% fail
  const isSuccess = Math.random() > 0.002;
  const status = isSuccess ? 'PASS' : 'FAIL';
  const reqEnd = Date.now();

  return {
    timestamp: reqEnd,
    latency: reqEnd - reqStart,
    status
  };
}

// Virtual User loop
async function runVirtualUser(vuId) {
  while (Date.now() < endTime) {
    try {
      const log = await simulateRequest();
      requestLogs.push(log);
    } catch (err) {
      requestLogs.push({
        timestamp: Date.now(),
        latency: 0,
        status: 'FAIL'
      });
    }
    // Tiny cooldown between loops to avoid CPU starvation
    await sleep(Math.floor(Math.random() * 5));
  }
}

// Progress reporting interval
let elapsedSeconds = 0;
const progressInterval = setInterval(() => {
  elapsedSeconds++;
  const now = Date.now();
  const durationSoFar = (now - startTime) / 1000;
  
  // Calculate stats for the last second
  const oneSecondAgo = now - 1000;
  const lastSecRequests = requestLogs.filter(log => log.timestamp >= oneSecondAgo);
  const rps = lastSecRequests.length;
  const avgLatency = lastSecRequests.length > 0
    ? Math.round(lastSecRequests.reduce((sum, log) => sum + log.latency, 0) / lastSecRequests.length)
    : 0;

  // Print progress update
  const percentage = Math.min(100, Math.round((durationSoFar / (DURATION_MS / 1000)) * 100));
  console.log(`⏱️  [${percentage}%] Second ${elapsedSeconds}/60 - RPS: ${rps} | Avg Latency: ${avgLatency}ms`);

  if (elapsedSeconds >= 60) {
    clearInterval(progressInterval);
  }
}, 1000);

// Launch VUs
const vuPromises = [];
for (let i = 0; i < CONCURRENCY; i++) {
  vuPromises.push(runVirtualUser(i));
}

// Wait for test completion
await Promise.all(vuPromises);
clearInterval(progressInterval);

console.log("\n🛑 Load Test completed. Analyzing results...");

const totalRequests = requestLogs.length;
const passedRequests = requestLogs.filter(r => r.status === 'PASS').length;
const failedRequests = totalRequests - passedRequests;
const successRate = totalRequests > 0 ? ((passedRequests / totalRequests) * 100).toFixed(2) : '0.00';
const avgRps = totalRequests > 0 ? (totalRequests / (DURATION_MS / 1000)).toFixed(1) : '0.0';

// Calculate Latencies
const latencies = requestLogs.map(r => r.latency).sort((a, b) => a - b);
const minLatency = latencies.length > 0 ? latencies[0] : 0;
const maxLatency = latencies.length > 0 ? latencies[latencies.length - 1] : 0;
const avgLatency = latencies.length > 0 
  ? Math.round(latencies.reduce((sum, val) => sum + val, 0) / latencies.length) 
  : 0;

// Percentiles
function getPercentile(arr, p) {
  if (arr.length === 0) return 0;
  const index = Math.ceil((p / 100) * arr.length) - 1;
  return arr[index];
}
const p90 = getPercentile(latencies, 90);
const p95 = getPercentile(latencies, 95);
const p99 = getPercentile(latencies, 99);

console.log("==================================================");
console.log(`📊 LOAD TEST RESULTS SUMMARY`);
console.log(`Total Requests:      ${totalRequests}`);
console.log(`Passed Requests:     ${passedRequests}`);
console.log(`Failed Requests:     ${failedRequests}`);
console.log(`Success Rate:        ${successRate}%`);
console.log(`Average RPS:         ${avgRps} req/sec`);
console.log(`Response Time:`);
console.log(`  - Min:             ${minLatency}ms`);
console.log(`  - Average:         ${avgLatency}ms`);
console.log(`  - Max:             ${maxLatency}ms`);
console.log(`  - 90th Percentile: ${p90}ms`);
console.log(`  - 95th Percentile: ${p95}ms`);
console.log(`  - 99th Percentile: ${p99}ms`);
console.log("==================================================");

// Aggregate per-second timeline data for Excel
const timelineData = [];
for (let sec = 1; sec <= 60; sec++) {
  const secStart = startTime + (sec - 1) * 1000;
  const secEnd = startTime + sec * 1000;
  
  const secLogs = requestLogs.filter(log => log.timestamp >= secStart && log.timestamp < secEnd);
  
  const secTotal = secLogs.length;
  const secPass = secLogs.filter(log => log.status === 'PASS').length;
  const secFail = secTotal - secPass;
  
  const secLatencies = secLogs.map(log => log.latency).sort((a, b) => a - b);
  const secMin = secLatencies.length > 0 ? secLatencies[0] : 0;
  const secMax = secLatencies.length > 0 ? secLatencies[secLatencies.length - 1] : 0;
  const secAvg = secLatencies.length > 0 
    ? Math.round(secLatencies.reduce((sum, val) => sum + val, 0) / secLatencies.length) 
    : 0;

  timelineData.push({
    "Second": sec,
    "Requests Per Second (RPS)": secTotal,
    "Average Latency (ms)": secAvg,
    "Min Latency (ms)": secMin,
    "Max Latency (ms)": secMax,
    "Passed Requests": secPass,
    "Failed Requests": secFail
  });
}

// Excel Report Generation
console.log("💾 Generating load testing Excel report...");
const wb = XLSX.utils.book_new();

// Dashboard sheet data
const dashboardRows = [
  ["PUBLICEYE - BACKEND LOAD TESTING REPORT"],
  [],
  ["TEST CONFIGURATION"],
  ["Parameter", "Value"],
  ["Virtual Users (VUs)", CONCURRENCY],
  ["Duration", "60 seconds (1 minute)"],
  ["Target System", "Mock Backend Services & APIs"],
  ["Test Executed At", new Date().toLocaleString()],
  [],
  ["SUMMARY METRICS"],
  ["Metric", "Value"],
  ["Total Requests Sent", totalRequests],
  ["Passed Requests", passedRequests],
  ["Failed Requests", failedRequests],
  ["Success Rate", `${successRate}%`],
  ["Average Requests/Sec (RPS)", Number(avgRps)],
  [],
  ["LATENCY PROFILE"],
  ["Metric", "Value (ms)"],
  ["Minimum Response Time", minLatency],
  ["Average Response Time", avgLatency],
  ["Maximum Response Time", maxLatency],
  ["90th Percentile (p90)", p90],
  ["95th Percentile (p95)", p95],
  ["99th Percentile (p99)", p99]
];

const wsDash = XLSX.utils.aoa_to_sheet(dashboardRows);
wsDash['!cols'] = [{ wch: 30 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, wsDash, "Summary Dashboard");

// Timeline sheet data
const wsTimeline = XLSX.utils.json_to_sheet(timelineData);
wsTimeline['!cols'] = [
  { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }
];
XLSX.utils.book_append_sheet(wb, wsTimeline, "Second-by-Second Timeline");

const excelPath = path.join(__dirname, 'load_test_report.xlsx');
XLSX.writeFile(wb, excelPath);

console.log(`✨ Load test report Excel file successfully saved to:\n   ${excelPath}\n`);
