document.getElementById("calculateButton").addEventListener("click", () => {
  calculateFareDifference();
  createConfetti();
  applyRGBGlow();
});

document.getElementById("refundButton").addEventListener("click", () => {
  const refundInput = document.getElementById("refundInput").value;
  const refundResult = FILTER_REFUNDABLE_TAXES(refundInput);
  document.getElementById("results").innerHTML = refundResult;
});

function calculateFareDifference() {
  // Existing fare difference calculation code here
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  confettiContainer.innerHTML = ""; // Clear previous confetti

  const colors = ["#ff0", "#f00", "#0f0", "#00f"];
  const numConfetti = 100;

  for (let i = 0; i < numConfetti; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.position = "absolute";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${Math.random() * 100}vh`;
    confetti.style.animation = `confetti-fall ${
      Math.random() * 2 + 2
    }s linear forwards`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = ""; // Clear confetti after animation
  }, 3000);
}

function applyRGBGlow() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.style.animation = "rgb-glow 3s infinite";
}

document.getElementById("calculateFare").addEventListener("click", function () {
  calculateFareDifference();
});

document.getElementById("calculateTax").addEventListener("click", function () {
  var taxInput = document.getElementById("taxInput").value.trim();
  if (taxInput) {
    var taxRefundResult = FILTER_REFUNDABLE_TAXES(taxInput);
    document.getElementById("taxRefundResult").innerText = taxRefundResult;
  } else {
    alert("Please enter the tax input.");
  }
});

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
  const totalFareAmountRegex = new RegExp("TOT " + currency + " (\\d+\\.\\d+)");
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
      taxCalculationDetails += `[New TAX ${newTaxAmount.toFixed(
        2
      )}${taxType} - Old TAX ${oldTaxAmount.toFixed(2)}${taxType}]<br>`;
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
    taxCalculationDetails =
      "<p>No tax breakdown due to calculation method Total - Total with " +
      newTotalCurrency +
      "</p>";
  } else if (
    ["AC", "AF", "AZ", "KL", "LH", "OS", "RJ", "TP", "BR", "CI", "PU"].includes(
      airline
    )
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
      taxCalculationDetails += `[New TAX ${newTaxAmount.toFixed(
        2
      )}${taxType} - Old TAX ${oldTaxAmount.toFixed(2)}${taxType}]<br>`;
    });

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
      yqyrTax = `[YQ/YR Adjustment: -${yqyrNewSum.toFixed(2)}]`;
      taxCalculationDetails = "";
    }
  } else {
    fareDifference = newFareAmount - oldFareAmount;
    taxDifference =
      newTotalFareAmount - newFareAmount - (oldTotalFareAmount - oldFareAmount);
    totalFareDifference = fareDifference + taxDifference;
    yqyrTax = "";
    taxCalculationDetails =
      "<p>No tax breakdown due to calculation method Total - Total with " +
      newTotalCurrency +
      "</p>";
  }

  let resultHTML = `
      <p>Fare Difference: ${fareDifference.toFixed(2)}</p>
      <p>Tax Difference: ${taxDifference.toFixed(2)}</p>
      <p>Total Fare Difference: ${totalFareDifference.toFixed(2)}</p>
      ${taxCalculationDetails}
      ${yqyrTax ? `<p>YQ/YR Tax Details: ${yqyrTax}</p>` : ""}
  `;

  document.getElementById("results").innerHTML = resultHTML;
}

// Dummy function for tax refund; replace with actual logic
function FILTER_REFUNDABLE_TAXES(taxInput) {
  // This function should handle the logic to calculate tax refunds based on input
  return "Tax refund calculation result for: " + taxInput;
}
