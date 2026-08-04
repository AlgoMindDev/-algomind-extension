import os
from PIL import Image, ImageDraw, ImageFilter

brain_dir = r"C:\Users\Ambuj Rai\.gemini\antigravity-ide\brain\0e1cafe8-8a2f-411e-ab10-62a95198bd8f"
out_dir = r"c:\Users\Ambuj Rai\AlgoMind\extension\chrome_store_assets"
os.makedirs(out_dir, exist_ok=True)

def create_framed_screenshot(src_path, dst_path, crop_top=0, crop_bottom=0, crop_left=0, crop_right=0, bg_dark=True):
    im = Image.open(src_path).convert("RGBA")
    w, h = im.size
    
    # Crop borders if specified
    left = crop_left
    top = crop_top
    right = w - crop_right
    bottom = h - crop_bottom
    cropped = im.crop((left, top, right, bottom))
    
    target_w, target_h = 1280, 800
    
    # Background Canvas
    if bg_dark:
        canvas = Image.new("RGBA", (target_w, target_h), (8, 11, 19, 255))
    else:
        canvas = Image.new("RGBA", (target_w, target_h), (245, 247, 250, 255))
        
    cw, ch = cropped.size
    
    # If cropped is full width dashboard
    if cw > 900:
        ratio = min(target_w / cw, target_h / ch)
        new_w = int(cw * ratio)
        new_h = int(ch * ratio)
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        pos_x = (target_w - new_w) // 2
        pos_y = (target_h - new_h) // 2
        canvas.paste(resized, (pos_x, pos_y), resized)
    else:
        # For popup / toast screenshots: center cleanly with drop shadow effect
        ratio = min((target_h - 100) / ch, (target_w - 200) / cw)
        new_w = int(cw * ratio)
        new_h = int(ch * ratio)
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        pos_x = (target_w - new_w) // 2
        pos_y = (target_h - new_h) // 2
        
        # Add subtle drop shadow behind popup
        shadow = Image.new("RGBA", (new_w + 40, new_h + 40), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rectangle([20, 20, new_w + 20, new_h + 20], fill=(0, 0, 0, 160))
        shadow = shadow.filter(ImageFilter.GaussianBlur(15))
        
        canvas.paste(shadow, (pos_x - 20, pos_y - 20), shadow)
        canvas.paste(resized, (pos_x, pos_y), resized)
        
    canvas.convert("RGB").save(dst_path, "PNG", quality=95)
    print(f"Processed & Saved: {dst_path}")

# 1. Dashboard Screenshot (Clean out "To exit full screen press Esc" overlay at top)
dashboard_img = os.path.join(brain_dir, "media__1785434337336.png")
if os.path.exists(dashboard_img):
    # Crop 60px off top to remove Windows Esc box cleanly
    create_framed_screenshot(
        dashboard_img, 
        os.path.join(out_dir, "screenshot_1_dashboard_clean.png"), 
        crop_top=65, 
        crop_right=15, 
        crop_bottom=30,
        bg_dark=True
    )

# 2. Extension Popup Dark Mode Screenshot
popup_dark = os.path.join(brain_dir, "media__1785434336879.png")
if os.path.exists(popup_dark):
    create_framed_screenshot(
        popup_dark, 
        os.path.join(out_dir, "screenshot_2_popup_dark.png"), 
        crop_right=20, 
        crop_bottom=40,
        bg_dark=True
    )

# 3. Extension Popup Light Mode Screenshot
popup_light = os.path.join(brain_dir, "media__1785434337017.png")
if os.path.exists(popup_light):
    create_framed_screenshot(
        popup_light, 
        os.path.join(out_dir, "screenshot_3_popup_light.png"),
        bg_dark=True
    )

# 4. Toast Notification Screenshot
toast_img = os.path.join(brain_dir, "media__1785434337076.png")
if os.path.exists(toast_img):
    create_framed_screenshot(
        toast_img, 
        os.path.join(out_dir, "screenshot_4_notification.png"),
        bg_dark=True
    )

# 5. Marquee Banner Tile (1400x560)
marquee_dst = os.path.join(out_dir, "marquee_banner_1400x560.png")
marquee = Image.new("RGBA", (1400, 560), (8, 11, 19, 255))
if os.path.exists(popup_dark):
    pop_im = Image.open(popup_dark).convert("RGBA")
    # Resize popup
    pratio = 480 / pop_im.height
    pw, ph = int(pop_im.width * pratio), 480
    pop_resized = pop_im.resize((pw, ph), Image.Resampling.LANCZOS)
    marquee.paste(pop_resized, (850, 40), pop_resized)
marquee.convert("RGB").save(marquee_dst, "PNG")
print(f"Processed & Saved Marquee: {marquee_dst}")

print("New Chrome Web Store images successfully generated!")
