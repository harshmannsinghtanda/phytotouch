import os
import json
import math
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

def evaluate_specimen(img_path, canvas_w=480, canvas_h=360, mm_per_pixel=0.25):
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

    # Step 1: Accumulate candidate citrus pixels & spatial coordinates
    yellow_pts = []
    green_pts = []
    necrotic_pts = []
    fungal_pts = []

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Skip background: dark staging, white background, neutral tabletops
            if (v < 0.18) or (s < 0.18 and v > 0.65) or (s < 0.20 and abs(r - g) < 25 and abs(g - b) < 25):
                continue

            # Canary yellow / amber citrus flavedo
            if (h >= 26 and h <= 62 and s >= 0.20 and v >= 0.25) or (h >= 16 and h < 26 and s >= 0.28 and v >= 0.28):
                yellow_pts.append((x, y))
            # Chlorophyll green citrus / foliage
            elif (h > 62 and h <= 145 and s >= 0.18 and v >= 0.18):
                green_pts.append((x, y))

            # Necrotic lesions: dark spots with red/brown hue
            if (v < 0.28 and s >= 0.22 and (h < 26 or h > 320)) or (v < 0.35 and s >= 0.35 and h >= 8 and h <= 25):
                necrotic_pts.append((x, y))
            # Fungal: powdery green-blue mold spores
            elif (h >= 140 and h <= 195 and s >= 0.20 and s <= 0.65 and v > 0.20 and v < 0.75):
                fungal_pts.append((x, y))

    num_yellow = len(yellow_pts)
    num_green = len(green_pts)
    num_necrotic = len(necrotic_pts)
    num_fungal = len(fungal_pts)

    # Step 2: Intelligent Foliage / Fruit Disambiguation
    # If yellow fruit is strongly present (>200 sampled points):
    # The fruit is yellow! Peripheral green foliage should not drag down ripeness.
    if num_yellow > 200:
        # Centroid of yellow fruit
        cx = sum(p[0] for p in yellow_pts) / num_yellow
        cy = sum(p[1] for p in yellow_pts) / num_yellow

        # Calculate bounding radius of the yellow fruit
        max_dist_sq = max((p[0] - cx)**2 + (p[1] - cy)**2 for p in yellow_pts)
        fruit_radius = math.sqrt(max_dist_sq) * 1.08

        # Only count green pixels that are inside the fruit radius (e.g. green tips or stem calyx)
        fruit_green_pts = [p for p in green_pts if math.sqrt((p[0] - cx)**2 + (p[1] - cy)**2) <= fruit_radius]
        fruit_pts = yellow_pts + fruit_green_pts
    else:
        # Green unripe citrus or heavy foliage
        fruit_pts = green_pts + yellow_pts

    total_fruit = len(fruit_pts)
    if total_fruit < 60:
        return {'detected': False, 'predictedGrade': 'UNKNOWN'}

    xs = [p[0] for p in fruit_pts]
    ys = [p[1] for p in fruit_pts]
    bbox_w = max(1, max(xs) - min(xs))
    bbox_h = max(1, max(ys) - min(ys))
    sphericity = round(min(bbox_w, bbox_h) / max(bbox_w, bbox_h), 2)
    avg_diameter_px = (bbox_w + bbox_h) / 2.0
    caliper_mm = round(avg_diameter_px * mm_per_pixel, 1)

    # Fruit flavedo composition
    ripeness_pct = round((num_yellow / total_fruit) * 100.0, 1) if num_yellow <= total_fruit else 100.0
    chlorophyll_pct = round(100.0 - ripeness_pct, 1)
    
    defect_pts = num_necrotic + num_fungal
    defect_pct = round((defect_pts / total_fruit) * 100.0, 1)

    necrotic_ratio = num_necrotic / total_fruit
    fungal_ratio = num_fungal / total_fruit

    # GRADING LOGIC (APEDA / Codex Alimentarius Standards)
    # 1. Grade D: Pathological decay (Canker, Black Spot, Anthracnose, Green Mold)
    if fungal_ratio > 0.025 or necrotic_ratio > 0.035 or defect_pct > 20.0:
        predicted_grade = 'D'
        grade_name = 'Grade D (Pathological Reject / Biohazard)'

    # 2. Unripe: Green citrus fruit (chlorophyll > 50% and yellow < 35%)
    elif chlorophyll_pct > 50.0 and ripeness_pct < 35.0:
        predicted_grade = 'UNRIPE'
        grade_name = 'Pre-Harvest / Unripe Green'

    # 3. Grade A: Export Quality (blemish < 4.5%, ripe >= 65%, good shape)
    elif defect_pct < 4.5 and ripeness_pct >= 65.0 and caliper_mm >= 42 and caliper_mm <= 98 and sphericity >= 0.54:
        predicted_grade = 'A'
        grade_name = 'Grade A (Export & Premium Retail)'

    # 4. Grade B: Domestic Table Quality (blemish <= 13.5%, sphericity >= 0.46)
    elif defect_pct <= 13.5 and caliper_mm >= 36 and caliper_mm <= 104 and sphericity >= 0.46:
        predicted_grade = 'B'
        grade_name = 'Grade B (Domestic Supermarket / Table)'

    # 5. Grade C: Processing / Juicing / Rough
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

    print(f"{'ID':<10} {'Name':<32} {'Expected':<10} {'Predicted':<10} {'Defect%':<8} {'Ripe%':<8} {'Green%':<8} {'Sph':<6} {'Result'}")
    print("-" * 105)

    correct = 0
    total = len(dataset)

    for item in dataset:
        img_file = os.path.join('public', 'samples', 'internet', f"{item['id']}.jpg")
        diag = evaluate_specimen(img_file)
        
        pred = diag.get('predictedGrade', 'NONE')
        exp = item['expectedGrade']
        match = (pred == exp)
        if match:
            correct += 1

        res_str = "[MATCH]" if match else "[DIFF]"
        print(f"{item['id']:<10} {item['name'][:30]:<32} {exp:<10} {pred:<10} {diag.get('defectPercent', 0):<8} {diag.get('ripenessPercent', 0):<8} {diag.get('chlorophyllPercent', 0):<8} {diag.get('sphericity', 0):<6} {res_str}")

    acc = (correct / total) * 100.0
    print("-" * 105)
    print(f"Total Evaluated: {total} | Correct Matches: {correct}/{total} | Accuracy: {acc:.1f}%")

if __name__ == '__main__':
    main()
