// Debug + auto-fix script for cards in dark mode
// Usage: paste into browser console while on page with .dark on <html>

(function debugAndFixCards() {
    const selectors = [
        "[class*='card']",
        ".card",
        ".bg-white",
        ".bg-slate-50",
        ".bg-slate-100",
        ".bg-gray-50",
        ".bg-gray-100",
        ".rounded-lg.shadow",
        ".rounded-xl.shadow",
        ".rounded-2xl.shadow",
    ];

    const found = new Set();
    const fixed = [];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            // compute background color
            const cs = getComputedStyle(el);
            const bg = cs.backgroundColor || '';
            // check for light backgrounds (white-ish)
            const lightMatch = /rgba?\((255|248|245|250|243)[, )]/i;
            if (lightMatch.test(bg) || /white|#fff|#ffffff/i.test(el.getAttribute('style') || '')) {
                el.style.backgroundColor = '#1e293b';
                el.style.color = '#f8fafc';
                el.style.borderColor = '#334155';
                el.classList.add('__force-dark-fallback');
                fixed.push(el);
                found.add(sel);
            }
        });
    });

    console.group('%cDark-mode card fixer', 'color: #60a5fa; font-weight: 700');
    console.log('Selectors scanned:', Array.from(selectors).join(', '));
    console.log('Selectors that matched elements:', Array.from(found));
    console.log('Elements fixed:', fixed.length);
    fixed.slice(0, 50).forEach((el, i) => {
        console.log(i + 1, el.tagName, el.className, el);
    });
    if (fixed.length > 50) console.log('...and', fixed.length - 50, 'more elements');
    console.groupEnd();

    return { fixedCount: fixed.length, selectorsMatched: Array.from(found) };
})();
