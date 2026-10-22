import urllib.request
import json
import time
import os
import io
from PIL import Image

curated_20 = [
    # GRADE A: Clean, ripe, sound flavedo (APEDA Grade A Export)
    {
        'id': 'lemon_01',
        'name': 'Eureka Table Lemon',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'marketChannel': 'Export & Premium Retail',
        'shelfLife': '21 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Lemon.jpg',
        'desc': 'Single ripe yellow Eureka lemon on white background. Clean rind, high turgor.'
    },
    {
        'id': 'lemon_02',
        'name': 'Lisbon Table Lemon (Salzburg)',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'marketChannel': 'Export & Premium Retail',
        'shelfLife': '21 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Zitrone_--_2025_--_7294.jpg',
        'desc': 'Pristine European table lemon. Smooth oil glands, bright canary yellow.'
    },
    {
        'id': 'lemon_03',
        'name': 'Fresh Orchard Lemon with Leaf',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'marketChannel': 'Export & Premium Retail',
        'shelfLife': '21 Days',
        'url': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800',
        'desc': 'Bright yellow whole citrus with fresh green calyx leaf. Export grade.'
    },
    {
        'id': 'lemon_04',
        'name': 'Flawless Market Lemon',
        'category': 'Grade A',
        'expectedGrade': 'A',
        'marketChannel': 'Export & Premium Retail',
        'shelfLife': '18 Days',
        'url': 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=800',
        'desc': 'Single whole yellow lemon on clean background. Vibrant canary flavedo.'
    },

    # GRADE B: Domestic supermarket / retail with minor surface marks (<14% blemish)
    {
        'id': 'lemon_05',
        'name': 'Tabletop Retail Lemon',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'marketChannel': 'Domestic Supermarket / Table',
        'shelfLife': '12 Days',
        'url': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800',
        'desc': 'Supermarket table lemon on rustic cutting board. Minor handling friction.'
    },
    {
        'id': 'lemon_06',
        'name': 'Citrus Limon Branch Rub',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'marketChannel': 'Domestic Supermarket / Table',
        'shelfLife': '12 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Citrus_-_Meyer-lemon_-_Tree.jpg',
        'desc': 'Tree-ripened citrus with localized foliage rub (<8% rind area).'
    },
    {
        'id': 'lemon_07',
        'name': 'Harvested Lemon with Calyx',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'marketChannel': 'Domestic Supermarket / Table',
        'shelfLife': '12 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Lemon_-_whole_and_split.jpg',
        'desc': 'Ripe lemon with natural rind texture variations, fully sound pulp.'
    },
    {
        'id': 'lemon_08',
        'name': 'Orchard Lemon (Slight Mottle)',
        'category': 'Grade B',
        'expectedGrade': 'B',
        'marketChannel': 'Domestic Supermarket / Table',
        'shelfLife': '12 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Meyers_Zitrone_%28Citrus_%C3%97_meyeri%29_1.jpg',
        'desc': 'Domestic market grade. Sound fruit with superficial wind scuffing.'
    },

    # GRADE C: Industrial juicing & pectin (sunburn, scarred rind, coarse 14-24% blemish)
    {
        'id': 'lemon_09',
        'name': 'Citrus Jambhiri (Rough Lemon)',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'marketChannel': 'Industrial Juicing & Pectin',
        'shelfLife': '5 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Starr-061129-1731-Citrus_jambhiri-fruit_with_cockroaches_eating_peel-Makawao-Maui_%2824843232336%29.jpg',
        'desc': 'Rough-skinned Jambhiri lemon with irregular flavedo. Ideal for juice pressing.'
    },
    {
        'id': 'lemon_10',
        'name': 'Assam Kaji Nemu Processing',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'marketChannel': 'Industrial Juicing & Pectin',
        'shelfLife': '5 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Kaji_neamu.JPG',
        'desc': 'Indigenous Assam oblong citrus with thick, pitted rind and intense citric acidity.'
    },
    {
        'id': 'lemon_11',
        'name': 'Rough Skinned Processing Citrus',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'marketChannel': 'Industrial Juicing & Pectin',
        'shelfLife': '5 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Rough_skinned_citrus.jpg',
        'desc': 'Coarse flavedo with irregular ridges, designated for pectin and industrial juice pressing.'
    },
    {
        'id': 'lemon_12',
        'name': 'Scarred Organic Lemon',
        'category': 'Grade C',
        'expectedGrade': 'C',
        'marketChannel': 'Industrial Juicing & Pectin',
        'shelfLife': '5 Days',
        'url': 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=800',
        'desc': 'Organic citrus with thick bumpy rind and cosmetic thrips scarring.'
    },

    # GRADE D: Pathological decay, fungal mold, canker (>24% blemish or active spores)
    {
        'id': 'lemon_13',
        'name': 'Citrus Canker (Xanthomonas)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'marketChannel': 'Pathological Quarantine / Reject',
        'shelfLife': '0 Days (Compost)',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Citrus_canker_on_fruit.jpg',
        'desc': 'Severe raised corky canker lesions on citrus fruit with yellow halos.'
    },
    {
        'id': 'lemon_14',
        'name': 'Citrus Black Spot (Phyllosticta)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'marketChannel': 'Mandi Cull / Reject',
        'shelfLife': '0 Days (Compost)',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Citrus_Black_Spot_%2820100505-APHIS-CHRP-0036%29.jpg',
        'desc': 'Hard spot necrotic lesions with dark margins and pycnidia.'
    },
    {
        'id': 'lemon_15',
        'name': 'Active Fungal Mold on Lemon',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'marketChannel': 'Biohazard Quarantine / Reject',
        'shelfLife': '0 Days (Contagious)',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Fungal_mold_growing_on_the_surface_lemon.jpg',
        'desc': 'Aggressive green mold mycelium spreading rapidly across softened flavedo.'
    },
    {
        'id': 'lemon_16',
        'name': 'Advanced Citrus Canker (USDA)',
        'category': 'Grade D',
        'expectedGrade': 'D',
        'marketChannel': 'Pathological Quarantine / Reject',
        'shelfLife': '0 Days (Compost)',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Citrus_Canker_%2849949888707%29.jpg',
        'desc': 'Severe crater-like lesions. Quarantined biohazard under export phytosanitary laws.'
    },

    # UNRIPE GREEN: Immature high-chlorophyll citrus (>45% green flavedo)
    {
        'id': 'lemon_17',
        'name': 'Unripe Green Lemon on Branch',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'marketChannel': 'Ethylene Chamber Hold',
        'shelfLife': '30 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Unripe_lemon.jpg',
        'desc': 'Deep green flavedo with high chlorophyll retention. Requires ethylene degreening.'
    },
    {
        'id': 'lemon_18',
        'name': 'Green Lemon on Tree (Orchard)',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'marketChannel': 'Ethylene Chamber Hold',
        'shelfLife': '30 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Green_Lemon_on_a_Lemon_Tree.JPG',
        'desc': 'Unripened green fruit before harvest maturity.'
    },
    {
        'id': 'lemon_19',
        'name': 'Immature Green Citrus Lime',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'marketChannel': 'Green Mandi Wholesale',
        'shelfLife': '25 Days',
        'url': 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=800',
        'desc': 'Green citrus showing high acid density and deep chlorophyll rind coloration.'
    },
    {
        'id': 'lemon_20',
        'name': 'Early Season Green Citrus',
        'category': 'Unripe',
        'expectedGrade': 'UNRIPE',
        'marketChannel': 'Ethylene Chamber Hold',
        'shelfLife': '30 Days',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Promise_in_Green_%28lemon%29.jpg',
        'desc': 'Early season green lemon fruit on orchard branch.'
    }
]

out_dir = os.path.join('public', 'samples', 'internet')
os.makedirs(out_dir, exist_ok=True)

success_items = []
for item in curated_20:
    filename = f"{item['id']}.jpg"
    out_path = os.path.join(out_dir, filename)
    print(f"Downloading {item['id']}: {item['name']}...")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CitrusSense/2.0'}
        req = urllib.request.Request(item['url'], headers=headers)
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
    time.sleep(0.5)

manifest_path = os.path.join(out_dir, 'dataset_manifest.json')
with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(success_items, f, indent=2)

print(f"\nDone! Successfully updated all {len(success_items)}/20 images in {out_dir}")
