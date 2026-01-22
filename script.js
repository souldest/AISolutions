async function changeLanguage(lang) {
    try {
        const response = await fetch('lang.json');
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'UL') {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.innerText = translations[lang][key];
                }
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('ais_lang', lang);
        document.getElementById('langSelect').value = lang;
    } catch (e) { console.error("Lang Error", e); }
}

// Formular-Bot Integration
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const formData = new FormData(this);
    
    // Lead an Ihr CRM senden über FormSubmit
    const response = await fetch("https://formsubmit.co/ajax/vertrieb@aisolutios.de", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const lang = localStorage.getItem('ais_lang') || 'de';
        status.innerHTML = `<p style="color:green; margin-top:15px;">Vielen Dank Dr. Weiss wird sich melden!</p>`;
        this.reset();
        // Google Analytics Event
        gtag('event', 'purchase_attempt', { 'event_category': 'Leads' });
    }
});

window.onload = () => {
    const savedLang = localStorage.getItem('ais_lang') || navigator.language.split('-')[0] || 'de';
    changeLanguage(savedLang);
};
