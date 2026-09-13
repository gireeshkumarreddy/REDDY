(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const safeEmail = (value) => typeof value === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) ? value : '';
  const safeUrl = (value, domains) => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && domains.some((domain) => url.hostname === domain || url.hostname.endsWith('.' + domain)) ? url : null; } catch { return null; }
  };
  document.getElementById('year').textContent = new Date().getFullYear();
  const primaryEmail = safeEmail(config.primaryEmail) || 'gireeshuiux@gmail.com';
  const personalEmail = safeEmail(config.personalEmail);
  const businessEmail = safeEmail(config.businessEmail);
  for (const [type, email] of Object.entries({ primary: primaryEmail, personal: personalEmail, business: businessEmail })) {
    const link = document.querySelector(`[data-email-link="${type}"]`);
    const text = document.querySelector(`[data-email-text="${type}"]`);
    if (!email) continue;
    link.href = 'mailto:' + email;
    text.textContent = email;
    link.hidden = type === 'primary' && (primaryEmail === personalEmail || primaryEmail === businessEmail);
  }
  for (const [type, value, domains] of [['linkedin', config.linkedinUrl, ['linkedin.com']], ['instagram', config.instagramUrl, ['instagram.com']]]) {
    const link = document.querySelector(`[data-social="${type}"]`);
    const url = safeUrl(value, domains);
    if (!url) { link.hidden = true; continue; }
    link.hidden = false;
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.querySelector('.social-status').textContent = '↗';
  }
  const callEmail = document.getElementById('call-email');
  const emailForProjects = businessEmail || primaryEmail;
  const updateCallEmail = (project = '') => {
    const subject = project ? 'Let’s talk about ' + project : 'Let’s book a project call';
    const body = 'Hi Gireesh,\n\nI’d like to discuss ' + (project || 'a project') + '.\n\nA little about my idea:\n\nMy timeline:\n\nMy timezone and a few times that work for me:\n\nThanks!';
    callEmail.href = 'mailto:' + emailForProjects + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  };
  updateCallEmail();
  document.querySelectorAll('[data-project]').forEach((link) => link.addEventListener('click', () => updateCallEmail(link.dataset.project)));
  const bookingUrl = safeUrl(config.bookingUrl, ['calendar.google.com', 'calendar.app.google']);
  const isBooking = bookingUrl && ((bookingUrl.hostname === 'calendar.app.google' && bookingUrl.pathname.length > 1) || (bookingUrl.hostname === 'calendar.google.com' && /\/appointments\/(?:schedules\/|schedule\/|[^/]+)/.test(bookingUrl.pathname)));
  if (isBooking) {
    document.getElementById('booking-fallback').hidden = true;
    document.getElementById('booking-connected').hidden = false;
    document.getElementById('open-booking').href = bookingUrl.href;
    // Full schedule URLs support embedding. Short share links use the direct booking button.
    if (bookingUrl.hostname === 'calendar.google.com' && /\/appointments\/schedules\//.test(bookingUrl.pathname)) {
      const embedUrl = new URL(bookingUrl);
      embedUrl.searchParams.set('gv', 'true');
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl.href;
      iframe.title = 'Book a project call with Gireesh on Google Calendar';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      document.getElementById('booking-embed').append(iframe);
    }
  }
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const setMenu = (open) => { menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); };
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) { setMenu(false); menuButton.focus(); } });
  document.addEventListener('click', (event) => { if (!menu.hidden && !event.target.closest('.header')) setMenu(false); });
  matchMedia('(min-width: 721px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });
})();
