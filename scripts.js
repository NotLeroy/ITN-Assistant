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

// JavaScript code for Fare Difference Calculator
function calculateFareDifference() {
  var newFare = document.getElementById("newFare").value;
  var oldFare = document.getElementById("oldFare").value;
  var airlineCode = document.getElementById("airlineCode").value.toUpperCase();

  var result = calculateDifference(newFare, oldFare, airlineCode);
  document.getElementById("fareResult").innerText = result;
}

function calculateDifference(newFareString, oldFareString, airline) {
  var newFareString = preprocessFareString(newFareString);
  var oldFareString = preprocessFareString(oldFareString);

  var newCurrency = extractCurrency(newFareString);
  var oldCurrency = extractCurrency(oldFareString);

  var newFareAmount = extractFareAmount(newFareString, newCurrency);
  var oldFareAmount = extractFareAmount(oldFareString, oldCurrency);

  var newTotalFareAmount = extractTotalFareAmount(newFareString, newCurrency);
  var oldTotalFareAmount = extractTotalFareAmount(oldFareString, oldCurrency);

  var fareDifference;
  var taxDifference;
  var totalFareDifference;
  var yqyrTax;

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

    var newTaxes = extractTaxes(newFareString);
    var oldTaxes = extractTaxes(oldFareString);
    taxDifference = 0;

    var uniqueTaxTypes = new Set([
      ...Object.keys(newTaxes),
      ...Object.keys(oldTaxes),
    ]);
    var taxCalculationDetails = "";

    uniqueTaxTypes.forEach((taxType) => {
      var newTaxAmount = newTaxes[taxType] || 0;
      var oldTaxAmount = oldTaxes[taxType] || 0;
      var diff = newTaxAmount - oldTaxAmount;
      taxDifference += diff;
      taxCalculationDetails += `[New TAX ${newTaxAmount.toFixed(
        2
      )}${taxType} - Old TAX ${oldTaxAmount.toFixed(2)}${taxType}]\n`;
    });

    if (fareDifference < 0 && taxDifference > 0) {
      totalFareDifference = taxDifference;
    } else if (taxDifference < 0 && fareDifference > 0) {
      totalFareDifference = fareDifference;
    } else {
      totalFareDifference = fareDifference - taxDifference;
    }

    yqyrTax = extractYQYR(newFareString);

    return `Fare Difference: ${fareDifference.toFixed(
      2
    )}\nTaxes Difference:\n${taxCalculationDetails}TOTAL TAX DIFFERENCE: ${taxDifference.toFixed(
      2
    )}\nTOTAL FARE DIFFERENCE: ${totalFareDifference.toFixed(
      2
    )}\nYQYR TAX: ${yqyrTax.toFixed(2)}`;
  } else {
    return "No valid airline code found.";
  }
}

// Helper functions
function preprocessFareString(fareString) {
  return fareString.replace(/\s+/g, " ").trim().toUpperCase();
}

function extractCurrency(fareString) {
  return fareString.match(/(?:[A-Z]{3})/g)[0];
}

function extractFareAmount(fareString, currency) {
  return parseFloat(
    fareString
      .match(new RegExp(`(?:${currency}\\d+\\.\\d+)`, "i"))[0]
      .replace(currency, "")
  );
}

function extractTotalFareAmount(fareString, currency) {
  var totalAmount = fareString.match(new RegExp(`${currency}\\d+\\.\\d+`, "i"));
  return totalAmount ? parseFloat(totalAmount[0].replace(currency, "")) : 0;
}

function extractTaxes(fareString) {
  var taxes = {};
  var taxMatches = fareString.match(/(?:[A-Z]{2,3})(?:\d+\.\d+)?/g);

  if (taxMatches) {
    taxMatches.forEach((tax) => {
      var taxType = tax.match(/[A-Z]{2,3}/)[0];
      var taxAmount = parseFloat(tax.match(/\d+\.\d+/)) || 0;
      taxes[taxType] = (taxes[taxType] || 0) + taxAmount;
    });
  }
  return taxes;
}

function extractYQYR(fareString) {
  var yqyrMatch = fareString.match(/(?:YQ|YR)(?:\d+\.\d+)?/i);
  return yqyrMatch ? parseFloat(yqyrMatch[0].replace(/YQ|YR/, "")) : 0;
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if the user's name is already stored
  let userName = localStorage.getItem("userName");
  if (!userName) {
    userName = prompt("What's your name?");
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }

  // Establish a WebSocket connection to the server
  const socket = new WebSocket("wss://itn-assistant.onrender.com/");

  socket.addEventListener("open", function () {
    // Send the user's name to the server
    socket.send(JSON.stringify({ type: "newUser", name: userName }));
  });

  socket.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    if (data.type === "userCount") {
      // Update the user count display
      document.getElementById("user-count").textContent = data.count;
    }
  });

  // Log user actions (example)
  document.addEventListener("click", function () {
    socket.send(
      JSON.stringify({ type: "userAction", action: "click", name: userName })
    );
  });
});
