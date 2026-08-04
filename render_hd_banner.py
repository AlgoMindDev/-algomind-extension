import os
import subprocess
from PIL import Image

# Directories
workspace = r"c:\Users\Ambuj Rai\AlgoMind"
assets_dir = os.path.join(workspace, "extension", "chrome_store_assets")
brain_dir = r"C:\Users\Ambuj Rai\.gemini\antigravity-ide\brain\d0497be1-181f-4149-947a-17a3f22799d6"
os.makedirs(assets_dir, exist_ok=True)

html_file = os.path.join(workspace, "hd_banner.html")

# Create HD HTML Banner template (2800 x 1120 px for 2x Retina rendering)
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AlgoMind HD Banner</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 2800px;
      height: 1120px;
      background: #08091a;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
      color: #f8fafc;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    /* Ambient Background Glows */
    .bg-glow-1 {
      position: absolute;
      top: -200px;
      left: -100px;
      width: 1000px;
      height: 1000px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(8, 9, 26, 0) 70%);
      pointer-events: none;
    }
    .bg-glow-2 {
      position: absolute;
      bottom: -300px;
      right: 200px;
      width: 1200px;
      height: 1200px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(8, 9, 26, 0) 70%);
      pointer-events: none;
    }

    /* Main Container */
    .banner-body {
      display: flex;
      padding: 70px 100px 40px 100px;
      gap: 60px;
      z-index: 2;
      align-items: center;
      height: calc(100% - 140px);
    }

    /* Left Info Column */
    .left-col {
      flex: 1.1;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .brand-logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    }
    .brand-logo svg {
      width: 38px;
      height: 38px;
      color: #ffffff;
    }
    .brand-name {
      font-size: 52px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #ffffff;
    }
    .brand-name span {
      background: linear-gradient(135deg, #a855f7, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .headline {
      font-size: 58px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -1.5px;
      color: #ffffff;
    }
    .sub-headline {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(90deg, #c084fc, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 6px;
    }

    .description {
      font-size: 24px;
      color: #94a3b8;
      line-height: 1.5;
      font-weight: 500;
      max-width: 880px;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 10px;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 18px 22px;
    }
    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #a5b4fc;
    }
    .feature-icon svg {
      width: 24px;
      height: 24px;
    }
    .feature-title {
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 16px;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* Right Preview Section */
    .right-col {
      flex: 1.4;
      display: flex;
      gap: 30px;
      align-items: center;
      position: relative;
    }

    /* Mock Chrome Popup Window */
    .popup-card {
      width: 600px;
      background: #0f172a;
      border-radius: 24px;
      border: 2px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      flex-shrink: 0;
    }
    .popup-header {
      background: rgba(255, 255, 255, 0.04);
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
    }
    .popup-title {
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
    }
    .popup-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .popup-status .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
    }

    .popup-content {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .problem-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
    }
    .prob-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .prob-name {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
    }
    .badge {
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 6px;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .note-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1.5px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      padding: 14px 18px;
      color: #cbd5e1;
      font-size: 16px;
      margin-top: 10px;
    }

    .honesty-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16, 185, 129, 0.08);
      border: 1.5px solid rgba(16, 185, 129, 0.2);
      border-radius: 14px;
      padding: 14px 20px;
    }
    .honesty-label {
      font-size: 16px;
      font-weight: 700;
      color: #6ee7b7;
    }
    .honesty-score {
      font-size: 24px;
      font-weight: 800;
      color: #10b981;
    }

    .popup-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      padding: 16px;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    }

    /* Dashboard Window Preview */
    .dashboard-card {
      flex: 1;
      background: #0b0f19;
      border-radius: 24px;
      border: 2px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      height: 650px;
      display: flex;
      flex-direction: column;
    }
    .dash-topbar {
      background: rgba(255, 255, 255, 0.04);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.08);
    }
    .win-dots {
      display: flex;
      gap: 8px;
    }
    .win-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .dash-content {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .greeting {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
    }
    .greeting span {
      color: #a855f7;
    }

    .dash-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 18px;
    }
    .metric-title {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 800;
      color: #f8fafc;
    }

    .queue-preview {
      background: rgba(255, 255, 255, 0.02);
      border: 1.5px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px;
      padding: 20px;
    }
    .queue-header {
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 16px;
    }
    .queue-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 10px;
    }
    .prob-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .prob-title {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .btn-revise {
      background: #6366f1;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    /* Bottom Bar */
    .banner-footer {
      height: 140px;
      background: rgba(15, 23, 42, 0.95);
      border-top: 2px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 100px;
      z-index: 2;
    }
    .platforms {
      display: flex;
      align-items: center;
      gap: 40px;
    }
    .platform-label {
      font-size: 22px;
      font-weight: 700;
      color: #94a3b8;
    }
    .platform-tag {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
    }

    .privacy-badge {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(99, 102, 241, 0.1);
      border: 1.5px solid rgba(99, 102, 241, 0.3);
      padding: 14px 28px;
      border-radius: 30px;
      font-size: 20px;
      font-weight: 700;
      color: #a5b4fc;
    }
  </style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>

  <div class="banner-body">
    <!-- Left Column: Branding & Features -->
    <div class="left-col">
      <div class="brand-row">
        <div class="brand-logo">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 00-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0012 2zm0 4a6 6 0 110 12 6 6 0 010-12z"/>
          </svg>
        </div>
        <h1 class="brand-name">Algo<span>Mind</span></h1>
      </div>

      <div>
        <h2 class="headline">AI-Powered<br>DSA Revision Companion</h2>
        <div class="sub-headline">Track. Revise. Remember.</div>
      </div>

      <p class="description">Your smart partner for consistent DSA preparation and better retention with automated active recall schedules.</p>

      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div class="feature-title">Automatic Tracking</div>
            <div class="feature-desc">Detect problem, difficulty & tags on LeetCode & GFG.</div>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <div class="feature-title">Smart Revision</div>
            <div class="feature-desc">Spaced repetition reminders at perfect recall intervals.</div>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <div>
            <div class="feature-title">Track Progress</div>
            <div class="feature-desc">View recall score, streaks, and weakness analytics.</div>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div>
            <div class="feature-title">Stay Honest</div>
            <div class="feature-desc">Honesty checker keeps your practice focused & genuine.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Mock Extension Popup & Dashboard -->
    <div class="right-col">
      <!-- Extension Popup Card -->
      <div class="popup-card">
        <div class="popup-header">
          <div class="popup-title">AlgoMind Companion</div>
          <div class="popup-status"><span class="dot"></span> Active Session</div>
        </div>

        <div class="popup-content">
          <div class="problem-box">
            <div class="prob-title-row">
              <div class="prob-name">Stone Game</div>
              <span class="badge">Medium</span>
            </div>
            <div style="font-size:14px; color:#94a3b8;">LeetCode &bull; Dynamic Programming</div>
            <input type="text" class="note-input" value="e.g. Explain your intuition or key trick..." readonly>
          </div>

          <div class="honesty-row">
            <div class="honesty-label">Honesty Score</div>
            <div class="honesty-score">100 / 100</div>
          </div>

          <button class="popup-btn">Open Full Dashboard &rarr;</button>
        </div>
      </div>

      <!-- Dashboard Window -->
      <div class="dashboard-card">
        <div class="dash-topbar">
          <div class="win-dots">
            <div class="win-dot dot-red"></div>
            <div class="win-dot dot-yellow"></div>
            <div class="win-dot dot-green"></div>
          </div>
          <div style="font-size:14px; color:#64748b; margin-left: 10px;">algomind.app/dashboard</div>
        </div>

        <div class="dash-content">
          <div class="greeting">Good evening, <span>Ambuj</span>.</div>

          <div class="dash-grid">
            <div class="metric-card">
              <div class="metric-title">Recall Score</div>
              <div class="metric-value">56 / 100</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Streak</div>
              <div class="metric-value">3 Days</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Progress</div>
              <div class="metric-value">1 / 5</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Coins</div>
              <div class="metric-value">1,840</div>
            </div>
          </div>

          <div class="queue-preview">
            <div class="queue-header">Revision Queue (25 Problems Due)</div>

            <div class="queue-item">
              <div class="prob-info">
                <span class="badge" style="background:rgba(99,102,241,0.15); color:#818cf8; border-color:rgba(99,102,241,0.3);">Medium</span>
                <div class="prob-title">Subsets</div>
              </div>
              <div class="btn-revise">Revise Now</div>
            </div>

            <div class="queue-item">
              <div class="prob-info">
                <span class="badge" style="background:rgba(245,158,11,0.15); color:#fbbf24; border-color:rgba(245,158,11,0.3);">Medium</span>
                <div class="prob-title">Letter Combinations</div>
              </div>
              <div class="btn-revise">Revise Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="banner-footer">
    <div class="platforms">
      <span class="platform-label">Works seamlessly with:</span>
      <div class="platform-tag">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffa116"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.17 6.019a1.375 1.375 0 0 0-.012 1.937L10.36 11.2a1.373 1.373 0 0 0 1.936.012l5.35-5.58a1.374 1.374 0 0 0-.012-1.936l-3.19-3.242A1.374 1.374 0 0 0 13.483 0zm-8.6 6.84a1.374 1.374 0 0 0-.96.438l-3.48 3.63a1.374 1.374 0 0 0 0 1.936l7.8 8.127a1.374 1.374 0 0 0 1.937 0l3.48-3.63a1.374 1.374 0 0 0 0-1.936l-7.8-8.127a1.374 1.374 0 0 0-.977-.438z"/></svg>
        LeetCode
      </div>
      <div class="platform-tag">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#2f8d46"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.1 16.5h-2.4l-2.7-4.2-2.7 4.2H6.9l3.9-6-3.6-5.5h2.4l2.4 3.7 2.4-3.7h2.4l-3.6 5.5 3.9 6z"/></svg>
        GeeksforGeeks
      </div>
    </div>

    <div class="privacy-badge">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      Your Data. Your Account. Always Private.
    </div>
  </div>
</body>
</html>
"""

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated HD HTML template at:", html_file)

# Run Headless Chrome to capture 2800x1120 supersampled HD screenshot
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_raw_png = os.path.join(workspace, "raw_hd_banner_2800x1120.png")

cmd = f'"{chrome_path}" --headless --disable-gpu --screenshot="{out_raw_png}" --window-size=2800,1120 "file:///{html_file}"'
print("Running Headless Chrome rendering...")
subprocess.run(cmd, shell=True, check=True)

if os.path.exists(out_raw_png):
    print("Raw HD capture created:", out_raw_png)
    im = Image.open(out_raw_png).convert("RGB")
    
    # 1. Downsample to Marquee Banner (1400x560) using high-quality LANCZOS filter
    marquee_out = os.path.join(assets_dir, "marquee_banner_1400x560.png")
    im_marquee = im.resize((1400, 560), Image.Resampling.LANCZOS)
    im_marquee.save(marquee_out, "PNG")
    print("Saved Ultra-HD Marquee Banner:", marquee_out, im_marquee.size, im_marquee.mode)
    
    # 2. Downsample to Small Promo Tile (440x280)
    promo_out = os.path.join(assets_dir, "promo_tile_440x280.png")
    im_promo = im.resize((440, 280), Image.Resampling.LANCZOS)
    im_promo.save(promo_out, "PNG")
    print("Saved Ultra-HD Promo Tile:", promo_out, im_promo.size, im_promo.mode)

print("HD rendering workflow completed successfully!")
