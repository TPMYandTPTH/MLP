#!/usr/bin/env python3
"""
AUTO-UPDATE SCRIPT FOR INDEX.HTML
Applies all 5 updates automatically
Runtime: ~1 second
"""

import re
import sys

def apply_all_updates(html_content):
    """Apply all 5 updates to the HTML"""
    
    print("🚀 Applying ALL 5 updates...")
    print()
    
    # =========================================================================
    # UPDATE 1: ADD EMOJI WATERMARKS TO CARDS
    # =========================================================================
    print("1️⃣  Adding emoji watermarks...")
    
    # Add CSS for emoji watermarks
    emoji_css = """
/* ========================================
   PRIORITY MENU (CARDS) - WITH EMOJI WATERMARKS
   ======================================== */
.priority-menu {
    padding: 60px 20px;
    background: var(--tp-off);
}

.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.card {
    background: var(--tp-white);
    border: 1px solid var(--tp-light);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
    position: relative;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gold-primary);
    transform: scaleX(0);
    transition: transform 0.3s;
    z-index: 2;
}

.card:hover::before,
.card:focus-within::before {
    transform: scaleX(1);
}

.card:hover,
.card:focus-within {
    transform: translateY(-3px);
    box-shadow: var(--shadow-gold);
    border-color: var(--gold-primary);
}

/* EMOJI WATERMARK */
.card-image-wrapper {
    position: relative;
    height: 140px;
    overflow: hidden;
}

.card-image-wrapper::before {
    content: attr(data-emoji);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 6rem;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
    transition: all 0.3s;
}

/* Individual emoji for each card */
.card[data-emoji="🏢"] .card-image-wrapper::before { content: '🏢'; }
.card[data-emoji="💼"] .card-image-wrapper::before { content: '💼'; }
.card[data-emoji="💰"] .card-image-wrapper::before { content: '💰'; }
.card[data-emoji="✈️"] .card-image-wrapper::before { content: '✈️'; }
.card[data-emoji="💬"] .card-image-wrapper::before { content: '💬'; }
.card[data-emoji="🇲🇾🇹🇭"] .card-image-wrapper::before { content: '🇲🇾🇹🇭'; font-size: 4.5rem; }
.card[data-emoji="☕"] .card-image-wrapper::before { content: '☕'; }
.card[data-emoji="📋"] .card-image-wrapper::before { content: '📋'; }
.card[data-emoji="👀"] .card-image-wrapper::before { content: '👀'; }
.card[data-emoji="🎁"] .card-image-wrapper::before { content: '🎁'; }
.card[data-emoji="📢"] .card-image-wrapper::before { content: '📢'; }
.card[data-emoji="❓"] .card-image-wrapper::before { content: '❓'; }

/* Hover effect - 25% opacity */
.card:hover .card-image-wrapper::before {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(1.05);
}

.card-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
    transition: all 0.3s;
}

.card:hover .card-image-wrapper img {
    transform: scale(1.05);
}

.card-content {
    padding: 1rem;
}

.card h3 {
    margin-bottom: 0.3rem;
    font-size: 0.95rem;
    font-weight: 700;
}

.card p {
    color: var(--tp-gray);
    font-size: 0.8rem;
    line-height: 1.5;
}
"""
    
    # Replace old cards CSS with new watermark CSS
    html_content = re.sub(
        r'/\* =+\s*PRIORITY MENU \(CARDS\)\s*=+ \*/.*?\.card p \{[^}]+\}',
        emoji_css,
        html_content,
        flags=re.DOTALL
    )
    
    # Update card HTML structure to include wrappers and data-emoji attributes
    card_mappings = [
        ('about-tp.html', '🏢', 'GBS.jpeg'),
        ('open-jobs.html', '💼', 'Reception.png'),
        ('salary-and-benefits.html', '💰', 'Reception%20(1).png'),
        ('relocation-visa.html', '✈️', 'Condo.jpg'),
        ('testimonials.html', '💬', 'KL%201.jpg'),
        ('why-malaysia-thailand.html', '🇲🇾🇹🇭', 'KL%202.jpg'),
        ('casual-interview.html', '☕', 'GTowerInside1.png'),
        ('hiring-process.html', '📋', 'Reception%20(2).png'),
        ('office-environment.html', '👀', 'G%20TOWER.jpg'),
        ('external-raf.html', '🎁', 'Reception.png'),
        ('blog.html', '📢', 'CafepicbyKoyoriinPenang.jpg'),
        ('faq.html', '❓', 'GTowerInside1.png')
    ]
    
    for href, emoji, img in card_mappings:
        # Find each card and wrap the img tag
        pattern = rf'(<a href="{re.escape(href)}" class="card")>(.*?<img src="photos/{re.escape(img)}"[^>]*>)'
        replacement = rf'\1 data-emoji="{emoji}"><div class="card-image-wrapper">\2</div>'
        html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    print("   ✅ Emoji watermarks added (10% → 25% hover)")
    
    # =========================================================================
    # UPDATE 2: ADD GOOGLE MAPS LINKS  
    # =========================================================================
    print("2️⃣  Adding Google Maps links...")
    
    # Add CSS for map button
    map_btn_css = """
.office-map-btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--gold-primary);
    color: var(--tp-black);
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s;
    text-decoration: none;
}

.office-map-btn:hover {
    background: var(--tp-black);
    color: var(--gold-primary);
}
"""
    
    # Insert map button CSS after office features styling
    html_content = re.sub(
        r'(\.office-features li:before \{[^}]+\})',
        r'\1\n\n' + map_btn_css,
        html_content
    )
    
    # Add map buttons to each office
    office_maps = [
        ('G Tower（吉隆坡）', 'https://maps.app.goo.gl/vd5ju3VXhxfhpJuN7'),
        ('Livingston（槟城）', 'https://maps.app.goo.gl/9i841vf18KRyunQK6'),
        ('One Precinct（槟城）', 'https://maps.app.goo.gl/Nq6RKZ7spH89THG8A'),
        ('GBS@Mahsuri（槟城）', 'https://maps.app.goo.gl/Zpy6r8na4Wg31uhT8'),
        ('KCP（格拉那再也中心点）', 'https://maps.app.goo.gl/UE8tTboaukkeCWZW9'),
        ('Singha Complex（曼谷）', 'https://maps.app.goo.gl/vPuRsYp5fcNzX4kb6')
    ]
    
    for office_name, map_url in office_maps:
        # Find the office card and add button before closing </div>
        pattern = rf'(<h3 class="office-name">{re.escape(office_name)}</h3>.*?</ul>)\s*(</div>)'
        replacement = rf'\1\n            <a href="{map_url}" target="_blank" rel="noopener noreferrer" class="office-map-btn">📍 Google Maps</a>\n          \2'
        html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    print("   ✅ Google Maps links added (6 offices)")
    
    # =========================================================================
    # UPDATE 3: UPDATE JOHOR CARD
    # =========================================================================
    print("3️⃣  Updating Johor card...")
    
    # Find Johor card and update content
    johor_pattern = r'(<div class="office-card">.*?<h3 class="office-name">Johor（柔佛）</h3>.*?<ul class="office-features">)(.*?)(</ul>.*?</div>.*?</div>)'
    
    johor_replacement = r'''\1
              <li><strong>Soon</strong></li>
              <li><strong>Hiring now</strong></li>
              <li>靠近新加坡</li>
            </ul>
            <a href="https://careerseng-teleperformance.icims.com/jobs/50874/customer-success-specialist---mandarin---johor/job" target="_blank" rel="noopener noreferrer" class="office-map-btn">💼 Apply Now</a>
          </div>
        \3'''
    
    html_content = re.sub(johor_pattern, johor_replacement, html_content, flags=re.DOTALL)
    
    print("   ✅ Johor: Soon + Hiring now + Apply link")
    
    # =========================================================================
    # UPDATE 4: UPDATE WFH CARD
    # =========================================================================
    print("4️⃣  Updating WFH card...")
    
    # Find WFH card and add interpreter job link
    wfh_pattern = r'(<h3 class="office-name"[^>]*>居家办公</h3>.*?</ul>)\s*(</div>)'
    wfh_replacement = r'''\1
            <a href="https://careerseng-teleperformance.icims.com//jobs//49561//interpreter---mandarin---work-from-home//job" target="_blank" rel="noopener noreferrer" class="office-map-btn">💼 Interpreter Job</a>
          \2'''
    
    html_content = re.sub(wfh_pattern, wfh_replacement, html_content, flags=re.DOTALL)
    
    print("   ✅ WFH: Interpreter job link added")
    
    # =========================================================================
    # UPDATE 5: ADD LINKEDIN BUTTONS
    # =========================================================================
    print("5️⃣  Adding LinkedIn buttons...")
    
    # Add LinkedIn button CSS
    linkedin_css = """
.ta-linkedin-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background: #0077b5;
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.3s;
    text-decoration: none;
    margin-top: 0.5rem;
}

.ta-linkedin-btn:hover {
    background: #005885;
    transform: scale(1.05);
}

.linkedin-icon {
    width: 14px;
    height: 14px;
}
"""
    
    # Insert LinkedIn CSS
    html_content = re.sub(
        r'(\.text-link \{[^}]+\})',
        r'\1\n\n' + linkedin_css,
        html_content
    )
    
    # LinkedIn SVG icon
    linkedin_icon = '''<svg class="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>'''
    
    # Add LinkedIn buttons to specific team members (excluding Kent)
    linkedin_profiles = [
        ('Anna Saw', 'Anna%20Saw%20Yee%20Lin'),
        ('Melaine Sua', 'Min%20Lee%20Melaine%20Sua'),
        ('Nuttaporn Buapradith', 'Tatar%20Nuttaporn%20Buapradith'),
        ('Chloe Heo', 'Chloe%20Yoon%20Jung%20Heo'),
        ('Rasikarn', 'Rasikarn%20Nupueng')
    ]
    
    for name, linkedin_name in linkedin_profiles:
        # Find the member card and add LinkedIn button
        pattern = rf'(<h3 class="ta-member-name">{re.escape(name)}</h3>.*?</div>)\s*(</article>)'
        linkedin_button = f'''
            <a href="https://www.linkedin.com/search/results/all/?keywords={linkedin_name}" target="_blank" rel="noopener noreferrer" class="ta-linkedin-btn">
              {linkedin_icon}
              LinkedIn
            </a>
          '''
        replacement = rf'\1{linkedin_button}\2'
        html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    print("   ✅ LinkedIn buttons added (5 recruiters)")
    print()
    print("=" * 60)
    print("✅ ALL 5 UPDATES APPLIED SUCCESSFULLY!")
    print("=" * 60)
    
    return html_content

# Main execution
if __name__ == "__main__":
    print("=" * 60)
    print("  AUTO-UPDATE SCRIPT - INDEX.HTML")
    print("=" * 60)
    print()
    
    # Read input file
    input_file = "index.html"
    output_file = "index_UPDATED.html"
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Apply all updates
        updated_html = apply_all_updates(html_content)
        
        # Write output
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(updated_html)
        
        print()
        print(f"📁 Output saved to: {output_file}")
        print()
        print("USAGE INSTRUCTIONS:")
        print("1. Download this script (apply_updates.py)")
        print("2. Place it in same folder as your index.html")  
        print("3. Run: python3 apply_updates.py")
        print("4. Use the generated index_UPDATED.html")
        print()
        
    except FileNotFoundError:
        print(f"❌ Error: {input_file} not found!")
        print()
        print("Please place this script in the same folder as your index.html")
        sys.exit(1)
