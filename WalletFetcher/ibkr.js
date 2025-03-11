const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const requestBase = "https://ndcdyn.interactivebrokers.com/AccountManagement/FlexWebService";

function parseCsvToJson(csvText) {
  // Split the CSV into lines and remove quotes from each line, then split by comma
  const lines = csvText.trim().split("\n").map(line => line.replace(/"/g, '').split(","));

  // Extract the EndingSettledCash value from the first two rows
  const endingCashValues = lines[1];
  // Assuming the first column corresponds to EndingSettledCash
  const endingSettledCash = parseFloat(endingCashValues[0]);

  // Find the header row for positions (starting with "Symbol")
  const headerRowIndex = lines.findIndex(line => line[0] === "Symbol");
  if (headerRowIndex === -1) {
    throw new Error("No header row found for positions.");
  }

  // Extract the positions starting after the header row
  const positions = lines.slice(headerRowIndex + 1).map(line => ({
    asset: line[0],
    size: parseFloat(line[1]),
    price: parseFloat(line[2]),
    wallet: 'ibkr',
  }));

  // Add the ending settled cash as a position with fixed price 1 and asset "USD"
  positions.unshift({
    asset: "USD",
    size: endingSettledCash,
    price: 1,
    wallet: 'ibkr',
  });

  return positions;
}

function readFromCache(id) {
  const cache_filename = `./caches/ibkr-cache-${id}.json`;
  const oldestTimeDiff = 1000 * 3600 * 12; // 12 hours
  if (!fs.existsSync(cache_filename)) return false;

  const cache_stat = fs.statSync(cache_filename);
  if (cache_stat.mtimeMs + oldestTimeDiff < Date.now()) return false

  return JSON.parse(fs.readFileSync(cache_filename));
}

async function fetchFlexQuery(credentials) {
  const { token, queryId, id } = credentials;
  const cache = readFromCache(id);
  if (cache) return cache;

  const res1 = await axios.get(`${requestBase}/SendRequest?t=${token}&q=${queryId}&v=3`);
  const { FlexStatementResponse } = await xml2js.parseStringPromise(res1.data, { explicitArray: false });
  if (FlexStatementResponse.Status !== "Success") {
    throw new Error(`Flex query failed: ${FlexStatementResponse.ErrorMessage}`);
  }

  const { ReferenceCode } = FlexStatementResponse;

  const res2 = await axios.get(`${requestBase}/GetStatement?t=${token}&q=${ReferenceCode}&v=3`);
  const result = parseCsvToJson(res2.data);
  fs.writeFileSync(`./caches/ibkr-cache-${id}.json`, JSON.stringify(result));
  return result;
}

module.exports = fetchFlexQuery;