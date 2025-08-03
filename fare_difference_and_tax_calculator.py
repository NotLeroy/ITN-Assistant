import re
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# ——— Tax Refund Logic ———
REFUNDABLE_TAXES = [
"FR", "K5", "MC", "OT", "SL", "VR", "QX", "QT", "BX", "TE", "AE", "F6", "TP", "ZR", "GR", "WP", "WQ", "YD", "I3", "IB", "IP", "ZG", "RG", "SP", "CG", "HS", "NM", "RR", "RZ", "ZC", "IL", "F7", "JK", "O2", "TU", "DE", "RA", "TR", "DC", "RO", "AY", "XA", "YC", "TR", "M6", "OY", "XY", "CU", "AH", "FC", "FD", "PX", "Q5", "IH", "L3", "LB", "H4", "Q2", "GB", "UB", "SQ", "LI", "OI", "SW", "G3", "I5", "CO", "DG", "YS", "WT", "QQ", "Q5", "R1", "RD", "BE", "QH", "G5", "WO", "A1", "B1", "FS", "IK", "NW", "P5", "AT", "QD", "ZY", "UK", "D2", "QB", "QI", "PT", "YP", "HB", "IT", "MJ", "A6", "WE", "I1", "IZ", "O4", "MK", "VS", "XW", "HR", "MI", "P2", "YM", "RC", "IF", "IG", "SV", "GH", "IM", "JD", "OG", "QV", "BP", "PU", "WB", "KB", "GG", "QO", "S7", "TQ", "XR", "EX", "VT", "EF", "GN", "MA", "JS", "IN", "CH", "WD", "G4", "PZ", "QA", "R9", "UG", "UL", "S1", "DW", "SC", "O9", "Q7", "RH", "JI", "K2", "QJ", "RM", "XG", "XQ", "DY", "BC", "IE", "UP", "UQ", "JC", "YN", "EU", "C2", "AK"]

def filter_refundable_taxes(input_string):
    if not input_string or input_string.strip() == "":
        return "No valid taxes found."

    words = input_string.split()
    filtered = []
    total = 0.0

    for i, w in enumerate(words):
        if w.upper() == "TAX" and i + 1 < len(words):
            m = re.match(r"(\d+\.\d+|\.\d+)([A-Z0-9]+)", words[i+1])
            if m:
                amt = float(m.group(1)) if m.group(1) else 0.0
                code = m.group(2).upper()
                if code in REFUNDABLE_TAXES:
                    filtered.append(f"{amt:.2f}{code}")
                    total += amt

    if not filtered:
        return "No valid taxes found."
    return " ".join(filtered) + f" TOTAL: {total:.2f}"

# ——— Fare Difference Logic ———
#
def extract_taxes(fare_string):
    # Define patterns
    pattern_A = re.compile(r"TAX\s(\d+\.\d+)(\w{2})")         # Format A: TAX 10.00PQ
    pattern_B = re.compile(r"(\d+\.\d+)(\w{2})\sTAX")         # Format B: 10.00PQ TAX
    pattern_C = re.compile(r"TAX\s(\d+\.\d+)\s(\w{2})")       # Format C: TAX 10.00 PQ
    pattern_D = re.compile(r"(\d+\.\d+)\s(\w{2})\sTAX")       # Format D: 10.00 PQ TAX
    pattern_E = re.compile(r"([A-Z]{2})(\d+\.\d+)\sTAX")
    pattern_F = re.compile(r"TAX\s([A-Z]{2})\s(\d+\.\d+)")
    taxes = {}

    if "TAX " in fare_string and pattern_A.search(fare_string):
        # Use Format A
        matches = pattern_A.findall(fare_string)
        for amt, code in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format A (TAX 10.00PQ)"
    elif " TAX" in fare_string and pattern_B.search(fare_string):
        # Use Format B
        matches = pattern_B.findall(fare_string)
        for amt, code in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format B (10.00PQ TAX)"
    elif "TAX " in fare_string and pattern_C.search(fare_string):
        # Use Format C
        matches = pattern_C.findall(fare_string)
        for amt, code in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format C (TAX 10.00 PQ)"
    elif " TAX" in fare_string and pattern_D.search(fare_string):
        # Use Format D
        matches = pattern_D.findall(fare_string)
        for amt, code in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format D (10.00 PQ TAX)"
    elif "TAX " in fare_string and pattern_E.search(fare_string):
        # Use Format E
        matches = pattern_E.findall(fare_string)
        for code, amt in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format E (PQ10.00 TAX)"
    elif "TAX " in fare_string and pattern_F.search(fare_string):
        # Use Format F
        matches = pattern_F.findall(fare_string)
        for code, amt in matches:
            taxes[code] = taxes.get(code, 0) + float(amt)
        format_used = "Format F (TAX PQ10.00)"
    else:
        format_used = "No valid tax format found"
    
    return taxes, format_used


def preprocess_fare_string(s):
    # This looks like a fix for TAX .xx amounts, keeping as is
    return re.sub(r"TAX\s+(\.\d+)", r"TAX 0\1", s)

def extract_currency(s):
    m = re.search(r"FARE\s*([A-Z]{3})", s)
    return m.group(1) if m else ""

def extract_tot_currency(s):
    match = re.search(r"TOT\s+([A-Z]{3})\s?\d+\.\d+", s)
    return match.group(1) if match else ""

def extract_fare_amount(s, cur):
    pattern = rf"FARE\s*{cur}\s?(\d+\.\d+)"
    m = re.search(pattern, s)
    return float(m.group(1)) if m else 0.0

def extract_total_fare_amount(s, cur):
    pattern = rf"TOT\s*{cur}\s?(\d+\.\d+)"
    m = re.search(pattern, s)
    return float(m.group(1)) if m else 0.0



# Put your airline‐group sets here:
FULL_TOTAL_AIRLINES = { "TK", "AA", "AM", "AV", "AY", "B6", "CM", "DL", "EK", "ET", "FI", "FJ", "JL", "KE", "LA", "ME", "OZ", "QF", "SK", "SQ", "SU", "WB", "WS"}
SPECIAL_YQ_AIRLINES = {"AC", "AF", "AZ", "KL", "LH", "OS", "RJ", "TP", "BR", "CI", "PU", "SV"}
NORMAL_AIRLINES = {"4O","4Z", "9U", "A3", "AH", "AI", "AR", "BA", "AS", "AT", "BP", "BW", "CA", "CX", "CZ", "DE", "DY", "EI", "EY", "G3", "GA", "GF", "GP", "GQ", "HA", "HR", "HU", "HX", "IB", "J2", "JU", "KM", "KQ", "LO", "LQ", "LY", "MF", "MH", "MK", "MS", "MU", "NH", "NZ", "OK", "OU", "PC", "PG", "PR", "PS", "PW", "PX", "QR", "RO", "S4", "S7", "SA", "SN", "SS", "TG", "TN", "TS", "TU", "UA", "UK", "UL", "UP", "UX", "VA", "VN", "VS", "WY", "XL"}

def calculate_fare_difference(new_s, old_s, airline_code, ignore_currency_error=False):
    new_s = preprocess_fare_string(new_s)
    old_s = preprocess_fare_string(old_s)

    # Extract currencies from FARE or TOT lines with fallback
    cur_new = extract_currency(new_s) or extract_tot_currency(new_s)
    cur_old = extract_currency(old_s) or extract_tot_currency(old_s)

    if not cur_new or not cur_old:
        raise ValueError("Unable to extract currency from fare or total.")

    if cur_new != cur_old and not ignore_currency_error:
        raise ValueError(
            f"Currency mismatch in FARE line: \nThis carrier does fare-fare, tax-tax.\n\nNew fare uses '{cur_new}', old fare uses '{cur_old}'. \n\nYou should probably price it to match the currency in the original booking."
            )

    airline = airline_code.upper()
    tax_breakdown = ""

    if airline in FULL_TOTAL_AIRLINES:
    # Extract currencies from TOT lines
        tot_cur_new = extract_tot_currency(new_s)
        tot_cur_old = extract_tot_currency(old_s)

        if tot_cur_new != tot_cur_old and not ignore_currency_error:
            raise ValueError(
                f"Currency mismatch in TOT line: \n\n This carrier does total - total.\n Your currencies are different.\n\n New TOT uses '{tot_cur_new}', old TOT uses '{tot_cur_old}'. \n\nYou should probably price it to match the currency in the original booking"
            )
        new_tot = extract_total_fare_amount(new_s, tot_cur_new)
        old_tot = extract_total_fare_amount(old_s, tot_cur_old)

        # Use total fare amounts (already parsed using cur_new / cur_old)
        fare_diff = new_tot - old_tot
        tax_diff = 0.0


    else:
        # Use fare amounts and tax breakdown with currency from FARE line
        new_fare = extract_fare_amount(new_s, cur_new)
        old_fare = extract_fare_amount(old_s, cur_old)
        new_taxes, new_format = extract_taxes(new_s)
        old_taxes, old_format = extract_taxes(old_s)

        fare_diff = new_fare - old_fare
        tax_diff = 0.0

        for code in set(new_taxes) | set(old_taxes):
            n = new_taxes.get(code, 0.0)
            o = old_taxes.get(code, 0.0)
            if airline in SPECIAL_YQ_AIRLINES and code in {"YQ", "YR", "E3"}:
                o = o if o >= 50 else 0.0
            d = n - o
            tax_diff += d
            tax_breakdown += f"[New TAX {n:.2f}{code} - Old TAX {o:.2f}{code}]\n"

    # Total difference logic
    if fare_diff < 0 and tax_diff > 0:
        total_diff = tax_diff
    elif tax_diff < 0 and fare_diff > 0:
        total_diff = fare_diff
    else:
        total_diff = fare_diff + tax_diff

    return {
        "fare_difference": round(fare_diff, 2),
        "tax_difference": round(tax_diff, 2),
        "total_difference": round(total_diff, 2),
        "tax_breakdown": tax_breakdown.strip()
    }


# ——— Single Route for Both Tools ———
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()

            if "fare_string" in data:
                tax_result = filter_refundable_taxes(data["fare_string"])
                return jsonify({"type": "tax", "result": tax_result})

            elif "airline_code" in data:
                ignore_currency_error = data.get("ignore_currency_error", False)  # <--- NEW
                try:
                    fare_result = calculate_fare_difference(
                        data["new_ticket"],
                        data["old_ticket"],
                        data["airline_code"].upper(),
                        ignore_currency_error=ignore_currency_error  # <--- PASS IT HERE
                    )
                    return jsonify({"type": "fare", "result": fare_result})
                except ValueError as e:
                    return jsonify({"error": str(e)}), 400

            return jsonify({"error": "Invalid or missing JSON"}), 400


    # Render page for normal GET
    return render_template("index.html")
if __name__ == "__main__":
    app.run(debug=True)

def home():
    patch_notes = [
        {"WIP": "1.0.2", "date": "2025-??-??", "changes": [
        "SABRE SUPPORT.",
        ]},
        
        {"version": "1.0.1", "date": "2025-08-02", "changes": [
        "Using different currencies between new and old fares now displays a warning, which can be ignored.",
        ]},
        
        {"version": "1.0.0", "date": "2025-08-01", "changes": [
        "Added support for Gallileo format.",
        ]}
    ]
    return render_template("index.html", patch_notes=patch_notes)