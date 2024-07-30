// JavaScript code for Tax Refund Calculator
function calculateTaxRefund() {
  var input = document.getElementById("taxInput").value;
  var result = FILTER_REFUNDABLE_TAXES(input);
  document.getElementById("taxResult").innerText = result;
}

function FILTER_REFUNDABLE_TAXES(input) {
  var refundableTaxes = [
    "FR",
    "K5",
    "MC",
    "OT",
    "SL",
    "VR",
    "QX",
    "QT",
    "BX",
    "TE",
    "AE",
    "F6",
    "TP",
    "ZR",
    "GR",
    "WP",
    "WQ",
    "YD",
    "I3",
    "IB",
    "IP",
    "ZG",
    "RG",
    "SP",
    "CG",
    "HS",
    "NM",
    "RR",
    "RZ",
    "ZC",
    "IL",
    "F7",
    "JK",
    "O2",
    "TU",
    "DE",
    "RA",
    "TR",
    "DC",
    "RO",
    "AY",
    "XA",
    "YC",
    "TR",
    "M6",
    "OY",
    "XY",
    "CU",
    "AH",
    "FC",
    "FD",
    "PX",
    "Q5",
    "IH",
    "L3",
    "LB",
    "H4",
    "Q2",
    "GB",
    "UB",
    "SQ",
    "LI",
    "OI",
    "SW",
    "G3",
    "I5",
    "CO",
    "DG",
    "YS",
    "WT",
    "QQ",
    "Q5",
    "R1",
    "RD",
    "BE",
    "QH",
    "G5",
    "WO",
    "A1",
    "B1",
    "FS",
    "IK",
    "NW",
    "P5",
    "AT",
    "QD",
    "ZY",
    "UK",
    "D2",
    "QB",
    "QI",
    "PT",
    "YP",
    "HB",
    "IT",
    "MJ",
    "A6",
    "WE",
    "I1",
    "IZ",
    "O4",
    "MK",
    "VS",
    "XW",
    "HR",
    "MI",
    "P2",
    "YM",
    "RC",
    "IF",
    "IG",
    "SV",
    "GH",
    "IM",
    "JD",
    "OG",
    "QV",
    "BP",
    "PU",
    "WB",
    "KB",
    "GG",
    "QO",
    "S7",
    "TQ",
    "XR",
    "EX",
    "VT",
    "EF",
    "GN",
    "MA",
    "JS",
    "IN",
    "CH",
    "WD",
    "G4",
    "PZ",
    "QA",
    "R9",
    "UG",
    "UL",
    "S1",
    "DW",
    "SC",
    "NG",
    "CA",
    "IS",
    "T1",
    "ZU",
  ];

  if (!input || input.trim() === "") {
    return "No valid taxes found.";
  }

  var words = input.split(/\s+/);
  var filteredTaxes = [];
  var totalSum = 0;

  for (var i = 0; i < words.length; i++) {
    if (words[i].toUpperCase() === "TAX" && i + 1 < words.length) {
      var taxInfo = words[i + 1].match(/(\d+\.\d+|\.\d+)([A-Z0-9]+)/);
      if (taxInfo) {
        var amount = parseFloat(taxInfo[1]) || 0;
        var code = taxInfo[2].toUpperCase(); // Ensure the tax code is in uppercase
        if (refundableTaxes.includes(code)) {
          filteredTaxes.push(amount.toFixed(2) + code);
          totalSum += amount;
        }
      }
    }
  }

  var result = filteredTaxes.join(" ") + " TOTAL: " + totalSum.toFixed(2);
  return result || "No valid taxes found.";
}

document.addEventListener("DOMContentLoaded", () => {
  function extractTaxes(fareString) {
    const taxPattern = /TAX\s(\d+\.\d+)(\w{2})/g;
    let match;
    const taxes = {};
    while ((match = taxPattern.exec(fareString)) !== null) {
      taxes[match[2]] = parseFloat(match[1]);
    }
    return taxes;
  }

  function preprocessFareString(fareString) {
    const taxRegex = /TAX\s+(\.\d+)/gi;
    return fareString.replace(taxRegex, "TAX 0$1");
  }

  function extractCurrency(fareString) {
    const currencyRegex = /(\b[A-Z]{3}\b)/g;
    const matches = fareString.match(currencyRegex);
    return matches ? matches : [];
  }

  function extractFareAmount(fareString, currency) {
    const fareAmountRegex = new RegExp("FARE " + currency + " (\\d+\\.\\d+)");
    const match = fareString.match(fareAmountRegex);
    if (match) return parseFloat(match[1]);

    const equAmountRegex = new RegExp("EQU " + currency + " (\\d+\\.\\d+)");
    const equMatch = fareString.match(equAmountRegex);
    return equMatch ? parseFloat(equMatch[1]) : 0;
  }

  function extractTotalFareAmount(fareString, currency) {
    if (!fareString) return 0;
    const cleanedFareString = fareString.replace(/\s+/g, " ");
    const totalFareAmountRegex = new RegExp(
      "TOT " + currency + " (\\d+\\.\\d+)"
    );
    const match = cleanedFareString.match(totalFareAmountRegex);
    return match ? parseFloat(match[1]) : 0;
  }

  function calculateFareDifference() {
    const airline = document
      .getElementById("airlineCode")
      .value.trim()
      .toUpperCase();
    const newFareString = preprocessFareString(
      document.getElementById("newFare").value
    );
    const oldFareString = preprocessFareString(
      document.getElementById("oldFare").value
    );

    const newCurrencies = extractCurrency(newFareString);
    const oldCurrencies = extractCurrency(oldFareString);

    const newTotalCurrency = newCurrencies[newCurrencies.length - 1];
    const oldTotalCurrency = oldCurrencies[oldCurrencies.length - 1];

    const newFareAmount = extractFareAmount(newFareString, newTotalCurrency);
    const oldFareAmount = extractFareAmount(oldFareString, oldTotalCurrency);

    const newTotalFareAmount = extractTotalFareAmount(
      newFareString,
      newTotalCurrency
    );
    const oldTotalFareAmount = extractTotalFareAmount(
      oldFareString,
      oldTotalCurrency
    );

    let fareDifference;
    let taxDifference;
    let totalFareDifference;
    let yqyrTax;
    let taxCalculationDetails = "";

    if (
      [
        "4O",
        "4Z",
        "9U",
        "A3",
        "AD",
        "AH",
        "AI",
        "AR",
        "BA",
        "AS",
        "AT",
        "BP",
        "BW",
        "CA",
        "CX",
        "CZ",
        "DE",
        "DY",
        "EI",
        "EY",
        "G3",
        "GA",
        "GF",
        "GP",
        "GQ",
        "HA",
        "HR",
        "HU",
        "HX",
        "IB",
        "J2",
        "JU",
        "KM",
        "KQ",
        "LO",
        "LQ",
        "LY",
        "MF",
        "MH",
        "MK",
        "MS",
        "MU",
        "NH",
        "NZ",
        "OK",
        "OU",
        "PC",
        "PG",
        "PR",
        "PS",
        "PW",
        "PX",
        "QR",
        "RO",
        "S4",
        "S7",
        "SA",
        "SN",
        "SS",
        "TG",
        "TN",
        "TS",
        "TU",
        "UA",
        "UK",
        "UL",
        "UP",
        "UX",
        "VA",
        "VN",
        "VS",
        "WY",
        "XL",
      ].includes(airline)
    ) {
      fareDifference = newFareAmount - oldFareAmount;

      const newTaxes = extractTaxes(newFareString);
      const oldTaxes = extractTaxes(oldFareString);
      taxDifference = 0;

      const uniqueTaxTypes = new Set([
        ...Object.keys(newTaxes),
        ...Object.keys(oldTaxes),
      ]);

      uniqueTaxTypes.forEach((taxType) => {
        const newTaxAmount = newTaxes[taxType] || 0;
        const oldTaxAmount = oldTaxes[taxType] || 0;
        const diff = newTaxAmount - oldTaxAmount;
        taxDifference += diff;
        taxCalculationDetails += `New TAX ${newTaxAmount.toFixed(
          2
        )}${taxType} - Old TAX ${oldTaxAmount.toFixed(2)}${taxType}<br>`;
      });

      if (fareDifference < 0 && taxDifference > 0) {
        totalFareDifference = taxDifference;
      } else if (taxDifference < 0 && fareDifference > 0) {
        totalFareDifference = fareDifference;
      } else {
        totalFareDifference = fareDifference + taxDifference;
      }

      yqyrTax = "";
    } else if (
      [
        "TK",
        "AA",
        "AM",
        "AV",
        "AY",
        "B6",
        "CM",
        "DL",
        "EK",
        "ET",
        "FI",
        "FJ",
        "JL",
        "KE",
        "LA",
        "ME",
        "OZ",
        "QF",
        "SK",
        "SQ",
        "SU",
        "SV",
        "WB",
        "WS",
      ].includes(airline)
    ) {
      fareDifference = newTotalFareAmount - oldTotalFareAmount;
      taxDifference = 0;

      totalFareDifference = fareDifference;
      yqyrTax = "";
      taxCalculationDetails = `<p>No tax breakdown due to calculation method Total - Total with ${newTotalCurrency}</p>`;
    } else if (
      [
        "AC",
        "AF",
        "AZ",
        "KL",
        "LH",
        "OS",
        "RJ",
        "TP",
        "BR",
        "CI",
        "PU",
      ].includes(airline)
    ) {
      fareDifference = newFareAmount - oldFareAmount;

      const newTaxes = extractTaxes(newFareString);
      const oldTaxes = extractTaxes(oldFareString);
      taxDifference = 0;

      const uniqueTaxTypes = new Set([
        ...Object.keys(newTaxes),
        ...Object.keys(oldTaxes),
      ]);

      uniqueTaxTypes.forEach((taxType) => {
        const newTaxAmount = newTaxes[taxType] || 0;
        const oldTaxAmount =
          taxType === "YQ" || taxType === "YR"
            ? oldTaxes[taxType] >= 50
              ? oldTaxes[taxType]
              : 0
            : oldTaxes[taxType] || 0;
        const diff = newTaxAmount - oldTaxAmount;
        taxDifference += diff;
        taxCalculationDetails += `New TAX ${newTaxAmount.toFixed(
          2
        )}${taxType} - Old TAX ${oldTaxAmount.toFixed(2)}${taxType}<br>`;
      });
<
      totalFareDifference = fareDifference + taxDifference;
      
      yqyrTax = "";
    } else if (["QR", "RJ", "SK", "SV", "TK", "VA", "WS"].includes(airline)) {
      const yqyrOld = oldFareString.match(/(\d+\.\d+)(YQ|YR)/g);
      const yqyrNew = newFareString.match(/(\d+\.\d+)(YQ|YR)/g);

      let yqyrOldSum = 0;
      let yqyrNewSum = 0;

      if (yqyrOld) {
        yqyrOld.forEach((tax) => {
          yqyrOldSum += parseFloat(tax.match(/(\d+\.\d+)/)[0]);
        });
      }

      if (yqyrNew) {
        yqyrNew.forEach((tax) => {
          yqyrNewSum += parseFloat(tax.match(/(\d+\.\d+)/)[0]);
        });
      }

      if (yqyrOldSum < 50 && yqyrNewSum < 50) {
        fareDifference = newFareAmount - oldFareAmount;
        taxDifference =
          newTotalFareAmount -
          newFareAmount -
          (oldTotalFareAmount - oldFareAmount);
        totalFareDifference = fareDifference + taxDifference;
        yqyrTax = "";
        taxCalculationDetails = "";
      } else {
        fareDifference = newFareAmount - oldFareAmount;
        taxDifference =
          newTotalFareAmount -
          newFareAmount -
          (oldTotalFareAmount - oldFareAmount);
        totalFareDifference = fareDifference + taxDifference - yqyrNewSum;
        yqyrTax = `YQ/YR Adjustment: -${yqyrNewSum.toFixed(2)}`;
        taxCalculationDetails = "";
      }
    } else {
      fareDifference = newFareAmount - oldFareAmount;
      taxDifference =
        newTotalFareAmount -
        newFareAmount -
        (oldTotalFareAmount - oldFareAmount);
      totalFareDifference = fareDifference + taxDifference;
      yqyrTax = "";
      taxCalculationDetails = `<p>No tax breakdown due to calculation method Total - Total with ${newTotalCurrency}</p>`;
    }

    let resultHTML = `
      <p>Fare Difference: ${fareDifference.toFixed(2)}</p>
      <p>Tax Difference: ${taxDifference.toFixed(2)}</p>
      <p>Total Fare Difference: ${totalFareDifference.toFixed(2)}</p>
      ${yqyrTax ? `<p>YQ/YR Tax Details: ${yqyrTax}</p>` : ""}
  `;

    const resultsDiv = document.getElementById("results");
    if (resultsDiv) {
      resultsDiv.innerHTML = resultHTML;
    } else {
      console.error('Element with ID "results" not found.');
    }

    const taxBreakdownDiv = document.getElementById("taxBreakdown");
    if (taxBreakdownDiv) {
      taxBreakdownDiv.innerHTML = taxCalculationDetails;
    } else {
      console.error('Element with ID "taxBreakdown" not found.');
    }
  }

  const calculateFareButton = document.getElementById("calculateFare");
  if (calculateFareButton) {
    calculateFareButton.addEventListener("click", function () {
      calculateFareDifference();
    });
  } else {
    console.error('Element with ID "calculateFare" not found.');
  }
});
