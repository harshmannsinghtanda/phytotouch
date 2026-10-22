import os
import json
import math
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

def analyze_lemon_image(img_path, canvas_w=480, canvas_h=360, mm_per_pixel=0.25):
    # Load original image
    raw_img = Image.open(img_path).convert('RGB')
    
    # Simulate canvas rendering: dark non-reflective staging background (#0a0c10)
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
    
    # Analyze pixels (2x downsample like in CitrusVisionEngine.js)
    fruit_pixels = 0
    yellow_pixels = 0
    green_pixels = 0
    necrotic_pixels = 0
    fungal_pixels = 0

    min_x, max_x = canvas_w, 0
    min_y, max_y = canvas_h, 0
    sum_x, sum_y = 0, 0

    pixels = canvas.load()

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Background filter
            is_fruit_bg = (v < 0.20) or \
                          (s < 0.16 and v < 0.90 and abs(r - g) < 28) or \
                          (v < 0.32 and s < 0.28 and abs(r - g) < 24) or \
                          (v > 0.96 and s < 0.08)
            if is_fruit_bg:
                continue

            # Citrus spectrum
            is_yellow = (h >= 28 and h <= 76 and s >= 0.16 and v >= 0.18)
            is_green = (h > 76 and h <= 152 and s >= 0.15 and v >= 0.18)
            is_orange = (h >= 16 and h < 28 and s >= 0.22 and v >= 0.22)

            is_necrotic = (v < 0.38 and s >= 0.28 and h >= 8 and h <= 36) or \
                          (v < 0.26 and s >= 0.25 and (h < 22 or h > 335))
            is_fungal = (h >= 142 and h <= 192 and s >= 0.22 and s <= 0.65 and v > 0.22 and v < 0.75)

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
        return {
            'detected': False,
            'fruitPixels': fruit_pixels,
            'predictedGrade': 'UNKNOWN'
        }

    bbox_w = max(1, max_x - min_x)
    bbox_h = max(1, max_y - min_y)
    sphericity = round(min(bbox_w, bbox_h) / max(bbox_w, bbox_h), 2)
    avg_diameter_px = (bbox_w + bbox_h) / 2.0
    caliper_mm = round(avg_diameter_px * mm_per_pixel, 1)

    defect_pixels_total = necrotic_pixels + fungal_pixels
    defect_pct = round((defect_pixels_total / fruit_pixels) * 100.0, 1)
    ripeness_pct = round((yellow_pixels / fruit_pixels) * 100.0, 1)
    chlorophyll_pct = round((green_pixels / fruit_pixels) * 100.0, 1)
    fungal_ratio = fungal_pixels / fruit_pixels

    # Grading rules exactly matching CitrusVisionEngine.js
    if chlorophyll_pct > 48 and defect_pct < 5.0:
        predicted_grade = 'UNRIPE'
        grade_name = 'Pre-Harvest / Unripe Green'
    elif fungal_pixels > fruit_pixels * 0.035 or defect_pct > 24.0:
        predicted_grade = 'D'
        grade_name = 'Grade D (Reject / Biohazard)'
    elif defect_pct < 5.0 and ripeness_pct >= 70 and caliper_mm >= 46 and caliper_mm <= 96 and sphericity >= 0.58:
        predicted_grade = 'A'
        grade_name = 'Grade A (Export & Premium Retail)'
    elif defect_pct <= 14.0 and caliper_mm >= 40 and caliper_mm <= 100 and sphericity >= 0.52:
        predicted_grade = 'B'
        grade_name = 'Grade B (Domestic Supermarket / Table)'
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
        'fungalRatio': round(fungal_ratio, 4),
        'fruitPixels': fruit_pixels
    }

def main():
    manifest_path = os.path.join('public', 'samples', 'internet', 'dataset_manifest.json')
    with open(manifest_path, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    print(f"{'ID':<10} {'Name':<32} {'Expected':<10} {'Predicted':<10} {'Defect%':<8} {'Ripe%':<8} {'Green%':<8} {'Cal(mm)':<8} {'Sph':<6} {'Result'}")
    print("-" * 115)

    correct = 0
    total = len(dataset)
    results = []

    for item in dataset:
        img_file = os.path.join('public', 'samples', 'internet', f"{item['id']}.jpg")
        diag = analyze_lemon_image(img_file)
        
        pred = diag.get('predictedGrade', 'NONE')
        exp = item['expectedGrade']
        match = (pred == exp)
        if match:
            correct += 1

        res_str = "[MATCH]" if match else "[DIFF]"
        print(f"{item['id']:<10} {item['name'][:30]:<32} {exp:<10} {pred:<10} {diag.get('defectPercent', 0):<8} {diag.get('ripenessPercent', 0):<8} {diag.get('chlorophyllPercent', 0):<8} {diag.get('caliperMm', 0):<8} {diag.get('sphericity', 0):<6} {res_str}")

        item_result = {
            **item,
            **diag,
            'isMatch': match
        }
        results.append(item_result)

    acc = (correct / total) * 100.0
    print("-" * 115)
    print(f"Total Evaluated: {total} | Correct Matches: {correct}/{total} | Overall Accuracy: {acc:.1f}%")

    out_eval = os.path.join('public', 'samples', 'internet', 'evaluation_report.json')
    with open(out_eval, 'w', encoding='utf-8') as f:
        json.dump({
            'total': total,
            'correct': correct,
            'accuracy': acc,
            'results': results
        }, f, indent=2)

if __name__ == '__main__':
    main()
