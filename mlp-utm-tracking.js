// ===== MLP UTM TRACKING SYSTEM =====
// Captures utm_source & utm_medium from incoming URL
// Appends iis & iisn to ALL iCIMS apply links on the page
// Same mapping as LP (landing page) system
//
// USAGE EXAMPLE:
// User arrives at: index.html?utm_source=WeChat&utm_medium=social&utm_campaign=MLP
// All apply links become: ...icims.com/jobs/search?...&iis=Social+Media&iisn=WeChat
//
// Add this script to every MLP page (before closing </body>)

(function() {
    'use strict';

    // =========================================================================
    // 1. READ UTM PARAMS FROM CURRENT PAGE URL
    // =========================================================================
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            source:   params.get('utm_source')   || '',
            medium:   params.get('utm_medium')    || '',
            campaign: params.get('utm_campaign')  || '',
            content:  params.get('utm_content')   || '',
            term:     params.get('utm_term')      || ''
        };
    }

    // =========================================================================
    // 2. MAP utm_medium → iCIMS iis VALUE (case-insensitive)
    //    Same mapping as LP system
    // =========================================================================
    function mapMediumToIIS(medium) {
        switch (medium.toLowerCase()) {
            case 'social':      return 'Social Media';
            case 'career':      return 'Career Fair';
            case 'digital':     return 'Digital Ad';
            case 'mobile':      return 'Mobile Stand';
            case 'university':  return 'University';
            case 'poster':      return 'Poster';
            case 'flyers':      return 'Flyers';
            case 'physical':    return 'Physical QR';
            case 'fotg':        return 'FoTG';
            case 'banner1':     return 'Banner 1';
            case 'banner2':     return 'Banner 2';
            case 'email':       return 'Email Blast';
            case 'public':      return 'Public Stands';
            case 'grab':        return 'Grab';
            case 'linkedin':    return 'LinkedIn Recruiter';
            case 'broadcast':   return 'Broadcast Comms';
            case 'wechat':      return 'WeChat';
            case 'line':        return 'LINE';
            case 'xiaohongshu': return 'Xiaohongshu';
            case 'xhs':         return 'Xiaohongshu';
            case 'website':     return 'MLP Website';
            case 'referral':    return 'Referral';
            case 'qr':          return 'QR Code';
            default:
                // If medium is provided but not in the map, use it as-is
                if (medium) {
                    console.warn('[MLP UTM] Unknown utm_medium: "' + medium + '" — using as-is');
                    return medium;
                }
                return '';
        }
    }

    // =========================================================================
    // 3. BUILD TRACKING PARAMS FOR iCIMS URL
    // =========================================================================
    function buildTrackingParams(utm) {
        if (!utm.source && !utm.medium) return null; // No UTM = no tracking

        const iis  = mapMediumToIIS(utm.medium);
        const iisn = utm.source;

        if (!iis && !iisn) return null;

        return { iis: iis, iisn: iisn };
    }

    // =========================================================================
    // 4. APPEND iis/iisn TO AN iCIMS URL
    // =========================================================================
    function appendTrackingToURL(href, tracking) {
        try {
            const url = new URL(href);

            if (tracking.iis) {
                url.searchParams.set('iis', tracking.iis);
            }
            if (tracking.iisn) {
                url.searchParams.set('iisn', tracking.iisn);
            }

            return url.toString();
        } catch (e) {
            // If URL parsing fails, fallback to string append
            const separator = href.includes('?') ? '&' : '?';
            let params = [];
            if (tracking.iis)  params.push('iis='  + encodeURIComponent(tracking.iis));
            if (tracking.iisn) params.push('iisn=' + encodeURIComponent(tracking.iisn));
            return href + separator + params.join('&');
        }
    }

    // =========================================================================
    // 5. FIND & UPDATE ALL iCIMS LINKS ON THE PAGE
    //    Targets: <a href="...icims.com...">
    // =========================================================================
    function updateAllApplyLinks(tracking) {
        const icimsDomain = 'careerseng-teleperformance.icims.com';
        const links = document.querySelectorAll('a[href*="' + icimsDomain + '"]');
        let count = 0;

        links.forEach(function(link) {
            const originalHref = link.getAttribute('href');

            // Skip if already has iis/iisn
            if (originalHref.includes('iis=') && originalHref.includes('iisn=')) {
                return;
            }

            const newHref = appendTrackingToURL(originalHref, tracking);
            link.setAttribute('href', newHref);
            count++;
        });

        if (count > 0) {
            console.log('[MLP UTM] Updated ' + count + ' apply link(s) with iis="' + tracking.iis + '" iisn="' + tracking.iisn + '"');
        }
    }

    // =========================================================================
    // 6. ALSO UPDATE FLOATING APPLY BUTTON (it may be added dynamically)
    // =========================================================================
    function observeAndUpdate(tracking) {
        // Update existing links immediately
        updateAllApplyLinks(tracking);

        // Also observe DOM for any dynamically added links
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(function() {
                updateAllApplyLinks(tracking);
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // Auto-disconnect after 10 seconds (page should be fully loaded by then)
            setTimeout(function() { observer.disconnect(); }, 10000);
        }
    }

    // =========================================================================
    // 7. STORE UTM IN SESSION SO IT PERSISTS ACROSS MLP PAGE NAVIGATIONS
    //    (User lands on index.html with UTM → clicks to open-jobs.html → 
    //     UTM should still be applied on the apply links there)
    // =========================================================================
    function persistUTM(utm) {
        try {
            if (utm.source)   sessionStorage.setItem('mlp_utm_source',   utm.source);
            if (utm.medium)   sessionStorage.setItem('mlp_utm_medium',   utm.medium);
            if (utm.campaign) sessionStorage.setItem('mlp_utm_campaign', utm.campaign);
            if (utm.content)  sessionStorage.setItem('mlp_utm_content',  utm.content);
            if (utm.term)     sessionStorage.setItem('mlp_utm_term',     utm.term);
        } catch (e) {
            // sessionStorage not available (private mode etc.) — fail silently
        }
    }

    function recoverUTM() {
        try {
            return {
                source:   sessionStorage.getItem('mlp_utm_source')   || '',
                medium:   sessionStorage.getItem('mlp_utm_medium')   || '',
                campaign: sessionStorage.getItem('mlp_utm_campaign') || '',
                content:  sessionStorage.getItem('mlp_utm_content')  || '',
                term:     sessionStorage.getItem('mlp_utm_term')     || ''
            };
        } catch (e) {
            return { source: '', medium: '', campaign: '', content: '', term: '' };
        }
    }

    // =========================================================================
    // 8. ALSO FORWARD UTM PARAMS ON INTERNAL MLP NAVIGATION
    //    When user clicks from index.html → open-jobs.html, 
    //    append UTM to the internal link so it carries over
    // =========================================================================
    function addUTMToInternalLinks(utm) {
        if (!utm.source && !utm.medium) return;

        const currentHost = window.location.host;
        const internalLinks = document.querySelectorAll('a[href]');

        internalLinks.forEach(function(link) {
            const href = link.getAttribute('href');

            // Skip external links, anchors, mailto, tel, javascript
            if (!href) return;
            if (href.startsWith('#')) return;
            if (href.startsWith('mailto:')) return;
            if (href.startsWith('tel:')) return;
            if (href.startsWith('javascript:')) return;
            if (href.includes('icims.com')) return;  // Already handled separately
            if (href.includes('line.me')) return;     // External
            if (href.includes('forms.office.com')) return; // External
            if (href.includes('youtube.com')) return;  // External
            if (href.includes('vtour.cloud')) return;  // External
            if (href.includes('linkedin.com')) return;  // External
            if (href.includes('hallo.ai')) return;     // External
            if (href.includes('outlook.office.com')) return; // External

            // Check if it's an internal MLP link (relative or same host)
            let isInternal = false;
            if (href.startsWith('/') || href.endsWith('.html') || href.includes('.html#')) {
                isInternal = true;
            }
            try {
                const url = new URL(href, window.location.origin);
                if (url.host === currentHost) isInternal = true;
            } catch (e) {}

            if (!isInternal) return;

            // Already has UTM? Skip
            if (href.includes('utm_source=')) return;

            // Append UTM params
            try {
                const url = new URL(href, window.location.origin);
                if (utm.source)   url.searchParams.set('utm_source',   utm.source);
                if (utm.medium)   url.searchParams.set('utm_medium',   utm.medium);
                if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign);
                if (utm.content)  url.searchParams.set('utm_content',  utm.content);
                if (utm.term)     url.searchParams.set('utm_term',     utm.term);

                // Keep it as relative if it was relative
                if (!href.startsWith('http')) {
                    const relative = url.pathname.split('/').pop() + url.search + url.hash;
                    link.setAttribute('href', relative);
                } else {
                    link.setAttribute('href', url.toString());
                }
            } catch (e) {
                // Fallback: string append
                const sep = href.includes('?') ? '&' : '?';
                let params = [];
                if (utm.source)   params.push('utm_source='   + encodeURIComponent(utm.source));
                if (utm.medium)   params.push('utm_medium='   + encodeURIComponent(utm.medium));
                if (utm.campaign) params.push('utm_campaign=' + encodeURIComponent(utm.campaign));
                link.setAttribute('href', href + sep + params.join('&'));
            }
        });
    }

    // =========================================================================
    // 9. GA4 EVENT: Track that user arrived with UTM
    // =========================================================================
    function trackUTMArrival(utm) {
        if (typeof gtag === 'function' && (utm.source || utm.medium)) {
            gtag('event', 'utm_arrival', {
                event_category: 'MLP_Tracking',
                utm_source:   utm.source,
                utm_medium:   utm.medium,
                utm_campaign: utm.campaign,
                page_title:   document.title
            });
        }
    }

    // =========================================================================
    // INIT: Run everything on DOMContentLoaded
    // =========================================================================
    function init() {
        // 1. Get UTM from URL, or recover from session
        let utm = getUTMParams();

        if (utm.source || utm.medium) {
            // Fresh UTM from URL — save to session
            persistUTM(utm);
            console.log('[MLP UTM] Captured from URL:', utm);
        } else {
            // No UTM in URL — try to recover from session (cross-page navigation)
            utm = recoverUTM();
            if (utm.source || utm.medium) {
                console.log('[MLP UTM] Recovered from session:', utm);
            }
        }

        // 2. Build tracking params
        const tracking = buildTrackingParams(utm);

        if (tracking) {
            // 3. Update all iCIMS apply links
            observeAndUpdate(tracking);

            // 4. Forward UTM to internal navigation links
            addUTMToInternalLinks(utm);

            // 5. Track arrival in GA4
            trackUTMArrival(utm);
        } else {
            console.log('[MLP UTM] No UTM parameters detected — apply links unchanged');
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
