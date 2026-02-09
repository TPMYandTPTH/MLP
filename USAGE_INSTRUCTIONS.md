# 🚀 AUTO-UPDATE SCRIPT FOR INDEX.HTML

## ✅ What This Does

Applies ALL 5 updates to your index.html file in ~1 second:

1. ✅ **Emoji watermarks** (12 cards, 10% → 25% hover)
2. ✅ **Google Maps links** (6 offices)  
3. ✅ **Johor card**: "Soon" + "Hiring now" + Apply button
4. ✅ **WFH card**: Interpreter job link
5. ✅ **LinkedIn buttons**: 5 recruiters (Kent excluded)

---

## 📋 How to Use

### Method 1: Simple (Recommended)

1. Download `apply_updates.py`
2. Put it in the same folder as your `index.html`
3. Run:
   ```bash
   python3 apply_updates.py
   ```
4. Done! Use the new `index_UPDATED.html` file

### Method 2: Specify Files

```bash
python3 apply_updates.py input.html output.html
```

---

## ⏱️ Runtime

- Processing time: ~1 second
- File size: ~2,900 lines (~145KB)

---

## ✅ What Gets Updated

### 1. Emoji Watermarks
- Adds wrapper `<div class="card-image-wrapper">` to each card
- Adds `data-emoji` attribute to card links
- Inserts CSS for watermark effect
- Emojis: 🏢💼💰✈️💬🇲🇾🇹🇭☕📋👀🎁📢❓

### 2. Google Maps Links
- G Tower → https://maps.app.goo.gl/vd5ju3VXhxfhpJuN7
- Livingston → https://maps.app.goo.gl/9i841vf18KRyunQK6
- One Precinct → https://maps.app.goo.gl/Nq6RKZ7spH89THG8A
- GBS@Mahsuri → https://maps.app.goo.gl/Zpy6r8na4Wg31uhT8
- KCP → https://maps.app.goo.gl/UE8tTboaukkeCWZW9
- Singha Complex → https://maps.app.goo.gl/vPuRsYp5fcNzX4kb6

### 3. Johor Card
```html
<li><strong>Soon</strong></li>
<li><strong>Hiring now</strong></li>
<a href="[job-link]" class="office-map-btn">💼 Apply Now</a>
```

### 4. WFH Card
```html
<a href="[interpreter-job]" class="office-map-btn">💼 Interpreter Job</a>
```

### 5. LinkedIn Buttons
- Anna Saw ✓
- Melaine Sua ✓
- Nuttaporn ✓
- Chloe Heo ✓
- Rasikarn ✓
- Kent excluded ✓

---

## 📁 Output

- Input: `index.html`  
- Output: `index_UPDATED.html`
- Backup: Keep your original file safe!

---

## 🔧 Requirements

- Python 3.6+
- No external libraries needed (uses only standard library)

---

## ❓ Troubleshooting

**Script not found:**
```bash
# Make sure you're in the right directory
ls -la apply_updates.py
```

**Permission denied:**
```bash
chmod +x apply_updates.py
python3 apply_updates.py
```

**File not found error:**
- Make sure `index.html` is in the same folder
- Or specify the path: `python3 apply_updates.py /path/to/index.html`

---

## 📞 Need Help?

If the script doesn't work, you can:
1. Check that `index.html` is in the same folder
2. Verify you have Python 3 installed: `python3 --version`
3. Run with verbose output to see what's happening

---

**Created:** 2026-02-09  
**Version:** 1.0  
**Updates:** All 5 features included
