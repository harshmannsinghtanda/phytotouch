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

def robust_analyze(img_path, canvas_w=480, canvas_h=360, mm_per_pixel=0.25):
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

    # Pass 1: Discover Citrus Core Cluster
    # Detect candidate citrus pixels (vibrant yellow/orange or vibrant unripe lime green)
    yellow_pts = []
    green_pts = []

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Ignore non-citrus backdrops: dark shadows, studio white background, neutral gray/wood tables
            if (v < 0.18) or (s < 0.18 and v > 0.65) or (s < 0.22 and abs(r - g) < 25 and abs(g - b) < 25) or (v < 0.32 and s < 0.26 and abs(r - g) < 22):
                continue

            # Canary yellow or golden amber citrus flavedo
            if (h >= 24 and h <= 62 and s >= 0.18 and v >= 0.22) or (h >= 16 and h < 24 and s >= 0.25 and v >= 0.25):
                yellow_pts.append((x, y))
            # Chlorophyll green citrus / unripe lime
            elif (h > 62 and h <= 145 and s >= 0.18 and v >= 0.20):
                green_pts.append((x, y))

    num_yellow = len(yellow_pts)
    num_green = len(green_pts)

    if num_yellow + num_green < 80:
        return {'detected': False, 'predictedGrade': 'UNKNOWN'}

    # Determine whether primary fruit body is yellow (ripe) or green (unripe)
    is_yellow_fruit = (num_yellow >= 150) or (num_yellow > num_green * 0.45)

    if is_yellow_fruit:
        primary_pts = yellow_pts
    else:
        primary_pts = green_pts

    # Compute spatial center and bounding radius of the primary fruit body
    cx = sum(p[0] for p in primary_pts) / len(primary_pts)
    cy = sum(p[1] for p in primary_pts) / len(primary_pts)

    # Sort distances to reject distant outlier foliage
    dists = sorted(math.sqrt((p[0] - cx)**2 + (p[1] - cy)**2) for p in primary_pts)
    # 95th percentile distance defines the fruit boundary radius
    p95_idx = int(len(dists) * 0.95)
    fruit_radius = max(20.0, dists[p95_idx] * 1.08)

    # Pass 2: Analyze interior of fruit mask ONLY
    fruit_pixels = 0
    yellow_pixels = 0
    green_pixels = 0
    necrotic_pixels = 0
    fungal_pixels = 0
    scuff_pixels = 0

    min_x, max_x = canvas_w, 0
    min_y, max_y = canvas_h, 0

    for y in range(0, canvas_h, 2):
        for x in range(0, canvas_w, 2):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            if dist > fruit_radius:
                continue # Outside fruit mask!

            r, g, b = pixels[x, y]
            h, s, v = rgb_to_hsv(r, g, b)

            # Skip background inside bounding box if neutral/white
            if (v < 0.18) or (s < 0.16 and v > 0.70) or (s < 0.20 and abs(r - g) < 25 and abs(g - b) < 25):
                continue

            # Check citrus pixels
            is_y = (h >= 24 and h <= 62 and s >= 0.18 and v >= 0.22) or (h >= 16 and h < 24 and s >= 0.25 and v >= 0.25)
            is_g = (h > 62 and h <= 145 and s >= 0.18 and v >= 0.20)

            # Pathological Necrotic rot (sunken dark spots, canker craters, black spot pycnidia)
            is_nec = (v < 0.28 and s >= 0.20 and (h < 26 or h > 320)) or \
                     (v >= 0.20 and v < 0.36 and s >= 0.32 and h >= 8 and h <= 25)

            # Pathological Fungal Mold (Penicillium powdery green-blue spore clusters)
            is_mold = (h >= 135 and h <= 195 and s >= 0.18 and s <= 0.65 and v > 0.18 and v < 0.75)

            # Superficial branch scuff / peel wind scarring (intact, tan/brown peel)
            is_scuff = (v >= 0.36 and v <= 0.60 and s >= 0.22 and s <= 0.48 and h >= 22 and h <= 42)

            if is_y or is_g or is_nec or is_mold or is_scuff:
                fruit_pixels += 1
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

                if is_y: yellow_pixels += 1
                if is_g: green_pixels += 1
                if is_nec: necrotic_pixels += 1
                if is_mold: fungal_pixels += 1
                if is_scuff: scuff_pixels += 1

    if fruit_pixels < 50:
        return {'detected': False, 'predictedGrade': 'UNKNOWN'}

    bbox_w = max(1, max_x - min_x)
    bbox_h = max(1, max_y - min_y)
    sphericity = round(min(bbox_w, bbox_h) / max(bbox_w, bbox_h), 2)
    avg_diameter_px = (bbox_w + bbox_h) / 2.0
    caliper_mm = round(avg_diameter_px * mm_per_pixel, 1)

    ripeness_pct = round((yellow_pixels / fruit_pixels) * 100.0, 1)
    chlorophyll_pct = round((green_pixels / fruit_pixels) * 100.0, 1)

    pathology_pts = necrotic_pixels + fungal_pixels
    pathology_pct = round((pathology_pts / fruit_pixels) * 100.0, 1)

    total_defect_pts = pathology_pts + scuff_pixels
    total_defect_pct = round((total_defect_pts / fruit_pixels) * 100.0, 1)

    # COMMERCIAL APEDA / MANDI GRADING ENGINE:
    # 1. Grade D: Active fungal mold OR contagious canker/black spot necrotic lesions (>2.8%) OR catastrophic decay (>20%)
    if fungal_pixels > fruit_pixels * 0.025 or necrotic_pixels > fruit_pixels * 0.028 or total_defect_pct > 22.0:
        predicted_grade = 'D'
        grade_name = 'Grade D (Pathological Reject / Biohazard)'

    # 2. Unripe Green Citrus: Chlorophyll dominant (>50%) and not ripe yellow (<35%)
    elif chlorophyll_pct > 50.0 and ripeness_pct < 35.0:
        predicted_grade = 'UNRIPE'
        grade_name = 'Pre-Harvest / Unripe Green'

    # 3. Grade A Export Quality: Pristine (<4.5% total defect), ripe (>=65%), export size (40-98mm), sphericity >= 0.54
    elif total_defect_pct < 4.5 and ripeness_pct >= 65.0 and caliper_mm >= 40 and caliper_mm <= 98 and sphericity >= 0.54:
        predicted_grade = 'A'
        grade_name = 'Grade A (Export & Premium Retail)'

    # 4. Grade B Domestic Table Quality: Minor retail marks (<=13.5%), table size (>=36mm), sphericity >= 0.46
    elif total_defect_pct <= 13.5 and caliper_mm >= 36 and caliper_mm <= 104 and sphericity >= 0.46:
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
        'defectPercent': total_defect_pct,
        'ripenessPercent': ripeness_pct,
        'chlorophyllPercent': chlorophyll_pct,
        'sphericity': sphericity,
        'caliperMm': caliper_mm,
        'necroticPct': round((necrotic_pixels / fruit_pixels) * 100, 1),
        'fungalPct': round((fungal_pixels / fruit_pixels) * 100, 1),
        'fruitPixels': fruit_pixels
    }

def main():
    manifest_path = os.path.join('public', 'samples', 'internet', 'dataset_manifest.json')
    with open(manifest_path, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    print(f"{'ID':<10} {'Name':<32} {'Expected':<10} {'Predicted':<10} {'Defect%':<8} {'Ripe%':<8} {'Green%':<8} {'Sph':<6} {'Result'}")
    print("-" * 105)

    correct = 0
    total = len(dataset)
    results = []

    for item in dataset:
        img_file = os.path.join('public', 'samples', 'internet', f"{item['id']}.jpg")
        diag = robust_analyze(img_file)
        
        pred = diag.get('predictedGrade', 'NONE')
        exp = item['expectedGrade']
        match = (pred == exp)
        if match:
            correct += 1

        res_str = "[MATCH]" if match else "[DIFF]"
        print(f"{item['id']:<10} {item['name'][:30]:<32} {exp:<10} {pred:<10} {diag.get('defectPercent', 0):<8} {diag.get('ripenessPercent', 0):<8} {diag.get('chlorophyllPercent', 0):<8} {diag.get('sphericity', 0):<6} {res_str}")

        results.append({**item, **diag, 'isMatch': match})

    acc = (correct / total) * 100.0
    print("-" * 105)
    print(f"Total Evaluated: {total} | Correct Matches: {correct}/{total} | Accuracy: {acc:.1f}%")

if __name__ == '__main__':
    main()
