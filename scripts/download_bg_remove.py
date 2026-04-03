import urllib.request
import io
import os
from PIL import Image

urls = {
    'B09XS7JWHH': 'https://images-na.ssl-images-amazon.com/images/P/B09XS7JWHH.01.MAIN._SCLZZZZZZZ_.jpg',
    'B098FH5P3C': 'https://images-na.ssl-images-amazon.com/images/P/B098FH5P3C.01.MAIN._SCLZZZZZZZ_.jpg',
    'B08PZHYWJS': 'https://images-na.ssl-images-amazon.com/images/P/B08PZHYWJS.01.MAIN._SCLZZZZZZZ_.jpg',
    'B0C8PRPMXP': 'https://images-na.ssl-images-amazon.com/images/P/B0C8PRPMXP.01.MAIN._SCLZZZZZZZ_.jpg',
    'B0B8T985R9': 'https://images-na.ssl-images-amazon.com/images/P/B0B8T985R9.01.MAIN._SCLZZZZZZZ_.jpg',
    'B09ZWKD9TF': 'https://images-na.ssl-images-amazon.com/images/P/B09ZWKD9TF.01.MAIN._SCLZZZZZZZ_.jpg',
    'B00HVLUR86': 'https://images-na.ssl-images-amazon.com/images/P/B00HVLUR86.01.MAIN._SCLZZZZZZZ_.jpg',
    'B0BRP1F6B1': 'https://images-na.ssl-images-amazon.com/images/P/B0BRP1F6B1.01.MAIN._SCLZZZZZZZ_.jpg',
    'B0C3HVHMDM': 'https://images-na.ssl-images-amazon.com/images/P/B0C3HVHMDM.01.MAIN._SCLZZZZZZZ_.jpg',
    'B0B39RXXSF': 'https://images-na.ssl-images-amazon.com/images/P/B0B39RXXSF.01.MAIN._SCLZZZZZZZ_.jpg',
    'B095X7T381': 'https://images-na.ssl-images-amazon.com/images/P/B095X7T381.01.MAIN._SCLZZZZZZZ_.jpg',
    'B08761X7L2': 'https://images-na.ssl-images-amazon.com/images/P/B08761X7L2.01.MAIN._SCLZZZZZZZ_.jpg'
}

os.makedirs('public/images', exist_ok=True)

for asin, url in urls.items():
    print(f"Downloading and processing {asin}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        img_data = urllib.request.urlopen(req).read()
        img = Image.open(io.BytesIO(img_data)).convert('RGBA')
        
        # Soft alpha masking for white backgrounds
        new_data = [] # we will use list comprehension or direct mapping for speed
        data = getattr(img, "getdata", lambda: [])() # handle PIL properly
        data = list(img.getdata())
        for r, g, b, a in data:
            if r > 240 and g > 240 and b > 240:
                # White pixel: make fully transparent
                new_data.append((r, g, b, 0))
            elif r > 210 and g > 210 and b > 210:
                # Edge pixel: calculate a gradient alpha
                avg = (r + g + b) / 3
                alpha = max(0, min(255, int(255 - (avg - 210) * (255 / 30))))
                new_data.append((r, g, b, alpha))
            else:
                new_data.append((r, g, b, a))
                
        img.putdata(new_data)
        img.save(f'public/images/{asin}.png', 'PNG')
        print(f"Saved {asin}.png!")
    except Exception as e:
        print(f"Failed {asin}: {e}")

print("All done!")
