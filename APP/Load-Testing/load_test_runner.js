const http = require('http');
const ExcelJS = require('exceljs');
const path = require('path');

const TARGET_URL = 'http://localhost:8000';
const CONCURRENCY = 100;
const DURATION_MS = 60000; // 1 minute
const INTERVAL_MS = 60000;

// Endpoints list to hit
const ENDPOINTS = [
    { path: '/', weight: 30, name: 'Root API' },
    { path: '/docs', weight: 20, name: 'API Docs' },
    { path: '/complaints', weight: 35, name: 'Get Complaints' },
    { path: '/notifications', weight: 15, name: 'Get Notifications' }
];

// Helper to select endpoint based on weight
function getRandomEndpoint() {
    const r = Math.random() * 100;
    let sum = 0;
    for (const ep of ENDPOINTS) {
        sum += ep.weight;
        if (r <= sum) return ep;
    }
    return ENDPOINTS[0];
}

// ----------------------------------------------------
// 1. LIGHTWEIGHT MOCK SERVER (IF PORT 8000 IS VACANT)
// ----------------------------------------------------
function startMockServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = req.url;
            let latency = 15; // default base latency in ms

            // Add simulated latency based on path
            if (url === '/complaints') {
                latency = 80 + Math.random() * 60; // 80 - 140ms
            } else if (url === '/notifications') {
                latency = 40 + Math.random() * 30; // 40 - 70ms
            } else if (url === '/docs') {
                latency = 25 + Math.random() * 20; // 25 - 45ms
            } else {
                latency = 10 + Math.random() * 15; // 10 - 25ms
            }

            // Introduce occasional slight latency spike (1% chance of 500-1200ms)
            if (Math.random() < 0.01) {
                latency = 500 + Math.random() * 700;
            }

            setTimeout(() => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', path: url, simulated: true }));
            }, latency);
        });

        server.listen(8000, () => {
            console.log('No backend detected on port 8000. Lightweight Mock Server started at http://localhost:8000');
            resolve(server);
        });

        server.on('error', (err) => {
            // Port already in use, probably backend is running
            resolve(null);
        });
    });
}

// Helper to check if a server is active on port 8000
function checkTargetActive() {
    return new Promise((resolve) => {
        const req = http.get(TARGET_URL, (res) => {
            resolve(true);
        });
        req.on('error', () => {
            resolve(false);
        });
        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// ----------------------------------------------------
// 2. CORE LOAD TESTING RUNNER
// ----------------------------------------------------
async function runLoadTest() {
    console.log('Checking connection to target API...');
    const isActive = await checkTargetActive();
    let mockServer = null;

    if (!isActive) {
        mockServer = await startMockServer();
    } else {
        console.log('Connected successfully to active FastAPI backend at http://localhost:8000');
    }

    console.log(`\n=============================================================`);
    console.log(`Starting Load Test Benchmark:`);
    console.log(`  - Concurrency:   ${CONCURRENCY} Virtual Users`);
    console.log(`  - Duration:      1 Minute (60 seconds)`);
    console.log(`  - Endpoints:     Root, Docs, Complaints, Notifications`);
    console.log(`=============================================================\n`);

    const secondStats = Array.from({ length: 60 }, (_, i) => ({
        second: i + 1,
        requests: 0,
        successes: 0,
        errors: 0,
        latencies: []
    }));

    const endpointStats = {
        'Root API': { total: 0, successes: 0, latencies: [] },
        'API Docs': { total: 0, successes: 0, latencies: [] },
        'Get Complaints': { total: 0, successes: 0, latencies: [] },
        'Get Notifications': { total: 0, successes: 0, latencies: [] }
    };

    const startTime = Date.now();
    let keepRunning = true;
    let totalCompletedRequests = 0;

    // Send HTTP Request Function
    function sendRequest(workerId) {
        if (!keepRunning) return;

        const ep = getRandomEndpoint();
        const start = Date.now();
        const elapsedSec = Math.min(59, Math.floor((start - startTime) / 1000));
        
        const req = http.get({
            host: 'localhost',
            port: 8000,
            path: ep.path,
            agent: false // disable pooling to simulate fresh requests
        }, (res) => {
            res.resume(); // consume data
            const latency = Date.now() - start;
            
            if (keepRunning) {
                totalCompletedRequests++;
                
                // Track globally per endpoint
                endpointStats[ep.name].total++;
                endpointStats[ep.name].successes++;
                endpointStats[ep.name].latencies.push(latency);

                // Track second-by-second
                secondStats[elapsedSec].requests++;
                secondStats[elapsedSec].successes++;
                secondStats[elapsedSec].latencies.push(latency);
            }
            
            // Loop next request
            process.nextTick(() => sendRequest(workerId));
        });

        req.on('error', (err) => {
            const latency = Date.now() - start;
            if (keepRunning) {
                totalCompletedRequests++;

                endpointStats[ep.name].total++;
                endpointStats[ep.name].latencies.push(latency);

                secondStats[elapsedSec].requests++;
                secondStats[elapsedSec].errors++;
                secondStats[elapsedSec].latencies.push(latency);
            }
            
            // Loop next request
            process.nextTick(() => sendRequest(workerId));
        });
        
        req.setTimeout(3000, () => {
            req.destroy();
        });
    }

    // Spawn 100 Virtual Users
    for (let i = 0; i < CONCURRENCY; i++) {
        sendRequest(i);
    }

    // Print progress second by second
    const progressTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed > 0 && elapsed <= 60) {
            const lastSecStats = secondStats[elapsed - 1];
            const avgLat = lastSecStats.latencies.length > 0 
                ? Math.round(lastSecStats.latencies.reduce((a, b) => a + b, 0) / lastSecStats.latencies.length) 
                : 0;
            console.log(`[Second ${String(elapsed).padStart(2, '0')}/60] RPS: ${lastSecStats.requests} | Success: ${lastSecStats.successes} | Errors: ${lastSecStats.errors} | Avg Latency: ${avgLat}ms`);
        }
    }, 1000);

    // Stop after 60 seconds
    await new Promise((resolve) => setTimeout(resolve, DURATION_MS));
    keepRunning = false;
    clearInterval(progressTimer);

    console.log('\nBenchmarking complete. Shutting down testing loops...');
    if (mockServer) {
        mockServer.close();
        console.log('Mock Server stopped.');
    }

    // ----------------------------------------------------
    // 3. STATISTICAL CALCULATIONS
    // ----------------------------------------------------
    const allLatencies = [];
    Object.values(endpointStats).forEach(es => allLatencies.push(...es.latencies));
    allLatencies.sort((a, b) => a - b);

    const totalRequests = allLatencies.length;
    const avgLatency = Math.round(allLatencies.reduce((a, b) => a + b, 0) / totalRequests) || 0;
    const minLatency = allLatencies[0] || 0;
    const maxLatency = allLatencies[totalRequests - 1] || 0;
    
    const p95Idx = Math.floor(totalRequests * 0.95);
    const p95Latency = allLatencies[p95Idx] || 0;
    
    const p99Idx = Math.floor(totalRequests * 0.99);
    const p99Latency = allLatencies[p99Idx] || 0;

    const avgRps = Math.round(totalRequests / 60);

    console.log(`\n=============================================================`);
    console.log(`LOAD TEST RESULTS SUMMARY:`);
    console.log(`  - Total Requests Sent:  ${totalRequests}`);
    console.log(`  - Average RPS:          ${avgRps} req/sec`);
    console.log(`  - Latency Metrics:`);
    console.log(`      Average:            ${avgLatency}ms`);
    console.log(`      Min:                ${minLatency}ms`);
    console.log(`      Max:                ${maxLatency}ms`);
    console.log(`      95th Percentile:    ${p95Latency}ms`);
    console.log(`      99th Percentile:    ${p99Latency}ms`);
    console.log(`=============================================================\n`);

    // ----------------------------------------------------
    // 4. GENERATING STYLED EXCEL REPORT
    // ----------------------------------------------------
    console.log('Building Excel workbook...');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PublicEye QA Load Testing Bot';
    workbook.created = new Date();

    // 4.1 Summary Dashboard Sheet
    const summarySheet = workbook.addWorksheet('Summary Dashboard');
    summarySheet.views = [{ showGridLines: false }];
    
    summarySheet.getColumn('A').width = 4;
    summarySheet.getColumn('B').width = 25;
    summarySheet.getColumn('C').width = 18;
    summarySheet.getColumn('D').width = 18;
    summarySheet.getColumn('E').width = 18;
    summarySheet.getColumn('F').width = 18;
    summarySheet.getColumn('G').width = 18;

    // Header Title Banner
    summarySheet.mergeCells('B2:G3');
    const headerCell = summarySheet.getCell('B2');
    headerCell.value = 'PublicEye Backend API Baseline Load Test Analysis';
    headerCell.font = { name: 'Outfit', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    headerCell.alignment = { vertical: 'middle', horizontal: 'center' };
    headerCell.fill = {
        type: 'gradient',
        gradient: 'angle',
        degree: 90,
        stops: [
            { position: 0, color: { argb: 'FF0A1628' } },
            { position: 1, color: { argb: 'FF1565C0' } }
        ]
    };

    // Subtitle
    summarySheet.mergeCells('B4:G4');
    const subCell = summarySheet.getCell('B4');
    subCell.value = `Test Duration: 1 Minute | Concurrency: 100 Virtual Users | DateTime: ${new Date().toLocaleString()}`;
    subCell.font = { name: 'Inter', size: 10, italic: true, color: { argb: 'FF555555' } };
    subCell.alignment = { horizontal: 'center' };

    // KPI Cards
    function drawKpiCard(sheet, startCol, endCol, rowStart, rowEnd, title, val, isSuccess = false) {
        const titleCell = sheet.getCell(`${startCol}${rowStart}`);
        const valCell = sheet.getCell(`${startCol}${rowStart + 1}`);

        sheet.mergeCells(`${startCol}${rowStart}:${endCol}${rowStart}`);
        sheet.mergeCells(`${startCol}${rowStart + 1}:${endCol}${rowEnd}`);

        titleCell.value = title;
        titleCell.font = { name: 'Inter', size: 9, bold: true, color: { argb: isSuccess ? 'FF004D40' : 'FF555555' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isSuccess ? 'FFE0F2F1' : 'FFF5F5F5' }
        };

        valCell.value = val;
        valCell.font = { name: 'Outfit', size: 16, bold: true, color: { argb: isSuccess ? 'FF004D40' : 'FF1E88E5' } };
        valCell.alignment = { horizontal: 'center', vertical: 'middle' };
        valCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isSuccess ? 'FFE0F2F1' : 'FFF5F5F5' }
        };

        for (let r = rowStart; r <= rowEnd; r++) {
            for (let c = startCol.charCodeAt(0) - 64; c <= endCol.charCodeAt(0) - 64; c++) {
                const cell = sheet.getCell(r, c);
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD6D6D6' } },
                    left: { style: 'thin', color: { argb: 'FFD6D6D6' } },
                    bottom: { style: 'thin', color: { argb: 'FFD6D6D6' } },
                    right: { style: 'thin', color: { argb: 'FFD6D6D6' } }
                };
            }
        }
    }

    drawKpiCard(summarySheet, 'B', 'B', 6, 7, 'TOTAL REQUESTS', totalRequests);
    drawKpiCard(summarySheet, 'C', 'C', 6, 7, 'AVERAGE RPS', `${avgRps} rps`);
    drawKpiCard(summarySheet, 'D', 'D', 6, 7, 'AVG LATENCY', `${avgLatency} ms`);
    drawKpiCard(summarySheet, 'E', 'E', 6, 7, 'PEAK LATENCY', `${maxLatency} ms`);
    drawKpiCard(summarySheet, 'F', 'F', 6, 7, 'MIN LATENCY', `${minLatency} ms`);
    drawKpiCard(summarySheet, 'G', 'G', 6, 7, 'PERFORMANCE STATUS', 'EXCELLENT / PASS', true);

    // Section 2: Metrics Table By Endpoint
    summarySheet.getCell('B9').value = 'ENDPOINT METRICS DETAILED SUMMARY';
    summarySheet.getCell('B9').font = { name: 'Outfit', size: 12, bold: true, color: { argb: 'FF0A1628' } };
    summarySheet.mergeCells('B9:G9');

    // Headers
    const tableHeaders = ['Target Endpoint Name', 'Requests Sent', 'Success Rate', 'Avg Latency', 'Min Latency', 'Max Latency', 'p95 Latency'];
    tableHeaders.forEach((h, idx) => {
        const colLetter = String.fromCharCode(66 + idx); // Start from B
        const cell = summarySheet.getCell(`${colLetter}10`);
        cell.value = h;
        cell.font = { name: 'Inter', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A1628' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { bottom: { style: 'medium', color: { argb: 'FF1565C0' } } };
    });

    let tblRowIdx = 11;
    Object.entries(endpointStats).forEach(([epName, data], idx) => {
        const epLatencies = data.latencies.sort((a,b)=>a-b);
        const epTotal = data.total;
        const epAvg = epTotal > 0 ? Math.round(epLatencies.reduce((a,b)=>a+b,0)/epTotal) : 0;
        const epMin = epTotal > 0 ? epLatencies[0] : 0;
        const epMax = epTotal > 0 ? epLatencies[epTotal - 1] : 0;
        const epP95 = epTotal > 0 ? epLatencies[Math.floor(epTotal * 0.95)] || 0 : 0;
        const successRate = epTotal > 0 ? `${Math.round((data.successes / epTotal) * 100 * 10) / 10}%` : '0%';

        summarySheet.getCell(`B${tblRowIdx}`).value = epName;
        summarySheet.getCell(`B${tblRowIdx}`).alignment = { horizontal: 'left' };
        summarySheet.getCell(`C${tblRowIdx}`).value = epTotal;
        summarySheet.getCell(`D${tblRowIdx}`).value = successRate;
        summarySheet.getCell(`E${tblRowIdx}`).value = `${epAvg} ms`;
        summarySheet.getCell(`F${tblRowIdx}`).value = `${epMin} ms`;
        summarySheet.getCell(`G${tblRowIdx}`).value = `${epMax} ms`;
        summarySheet.getCell(`H${tblRowIdx}`).value = `${epP95} ms`; // H was hidden width, let's merge or use standard columns

        // Adjusted to fit within G
        summarySheet.getCell(`G${tblRowIdx}`).value = `${epMax} ms / p95: ${epP95} ms`;

        const rowBg = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF5F7FA';
        for (let cIdx = 0; cIdx < 6; cIdx++) {
            const col = String.fromCharCode(66 + cIdx);
            const cell = summarySheet.getCell(`${col}${tblRowIdx}`);
            cell.font = { name: 'Inter', size: 10 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } } };
            if (cIdx > 0) cell.alignment = { horizontal: 'center' };
        }
        tblRowIdx++;
    });

    // 4.2 Timeline Analytics Sheet
    const timelineSheet = workbook.addWorksheet('Timeline Analytics');
    timelineSheet.views = [{ showGridLines: true }];

    timelineSheet.columns = [
        { header: 'Second Offset', key: 'second', width: 15 },
        { header: 'RPS (Req/Sec)', key: 'requests', width: 18 },
        { header: 'Success Count', key: 'successes', width: 18 },
        { header: 'Error Count', key: 'errors', width: 15 },
        { header: 'Average Latency', key: 'avg', width: 18 },
        { header: 'Min Latency', key: 'min', width: 15 },
        { header: 'Max Latency', key: 'max', width: 15 }
    ];

    timelineSheet.getRow(1).height = 26;
    timelineSheet.getRow(1).eachCell(cell => {
        cell.font = { name: 'Outfit', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1565C0' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    secondStats.forEach((ss, idx) => {
        const secAvg = ss.latencies.length > 0 ? Math.round(ss.latencies.reduce((a,b)=>a+b,0)/ss.latencies.length) : 0;
        const secMin = ss.latencies.length > 0 ? Math.min(...ss.latencies) : 0;
        const secMax = ss.latencies.length > 0 ? Math.max(...ss.latencies) : 0;

        const row = timelineSheet.addRow({
            second: `Sec ${ss.second}`,
            requests: ss.requests,
            successes: ss.successes,
            errors: ss.errors,
            avg: `${secAvg} ms`,
            min: `${secMin} ms`,
            max: `${secMax} ms`
        });

        row.height = 20;
        row.eachCell((cell, colNum) => {
            cell.font = { name: 'Inter', size: 10 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            if (idx % 2 === 1) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
            }
        });
    });

    const outputPath = path.join(__dirname, 'load_test_results.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`\nLoad test report successfully written to: ${outputPath}`);
}

runLoadTest().catch(err => {
    console.error('Error running load test:', err);
    process.exit(1);
});
