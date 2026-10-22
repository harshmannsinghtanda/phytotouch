import urllib.request
import json
import time
import os
import io
from PIL import Image

dataset = [
    # GRADE A: Clean, ripe, sound flavedo
    {
        'id': 'lemon_01',
        'name': 'Eureka Lemon (Fresh Table)',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Lemon.jpg',
        'desc': 'Single ripe yellow Eureka lemon on white background. Clean rind, high turgor.'
    },
    {
        'id': 'lemon_02',
        'name': 'Lisbon Ripe Lemon (European)',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Zitrone_--_2025_--_7294.jpg',
        'desc': 'Pristine European table lemon. Smooth oil glands, bright canary yellow.'
    },
    {
        'id': 'lemon_03',
        'name': 'Meyer Lemon Whole Ripe',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Meyer_Lemon.jpg',
        'desc': 'Golden ripe Meyer lemon with smooth, thin flavedo and fresh calyx.'
    },
    {
        'id': 'lemon_04',
        'name': 'Florence Orchard Lemon',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Lemon%2C_Lemon_tree%2C_Florence%2C_Italy.jpg',
        'desc': 'Flawless ripe Italian lemon harvested from Florence orchard.'
    },

    # GRADE B: Domestic supermarket / retail with minor surface marks (<14% blemish)
    {
        'id': 'lemon_05',
        'name': 'Retail Meyer Lemon',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/MeyerLemon.jpg',
        'desc': 'Supermarket table lemon showing minor stem friction and light handling wear.'
    },
    {
        'id': 'lemon_06',
        'name': 'Citrus Limon Branch Rub',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Citrus_-_Meyer-lemon_-_Tree.jpg',
        'desc': 'Tree-ripened citrus with localized foliage rub (<8% rind area).'
    },
    {
        'id': 'lemon_07',
        'name': 'Harvested Lemon with Calyx',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Lemon_-_whole_and_split.jpg',
        'desc': 'Ripe lemon with natural rind texture variations, fully sound pulp.'
    },
    {
        'id': 'lemon_08',
        'name': 'Orchard Lemon (Slight Mottle)',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Meyers_Zitrone_%28Citrus_%C3%97_meyeri%29_1.jpg',
        'desc': 'Domestic market grade. Sound fruit with superficial wind scuffing.'
    },

    # GRADE C: Industrial juicing & pectin (sunburn, scarred rind, coarse 14-24% blemish)
    {
        'id': 'lemon_09',
        'name': 'Citrus Jambhiri (Rough Lemon)',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Starr-061129-1731-Citrus_jambhiri-fruit_with_cockroaches_eating_peel-Makawao-Maui_%2824843232336%29.jpg',
        'desc': 'Rough-skinned Jambhiri lemon with irregular flavedo. Ideal for juice pressing.'
    },
    {
        'id': 'lemon_10',
        'name': 'Assam Kaji Nemu Scarred',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Assam_lemon_%28Kaji_nemu%29.jpg',
        'desc': 'Oblong Assam citrus with heavy surface scarring, high citric acid content.'
    },
    {
        'id': 'lemon_11',
        'name': 'Sunburned Orchard Lemon',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Lemon_in_tree.JPG',
        'desc': 'Exterior rind shows sunburn bronzing (>15% rind discoloration).'
    },
    {
        'id': 'lemon_12',
        'name': 'Rough Skinned Processing Citrus',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Rough_skinned_citrus.jpg',
        'desc': 'Thick irregular albedo with coarse pebbled surface. Sent to industrial pectin extraction.'
    },

    # GRADE D: Pathological decay, fungal mold, canker (>24% blemish or active spores)
    {
        'id': 'lemon_13',
        'name': 'Citrus Canker (Xanthomonas)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Citrus_Canker_%2820191206-APHIS-CHRP-0037%29.jpg',
        'desc': 'USDA APHIS specimen showing eruptive corky pustules with yellow halo.'
    },
    {
        'id': 'lemon_14',
        'name': 'Citrus Black Spot (Phyllosticta)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Citrus_Black_Spot_%2820100505-APHIS-CHRP-0036%29.jpg',
        'desc': 'Hard spot necrotic lesions with dark margins and pycnidia.'
    },
    {
        'id': 'lemon_15',
        'name': 'Penicillium Digitatum (Green Mold)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Penicillium_digitatum_105484297.jpg',
        'desc': 'Olive-green powdery mold spores spreading rapidly across softened flavedo.'
    },
    {
        'id': 'lemon_16',
        'name': 'Advanced Citrus Canker (USDA)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Citrus_Canker_%2849949888707%29.jpg',
        'desc': 'Severe crater-like lesions. Quarantined biohazard under export phytosanitary laws.'
    },

    # UNRIPE GREEN: Immature high-chlorophyll citrus (>45% green flavedo)
    {
        'id': 'lemon_17',
        'name': 'Unripe Green Lemon on Branch',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Unripe_lemon.jpg',
        'desc': 'Deep green flavedo with high chlorophyll retention. Requires ethylene degreening.'
    },
    {
        'id': 'lemon_18',
        'name': 'Green Lemon on Tree (Orchard)',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Green_Lemon_on_a_Lemon_Tree.JPG',
        'desc': 'Unripened green fruit before harvest maturity.'
    },
    {
        'id': 'lemon_19',
        'name': 'Immature Green Lime Citrus',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Lemon_and_lime.jpg',
        'desc': 'Green citrus showing high acid density and deep chlorophyll rind coloration.'
    },
    {
        'id': 'lemon_20',
        'name': 'Early Season Green Citrus',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Promise_in_Green_%28lemon%29.jpg',
        'desc': 'Early season green lemon fruit on orchard branch.'
    }
]

out_dir = os.path.join('public', 'samples', 'internet')
os.makedirs(out_dir, exist_ok=True)

success_items = []
for item in dataset:
    filename = f"{item['id']}.jpg"
    out_path = os.path.join(out_dir, filename)
    print(f"Downloading {item['id']}: {item['name']}...")
    try:
        req = urllib.request.Request(item['url'], headers={'User-Agent': 'CitrusSenseResearchDataset/1.0 (contact: nirman@lab.edu)'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            img = Image.open(io.BytesIO(data)).convert('RGB')
            img.thumbnail((640, 480))
            img.save(out_path, 'JPEG', quality=85)
            item['localPath'] = f"/samples/internet/{filename}"
            item['width'] = img.size[0]
            item['height'] = img.size[1]
            success_items.append(item)
            print(f"  [OK] Saved: {img.size[0]}x{img.size[1]} ({len(data)} bytes)")
    except Exception as e:
        print(f"  [FAIL] Failed for {item['id']}: {e}")
    time.sleep(1.0)

manifest_path = os.path.join(out_dir, 'dataset_manifest.json')
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(success_items, f, indent=2)

print(f"\nDone! Successfully saved {len(success_items)}/20 images to {out_dir}")
