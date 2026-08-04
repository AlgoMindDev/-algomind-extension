import os
from PIL import Image

brain_dir = r"C:\Users\Ambuj Rai\.gemini\antigravity-ide\brain\0e1cafe8-8a2f-411e-ab10-62a95198bd8f"
out_dir = r"c:\Users\Ambuj Rai\AlgoMind\extension\chrome_store_assets"
os.makedirs(out_dir, exist_ok=True)

live_items = [
    ("dashboard_top_1785436504051.png", "screenshot_live_dashboard.png"),
    ("ai_review_main_1785436574231.png", "screenshot_live_ai_review.png"),
    ("revisions_main_1785436607042.png", "screenshot_live_revisions.png"),
]

for src_file, out_file in live_items:
    src_path = os.path.join(brain_dir, src_file)
    dst_path = os.path.join(out_dir, out_file)
    if os.path.exists(src_path):
        im = Image.open(src_path).convert("RGBA")
        target_size = (1280, 800)
        
        canvas = Image.new("RGBA", target_size, (8, 11, 19, 255))
        
        w, h = im.size
        ratio = min(1280 / w, 800 / h)
        new_w = int(w * ratio)
        new_h = int(h * ratio)
        resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        pos_x = (1280 - new_w) // 2
        pos_y = (800 - new_h) // 2
        canvas.paste(resized, (pos_x, pos_y), resized)
        
        canvas.convert("RGB").save(dst_path, "PNG", quality=95)
        print(f"Saved live screenshot: {dst_path} (1280x800)")

print("Live screenshots processed successfully!")
