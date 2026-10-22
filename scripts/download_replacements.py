import urllib.request
import json
import os
import io
from PIL import Image

replacements = [
    {
        'id': 'lemon_10',
        'name': 'Kaji Nemu (Assam Processing Lemon)',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Kaji_neamu.JPG',
        'desc': 'Indigenous Assam oblong citrus with thick, pitted rind and intense citric acidity.'
    },
    {
        'id': 'lemon_11',
        'name': 'Rough Skinned Processing Citrus',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Rough_skinned_citrus.jpg',
        'desc': 'Coarse flavedo with irregular ridges, designated for pectin and industrial juice pressing.'
    },
    {
        'id': 'lemon_12',
        'name': 'Assam Gul Nemu (Citrus Jambhiri)',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/d/df/%27Gul_nemu%27_or_Assam_lemon_which_botanical_name_is_Citrus_Jambhiri..jpg',
        'desc': 'Rough-skinned wild citrus variety with thick albedo, used for industrial juice and rind oil.'
    }
]

out_dir = os.path.join('public', 'samples', 'internet')
for item in replacements:
    filename = f"{item['id']}.jpg"
    out_path = os.path.join(out_dir, filename)
    print(f"Downloading {item['id']}...")
    try:
        req = urllib.request.Request(item['url'], headers={'User-Agent': 'CitrusSenseResearch/1.0 (contact: admin@nirmanlab.org)'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            img = Image.open(io.BytesIO(data)).convert('RGB')
            img.thumbnail((640, 480))
            img.save(out_path, 'JPEG', quality=85)
            print(f"  [OK] Saved {filename}: {img.size}")
    except Exception as e:
        print(f"  [FAIL] {item['id']}: {e}")

print("Done replacements!")
