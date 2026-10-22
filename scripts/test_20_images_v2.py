import os
import json
from PIL import Image

def rgb_to_hsv(r, g, b):
    r_norm = r / 255.0
    g_norm = g / 255.0
    b_norm = b / 255.0

    cmax = max(r_norm, g_norm, b_norm)
    cmin = min(r_norm, g_norm, b_norm)
    delta = cmax - cmin

    h = 0
    s = 0.0 if cmax == 0 else delta / cmax
    v = cmax

    if delta != 0:
        if cmax == r_norm:
            h = ((g_norm - b_norm) / delta) % 6
        elif cmax == g_norm:
            h = (b_norm - r_norm) / delta + 2
        else:
            h = (r_norm - g_norm) / delta + 4
        h = round(h * 60)
        if h < 0:
            h += 360

    return h, s, v

def analyze_lemon_v2(img_path, canvas_w=480, canvas_h=360, mm_per_pixel=0.25):
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

    # Pass 1: Accumulate candidate citrus pixels and determine if dominant body is yellow
    raw_yellow_pixels = 0
    raw_green_pixels = 0
    raw_orange_pixels = 0

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Skip background (dark staging, neutral tabletop shadows, pure white borders)
            if v < 0.20 or (s < 0.16 and v < 0.90 and abs(r - g) < 28) or (v < 0.32 and s < 0.28 and abs(r - g) < 24) or (v > 0.96 and s < 0.08):
                continue

            if h >= 26 and h <= 76 and s >= 0.15 and v >= 0.22:
                raw_yellow_pixels += 1
            elif h > 76 and h <= 150 and s >= 0.18 and v >= 0.22:
                raw_green_pixels += 1
            elif h >= 16 and h < 26 and s >= 0.22 and v >= 0.22:
                raw_orange_pixels += 1

    # If yellow/orange is present in substantial amount (>150 px), the citrus fruit is yellow!
    # In that case, any dark/deep green pixels (V < 0.42 or high saturation tree leaves) outside the fruit center are foliage.
    has_dominant_yellow = (raw_yellow_pixels + raw_orange_pixels) > 250

    fruit_pixels = 0
    yellow_pixels = 0
    green_pixels = 0
    necrotic_pixels = 0
    fungal_pixels = 0

    min_x, max_x = canvas_w, 0
    min_y, max_y = canvas_h, 0
    sum_x, sum_y = 0, 0

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Skip non-citrus background
            if v < 0.20 or (s < 0.16 and v < 0.90 and abs(r - g) < 28) or (v < 0.32 and s < 0.28 and abs(r - g) < 24) or (v > 0.96 and s < 0.08):
                continue

            is_yellow = (h >= 26 and h <= 76 and s >= 0.15 and v >= 0.20)
            is_orange = (h >= 16 and h < 26 and s >= 0.22 and v >= 0.22)
            
            # If the fruit is yellow, filter out ambient dark orchard foliage (V < 0.40)
            if has_dominant_yellow:
                is_green = (h > 76 and h <= 135 and s >= 0.18 and v >= 0.42)
            else:
                is_green = (h > 76 and h <= 152 and s >= 0.15 and v >= 0.18)

            # Necrotic spots: dark brown/black lesions (Anthracnose, Canker pustules, Black Spot)
            is_necrotic = (v < 0.38 and s >= 0.26 and h >= 8 and h <= 36) or \
                          (v < 0.28 and s >= 0.22 and (h < 22 or h > 330))
            
            # Fungal mold: teal powdery mycelium
            is_fungal = (h >= 138 and h <= 192 and s >= 0.20 and s <= 0.70 and v > 0.20 and v < 0.78)

            if is_yellow or is_green or is_orange or is_necrotic or is_fungal:
                fruit_pixels += 1
                sum_x += x
                sum_y += y

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

    # SCIENTIFIC APEDA / AGMARK GRADING LOGIC:
    # 1. Unripe: Green citrus fruit (chlorophyll dominant AND yellow < 35%)
    if chlorophyll_pct > 40.0 and ripeness_pct < 35.0 and defect_pct < 6.0:
        predicted_grade = 'UNRIPE'
        grade_name = 'Pre-Harvest / Unripe Green'
    
    # 2. Grade D Reject: Active fungal mold OR pathological necrotic lesion cluster (>4.5% necrotic spots) OR severe decay (>22%)
    elif fungal_ratio > 0.025 or necrotic_ratio > 0.045 or defect_pct > 22.0:
        predicted_grade = 'D'
        grade_name = 'Grade D (Pathological Reject / Biohazard)'

    # 3. Grade A Export: Flawless flavedo (<4.5% blemish), ripe (>=65%), good size (45-98mm), good sphericity (>=0.56)
    elif defect_pct < 4.5 and ripeness_pct >= 65.0 and caliper_mm >= 44 and caliper_mm <= 98 and sphericity >= 0.56:
        predicted_grade = 'A'
        grade_name = 'Grade A (Export & Premium Retail)'

    # 4. Grade B Retail: Minor superficial marks (<=13.5%), table size (>=40mm), sphericity >=0.50
    elif defect_pct <= 13.5 and caliper_mm >= 38 and caliper_mm <= 102 and sphericity >= 0.50:
        predicted_grade = 'B'
        grade_name = 'Grade B (Domestic Supermarket / Table)'

    # 5. Grade C Processing: Coarse, scarred, sunburned, or off-spec geometry
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
        diag = analyze_lemon_v2(img_file)
        
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
