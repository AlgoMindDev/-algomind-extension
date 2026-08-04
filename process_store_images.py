import os
from PIL import Image, ImageOps, ImageFilter

brain_dir = r"C:\Users\Ambuj Rai\.gemini\antigravity-ide\brain\0e1cafe8-8a2f-411e-ab10-62a95198bd8f"
out_dir = r"c:\Users\Ambuj Rai\AlgoMind\extension\chrome_store_assets"

os.makedirs(out_dir, exist_ok=True)

images_info = [
    {
        "filename": "media__1785432747598.png",
        "out_name": "screenshot_1_dashboard.png",
        "title": "Learning Dashboard & Recall Analytics"
    },
    {
        "filename": "media__1785432747812.png",
        "out_name": "screenshot_2_ai_coach.png",
        "title": "AI Study Coach & Personalized Review"
    },
    {
        "filename": "media__1785432747879.png",
        "out_name": "screenshot_3_problem_analysis.png",
        "title": "Problem Retention Curve & Recall Metrics"
    },
    {
        "filename": "media__1785432747914.png",
        "out_name": "screenshot_4_revision_queue.png",
        "title": "Spaced Repetition Revision Queue"
    },
    {
        "filename": "media__1785432360695.png",
        "out_name": "screenshot_5_auto_capture_notification.png",
        "title": "Auto-Capture Coding Problem Solves"
    }
]

def make_chrome_screenshot(img_path, out_path, target_size=(1280, 800)):
    im = Image.open(img_path).convert("RGBA")
    
    # Trim right scrollbars or outer white borders if needed
    w, h = im.size
    
    # Create canvas 1280x800 with elegant dark theme background (#080b13) matching AlgoMind
    bg_color = (8, 11, 19, 255)
    canvas = Image.new("RGBA", target_size, bg_color)
    
    # Calculate aspect ratio fit
    target_w, target_h = target_size
    aspect_target = target_w / target_h
    aspect_im = w / h
    
    if abs(aspect_im - aspect_target) < 0.1:
        # Near exact ratio, resize cleanly
        resized = im.resize(target_size, Image.Resampling.LANCZOS)
        canvas.paste(resized, (0, 0))
    else:
        # Fit image centrally with smooth scaling
        ratio = min(target_w / w, target_h / h)
        new_w = int(w * ratio)
        new_h = int(h * ratio)
        resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        pos_x = (target_w - new_w) // 2
        pos_y = (target_h - new_h) // 2
        canvas.paste(resized, (pos_x, pos_y), resized)
        
    canvas.convert("RGB").save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path} ({target_size[0]}x{target_size[1]})")

# Process Screenshots (1280x800)
for info in images_info:
    src = os.path.join(brain_dir, info["filename"])
    dst = os.path.join(out_dir, info["out_name"])
    if os.path.exists(src):
        make_chrome_screenshot(src, dst)

# Create 128x128 Chrome Store Icon from existing icon or logo
popup_icon_path = r"c:\Users\Ambuj Rai\AlgoMind\extension\popup\icon.png"
if os.path.exists(popup_icon_path):
    icon_img = Image.open(popup_icon_path).convert("RGBA")
    icon_128 = icon_img.resize((128, 128), Image.Resampling.LANCZOS)
    icon_out = os.path.join(out_dir, "store_icon_128x128.png")
    icon_128.save(icon_out, "PNG")
    print(f"Saved: {icon_out} (128x128)")

# Create 440x280 Small Promo Tile
dashboard_src = os.path.join(brain_dir, "media__1785432747598.png")
if os.path.exists(dashboard_src):
    promo_dst = os.path.join(out_dir, "promo_tile_440x280.png")
    make_chrome_screenshot(dashboard_src, promo_dst, target_size=(440, 280))

print("All Chrome Web Store assets processed successfully!")
