/* ============================================================
   AQUAVISTA — Authentication (front-end demo auth)
   localStorage-based signup / login / session.
   NOTE: demo only — no real backend. Passwords are SHA-256
   hashed before storage. For production, use a real backend.
   ============================================================ */

'use strict';

(function () {
  const USERS_KEY = 'av_users';
  const SESSION_KEY = 'av_session';

  const $ = (s, c = document) => c.querySelector(s);

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
  }
  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch { return null; }
  }
  function setSession(user, remember) {
    const payload = JSON.stringify({ name: user.name, email: user.email, ts: Date.now() });
    try {
      if (remember) {
        localStorage.setItem(SESSION_KEY, payload);
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, payload);
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {}
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function sha256(text) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('av$' + text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback (non-secure) hash for non-HTTPS file:// contexts
      let h = 0;
      const s = 'av$' + text;
      for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
      return 'f' + Math.abs(h).toString(16);
    }
  }

  function toast(msg, type = 'success') {
    if (window.AquaVista?.showToast) window.AquaVista.showToast(msg, type);
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setErr(input, msg) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    group.classList.remove('success');
    input.classList.add('error');
    let el = group.querySelector('.form-error');
    if (el && msg) el.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + msg;
    if (el) el.style.display = 'flex';
  }
  function clearErr(input, okMark = false) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('error');
    input.classList.remove('error');
    const el = group.querySelector('.form-error');
    if (el) el.style.display = 'none';
    if (okMark && input.value.trim()) {
      group.classList.add('success');
      input.classList.add('success');
    }
  }

  /* ---------- Navbar session state (runs on every page) ---------- */
  function renderNavbar() {
    const session = getSession();
    document.querySelectorAll('.nav-login').forEach(a => {
      if (session) {
        a.href = 'login.html';
        a.setAttribute('aria-label', 'Your account');
        a.innerHTML = '<i class="fa-solid fa-circle-user"></i> ' + escapeHtml(session.name.split(' ')[0]);
        a.title = session.email;
      } else {
        a.href = 'login.html';
        a.setAttribute('aria-label', 'Log in');
        a.innerHTML = '<i class="fa-regular fa-user"></i> Login';
      }
    });
    document.querySelectorAll('.nav-login-mobile').forEach(a => {
      if (session) {
        a.href = 'login.html';
        a.innerHTML = '<i class="fa-solid fa-circle-user"></i> Hi, ' + escapeHtml(session.name.split(' ')[0]) + ' — Account';
      } else {
        a.href = 'login.html';
        a.innerHTML = '<i class="fa-regular fa-user"></i> Log in to your account';
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Login / Signup page logic ---------- */
  function initAuthPage() {
    const loginForm = $('#login-form');
    const signupForm = $('#signup-form');
    if (!loginForm && !signupForm) return;

    // Tabs
    const tabLogin = $('#tab-login');
    const tabSignup = $('#tab-signup');
    const panelLogin = $('#panel-login');
    const panelSignup = $('#panel-signup');
    function showTab(which) {
      const isLogin = which === 'login';
      tabLogin?.classList.toggle('active', isLogin);
      tabSignup?.classList.toggle('active', !isLogin);
      if (panelLogin) panelLogin.hidden = !isLogin;
      if (panelSignup) panelSignup.hidden = isLogin;
      tabLogin?.setAttribute('aria-selected', isLogin ? 'true' : 'false');
      tabSignup?.setAttribute('aria-selected', !isLogin ? 'true' : 'false');
    }
    tabLogin?.addEventListener('click', () => showTab('login'));
    tabSignup?.addEventListener('click', () => showTab('signup'));
    if (new URLSearchParams(location.search).get('mode') === 'signup') showTab('signup');

    // Social login (demo) — Google / Apple buttons sign in instantly
    // and redirect to the home page. NOTE: demo only. For production,
    // replace with real OAuth (Google Identity Services / Apple Sign In)
    // backed by your server.
    async function socialLogin(provider, btn) {
      if (!btn || btn.disabled) return;
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⟳</span> Connecting…';
      await new Promise(r => setTimeout(r, 1200));
      const user = provider === 'apple'
        ? { name: 'Apple User', email: 'user@icloud.com' }
        : { name: 'Google User', email: 'user@gmail.com' };
      setSession(user, true);
      renderNavbar();
      btn.disabled = false;
      btn.innerHTML = orig;
      toast('Signed in with ' + (provider === 'apple' ? 'Apple' : 'Google') + '! Redirecting…');
      setTimeout(() => { location.href = 'index.html'; }, 800);
    }
    $('#google-login')?.addEventListener('click', (e) => socialLogin('google', e.currentTarget));
    $('#apple-login')?.addEventListener('click', (e) => socialLogin('apple', e.currentTarget));

    // Show / hide password
    document.querySelectorAll('[data-toggle-pass]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.querySelector(btn.getAttribute('data-toggle-pass'));
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    // If already logged in, show account panel
    const session = getSession();
    const accountBox = $('#auth-account');
    const formsWrap = $('#auth-forms');
    if (session && accountBox) {
      accountBox.hidden = false;
      if (formsWrap) formsWrap.hidden = true;
      const nameEl = $('#account-name');
      const emailEl = $('#account-email');
      if (nameEl) nameEl.textContent = session.name;
      if (emailEl) emailEl.textContent = session.email;
      $('#logout-btn')?.addEventListener('click', () => {
        clearSession();
        renderNavbar();
        toast('Logged out. See you soon! <i class="fa-solid fa-fish-fins"></i>');
        setTimeout(() => location.reload(), 600);
      });
      return;
    }

    // ---- Signup ----
    signupForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#su-name');
      const email = $('#su-email');
      const pass = $('#su-pass');
      const pass2 = $('#su-pass2');
      let ok = true;

      if (!name.value.trim() || name.value.trim().length < 2) { setErr(name, 'Please enter your name'); ok = false; }
      else clearErr(name, true);

      if (!validEmail(email.value.trim())) { setErr(email, 'Valid email required'); ok = false; }
      else clearErr(email, true);

      if (pass.value.length < 8) { setErr(pass, 'Minimum 8 characters'); ok = false; }
      else clearErr(pass, true);

      if (pass2.value !== pass.value || !pass2.value) { setErr(pass2, 'Passwords do not match'); ok = false; }
      else clearErr(pass2, true);

      if (!ok) return;

      const users = getUsers();
      const emailLc = email.value.trim().toLowerCase();
      if (users.some(u => u.email === emailLc)) {
        setErr(email, 'Account already exists — please log in');
        showTab('login');
        const li = $('#li-email');
        if (li) { li.value = email.value.trim(); clearErr(li); }
        toast('Account exists. Please log in.', 'error');
        return;
      }

      const btn = signupForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Creating account…';

      const hash = await sha256(pass.value);
      users.push({ name: name.value.trim(), email: emailLc, hash, ts: Date.now() });
      saveUsers(users);
      setSession({ name: name.value.trim(), email: emailLc }, true);
      renderNavbar();

      btn.disabled = false;
      btn.innerHTML = orig;
      toast('Welcome to AquaVista, ' + escapeHtml(name.value.trim().split(' ')[0]) + '! <i class="fa-solid fa-fish-fins"></i>');
      setTimeout(() => { location.href = 'index.html'; }, 900);
    });

    // ---- Login ----
    loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('#li-email');
      const pass = $('#li-pass');
      const remember = $('#li-remember')?.checked !== false;
      let ok = true;

      if (!validEmail(email.value.trim())) { setErr(email, 'Valid email required'); ok = false; }
      else clearErr(email, true);

      if (!pass.value) { setErr(pass, 'Please enter your password'); ok = false; }
      else clearErr(pass);

      if (!ok) return;

      const btn = loginForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Logging in…';

      await new Promise(r => setTimeout(r, 700));
      const users = getUsers();
      const emailLc = email.value.trim().toLowerCase();
      const hash = await sha256(pass.value);
      const user = users.find(u => u.email === emailLc);

      // Demo account for first-time visitors
      if (!user && emailLc === 'demo@aquavista.com' && pass.value === 'demo1234') {
        setSession({ name: 'Demo Aquarist', email: emailLc }, remember);
        renderNavbar();
        btn.disabled = false;
        btn.innerHTML = orig;
        toast('Welcome back, Demo Aquarist!');
        setTimeout(() => { location.href = 'index.html'; }, 800);
        return;
      }

      if (!user || user.hash !== hash) {
        btn.disabled = false;
        btn.innerHTML = orig;
        setErr(email, 'Invalid email or password');
        setErr(pass, 'Invalid email or password');
        toast('Invalid email or password.', 'error');
        return;
      }

      setSession(user, remember);
      renderNavbar();
      btn.disabled = false;
      btn.innerHTML = orig;
      toast('Welcome back, ' + escapeHtml(user.name.split(' ')[0]) + '!');
      const next = new URLSearchParams(location.search).get('next');
      setTimeout(() => { location.href = next || 'index.html'; }, 800);
    });

    // Live clear errors
    document.querySelectorAll('#login-form input, #signup-form input').forEach(i => {
      i.addEventListener('input', () => clearErr(i));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initAuthPage();
  });

  window.AquaVistaAuth = { getSession, clearSession, getUsers };
})();
