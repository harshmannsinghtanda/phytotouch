import os
import json
from PIL import Image

def rgb_to_hsv(r, g, b):
    r_norm, g_norm, b_norm = r / 255.0, g / 255.0, b / 255.0
    cmax, cmin = max(r_norm, g_norm, b_norm), min(r_norm, g_norm, b_norm)
    delta = cmax - cmin
    h = 0
    s = 0.0 if cmax == 0 else delta / cmax
    v = cmax
    if delta != 0:
        if cmax == r_norm: h = ((g_norm - b_norm) / delta) % 6
        elif cmax == g_norm: h = (b_norm - r_norm) / delta + 2
        else: h = (r_norm - g_norm) / delta + 4
        h = round(h * 60)
        if h < 0: h += 360
    return h, s, v

def analyze_lemon_v3(img_path, canvas_w=480, canvas_h=360, mm_per_pixel=0.25):
    raw_img = Image.open(img_path).convert('RGB')
    canvas = Image.new('RGB', (canvas_w, canvas_h), (10, 12, 16))
    
    h_ratio = canvas_w / raw_img.width
    v_ratio = canvas_h / raw_img.height
    ratio = min(h_ratio, v_ratio) * 0.76
    
    new_w = int(raw_img.width * ratio)
    new_h = int(raw_img.height * ratio)
    resized_img = raw_img.resize((new_w, new_h), Image.Resampling.BILINEAR)
    
    offset_x = (canvas_w - new_w) // 2
    offset_y = (canvas_h - new_h) // 2
    canvas.paste(resized_img, (offset_x, offset_y))
    
    pixels = canvas.load()

    fruit_pixels = 0
    yellow_pixels = 0
    green_pixels = 0
    necrotic_pixels = 0
    fungal_pixels = 0

    min_x, max_x = canvas_w, 0
    min_y, max_y = canvas_h, 0

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Skip background (dark staging, neutral shadows, white borders)
            if v < 0.18 or (s < 0.14 and v < 0.92 and abs(r - g) < 26) or (v < 0.32 and s < 0.26 and abs(r - g) < 22) or (v > 0.96 and s < 0.08):
                continue

            # Scientific Citrus Spectrum
            # 1. Ripe Canary Yellow: H in [32, 62], S >= 0.18, V >= 0.22
            is_yellow = (h >= 32 and h <= 62 and s >= 0.18 and v >= 0.22)
            # 2. Orange / Golden Amber: H in [18, 31], S >= 0.25, V >= 0.25
            is_orange = (h >= 18 and h < 32 and s >= 0.25 and v >= 0.25)
            # 3. Chlorophyll Green: H in [63, 145], S >= 0.18, V >= 0.18
            is_green = (h > 62 and h <= 145 and s >= 0.16 and v >= 0.18)

            # 4. Necrotic Lesion (Anthracnose, Canker pustule, Black Spot):
            # True necrotic spots are sunken, dark brown/black with high contrast
            is_necrotic = (v < 0.28 and s >= 0.20 and (h < 26 or h > 320)) or \
                          (v < 0.34 and s >= 0.32 and h >= 8 and h <= 24)

            # 5. Fungal Mold (Penicillium digitatum green mold or white/olive mycelium):
            is_fungal = (h >= 135 and h <= 195 and s >= 0.18 and s <= 0.70 and v > 0.18 and v < 0.80) or \
                        (s < 0.18 and v > 0.78 and abs(r - g) < 15 and abs(g - b) < 15 and y > 30) # powdery white mycelium zone

            if is_yellow or is_green or is_orange or is_necrotic or is_fungal:
                fruit_pixels += 1
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

                if is_yellow or is_orange:
                    yellow_pixels += 1
                if is_green:
                    green_pixels += 1
                if is_necrotic:
                    necrotic_pixels += 1
                if is_fungal:
                    fungal_pixels += 1

    if fruit_pixels < 180:
        return {'detected': False, 'predictedGrade': 'UNKNOWN'}

    bbox_w = max(1, max_x - min_x)
    bbox_h = max(1, max_y - min_y)
    sphericity = round(min(bbox_w, bbox_h) / max(bbox_w, bbox_h), 2)
    avg_diameter_px = (bbox_w + bbox_h) / 2.0
    caliper_mm = round(avg_diameter_px * mm_per_pixel, 1)

    defect_pixels_total = necrotic_pixels + fungal_pixels
    defect_pct = round((defect_pixels_total / fruit_pixels) * 100.0, 1)
    ripeness_pct = round((yellow_pixels / fruit_pixels) * 100.0, 1)
    chlorophyll_pct = round((green_pixels / fruit_pixels) * 100.0, 1)

    necrotic_ratio = necrotic_pixels / fruit_pixels
    fungal_ratio = fungal_pixels / fruit_pixels

    # GRADING TIERS
    # 1. Pathological Reject / Biohazard:
    # Any active fungal mold or distinct necrotic cluster (>3.5%) or catastrophic defect (>20%)
    if fungal_ratio > 0.025 or necrotic_ratio > 0.035 or defect_pct > 20.0:
        predicted_grade = 'D'
        grade_name = 'Grade D (Pathological Reject / Biohazard)'

    # 2. Unripe Green Citrus:
    # Dominant green (>45%) and low yellow (<40%)
    elif chlorophyll_pct > 45.0 and ripeness_pct < 40.0:
        predicted_grade = 'UNRIPE'
        grade_name = 'Pre-Harvest / Unripe Green'

    # 3. Grade A Export:
    # High ripeness (>=65%), minimal blemish (<4.5%), good shape (sphericity >= 0.55), size 45-98mm
    elif defect_pct < 4.5 and ripeness_pct >= 65.0 and caliper_mm >= 44 and caliper_mm <= 98 and sphericity >= 0.55:
        predicted_grade = 'A'
        grade_name = 'Grade A (Export & Premium Retail)'

    # 4. Grade B Retail Table:
    # Domestic market quality, blemish <= 13.5%, sphericity >= 0.48
    elif defect_pct <= 13.5 and caliper_mm >= 38 and caliper_mm <= 102 and sphericity >= 0.48:
        predicted_grade = 'B'
        grade_name = 'Grade B (Domestic Supermarket / Table)'

    # 5. Grade C Processing / Juicing:
    # Coarse, scarred, sunburned, or off-spec shape/size
    else:
        predicted_grade = 'C'
        grade_name = 'Grade C (Industrial Juicing & Pectin)'

    return {
        'detected': True,
        'predictedGrade': predicted_grade,
        'gradeName': grade_name,
        'defectPercent': defect_pct,
        'ripenessPercent': ripeness_pct,
        'chlorophyllPercent': chlorophyll_pct,
        'sphericity': sphericity,
        'caliperMm': caliper_mm,
        'necroticPct': round(necrotic_ratio * 100, 1),
        'fungalPct': round(fungal_ratio * 100, 1)
    }

def main():
    manifest_path = os.path.join('public', 'samples', 'internet', 'dataset_manifest.json')
    with open(manifest_path, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    print(f"{'ID':<10} {'Name':<32} {'Expected':<10} {'Predicted':<10} {'Defect%':<8} {'Ripe%':<8} {'Green%':<8} {'Result'}")
    print("-" * 95)

    correct = 0
    total = len(dataset)

    for item in dataset:
        img_file = os.path.join('public', 'samples', 'internet', f"{item['id']}.jpg")
        diag = analyze_lemon_v3(img_file)
        
        pred = diag.get('predictedGrade', 'NONE')
        exp = item['expectedGrade']
        match = (pred == exp)
        if match:
            correct += 1

        res_str = "[MATCH]" if match else "[DIFF]"
        print(f"{item['id']:<10} {item['name'][:30]:<32} {exp:<10} {pred:<10} {diag.get('defectPercent', 0):<8} {diag.get('ripenessPercent', 0):<8} {diag.get('chlorophyllPercent', 0):<8} {res_str}")

    acc = (correct / total) * 100.0
    print("-" * 95)
    print(f"Total Evaluated: {total} | Correct Matches: {correct}/{total} | Accuracy: {acc:.1f}%")

if __name__ == '__main__':
    main()
