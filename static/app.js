document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (tg) { tg.ready(); tg.expand(); }

    const $ = (id) => document.getElementById(id);
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
    };
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const t = (k) => window.I18N.t(k);
    window.I18N.apply();
    const fmt = (n) => Number(n || 0).toLocaleString();

    // --- 1. Credentials (Privacy page) ---
    const ghInput = $('ghToken');
    const geminiInput = $('geminiKey');
    if (ghInput && store.get('gh_token')) ghInput.value = store.get('gh_token');
    if (geminiInput && store.get('gemini_key')) geminiInput.value = store.get('gemini_key');

    [['toggleGhToken', ghInput], ['toggleGeminiKey', geminiInput]].forEach(([btnId, input]) => {
        const btn = $(btnId);
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            const hidden = input.type === 'password';
            input.type = hidden ? 'text' : 'password';
            btn.textContent = hidden ? '🙈' : '👁️';
        });
    });

    // Each credential has its own form (own save button, own password-manager entry)
    document.querySelectorAll('form.cred-form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = $(form.dataset.input);
            const value = input ? input.value.trim() : '';
            try {
                value ? localStorage.setItem(form.dataset.store, value) : localStorage.removeItem(form.dataset.store);
            } catch (_) {}
            const status = form.querySelector('.save-status');
            if (status) status.textContent = '✓ ' + t('saved');
            setTimeout(() => { window.location.href = form.dataset.redirect || '/settings'; }, 900);
        });
    });

    // --- 2. Theme ---
    const themeToggle = $('themeToggle');
    if (store.get('theme') === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    }
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('light-mode', e.target.checked);
            store.set('theme', e.target.checked ? 'light' : 'dark');
        });
    }

    // --- 3. Language (saved; used for AI replies) ---
    const langSelect = $('langSelect');
    const savedLang = store.get('lang') || 'en';
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            store.set('lang', e.target.value);
            setTimeout(() => location.reload(), 0);
            document.documentElement.lang = e.target.value;
            document.documentElement.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
        });
    }

    // --- 4. GitHub helpers ---
    async function gh(path, opts = {}) {
        const token = store.get('gh_token');
        const headers = Object.assign({ Accept: 'application/vnd.github+json' },
            token ? { Authorization: `Bearer ${token}` } : {}, opts.headers || {});
        const res = await fetch('https://api.github.com' + path, Object.assign({}, opts, { headers }));
        if (!res.ok) {
            const msg = res.status === 401 ? 'Invalid GitHub token. Check it in Settings → Privacy.'
                : (res.status === 403 || res.status === 429) ? 'GitHub rate limit reached. Add a token in Settings to continue.'
                : `GitHub error (${res.status}).`;
            throw new Error(msg);
        }
        return res.status === 204 ? null : res.json();
    }

    function showMessage(container, text) {
        container.innerHTML = `<div class="empty-state"><p>${esc(text)}</p></div>`;
    }

    function repoCard(r) {
        const name = esc(r.full_name);
        return `
            <div class="feed-card" data-repo="${name}" data-desc="${esc(r.description || '')}"
                 data-lang="${esc(r.language || '')}" data-stars="${esc(r.stargazers_count)}">
                <h3><a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;">${name}</a></h3>
                <p>${esc(r.description) || esc(t('nodesc'))}</p>
                <div class="card-stats">
                    <span>⭐ ${fmt(r.stargazers_count)} ${esc(t('stars'))}</span>
                    <span>💻 ${esc(r.language) || 'N/A'}</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn" data-action="star">⭐ ${esc(t('star'))}</button>
                    <button class="action-btn" data-action="ai">🤖 ${esc(t('ai'))}</button>
                    <a href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-decoration:none;display:inline-block;">🌐 ${esc(t('open'))}</a>
                </div>
                <div class="ai-result" style="display:none;margin-top:10px;font-size:13px;white-space:pre-wrap;"></div>
            </div>`;
    }

    function renderRepos(container, repos) {
        if (!repos || !repos.length) return showMessage(container, t('none'));
        container.innerHTML = repos.map(repoCard).join('');
    }

    // Card button handling (star / AI)
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const card = btn.closest('.feed-card');
        if (!card) return;
        const repo = card.dataset.repo;

        if (btn.dataset.action === 'star') {
            if (!store.get('gh_token')) return alert(t('needStar'));
            btn.disabled = true;
            try {
                await gh(`/user/starred/${repo}`, { method: 'PUT' });
                btn.textContent = ('⭐ ' + t('starred'));
            } catch (err) {
                btn.disabled = false;
                alert(err.message);
            }
        }

        if (btn.dataset.action === 'ai') {
            const key = store.get('gemini_key');
            if (!key) return alert('⚠️ ' + t('needGem'));
            const out = card.querySelector('.ai-result');
            out.style.display = 'block';
            out.textContent = '🤖 ' + t('analyzing');
            btn.disabled = true;
            try {
                const res = await fetch('/api/ai-summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        api_key: key, repo, description: card.dataset.desc,
                        language: card.dataset.lang, stars: card.dataset.stars,
                        lang: store.get('lang') || 'en',
                    }),
                });
                const data = await res.json().catch(() => ({}));
                out.textContent = res.ok ? data.summary : (data.message || 'AI request failed.');
            } catch (_) {
                out.textContent = 'Could not reach the server.';
            } finally {
                btn.disabled = false;
            }
        }
    });

    // --- 5. Home feed (chips + search) ---
    const feed = $('feed-container');
    if (feed) {
        const chipQuery = { foryou: 'stars:>10000', python: 'language:python stars:>1000', javascript: 'language:javascript stars:>1000' };
        let chip = 'foryou';
        let reqId = 0;

        async function loadFeed() {
            const id = ++reqId;
            const text = ($('searchInput') ? $('searchInput').value.trim() : '');
            showMessage(feed, t('loading'));
            try {
                let repos;
                if (chip === 'following' && !text) {
                    if (!store.get('gh_token')) return showMessage(feed, t('needFollow'));
                    const me = await gh('/user');
                    const events = await gh(`/users/${encodeURIComponent(me.login)}/received_events?per_page=50`);
                    const names = [...new Set(events.filter((ev) => ev.type === 'WatchEvent' || ev.type === 'CreateEvent').map((ev) => ev.repo.name))].slice(0, 10);
                    repos = (await Promise.all(names.map((n) => gh(`/repos/${n}`).catch(() => null)))).filter(Boolean);
                } else {
                    const q = [text, chip === 'following' ? chipQuery.foryou : chipQuery[chip]].filter(Boolean).join(' ');
                    const data = await gh(`/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=10`);
                    repos = data.items || [];
                }
                if (id !== reqId) return; // a newer request replaced this one
                renderRepos(feed, repos);
            } catch (err) {
                if (id === reqId) showMessage(feed, err.message);
            }
        }

        document.querySelectorAll('.chip-tab').forEach((b) => b.addEventListener('click', () => {
            document.querySelectorAll('.chip-tab').forEach((x) => x.classList.remove('active'));
            b.classList.add('active');
            chip = b.dataset.chip || 'foryou';
            loadFeed();
        }));

        let timer;
        const search = $('searchInput');
        if (search) search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(loadFeed, 500); });
        loadFeed();
    }

    // --- 6. Trending ---
    const trending = $('trending-container');
    if (trending) {
        const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
        showMessage(trending, t('loading'));
        gh(`/search/repositories?q=${encodeURIComponent('created:>' + since)}&sort=stars&per_page=15`)
            .then((d) => renderRepos(trending, d.items))
            .catch((err) => showMessage(trending, err.message));
    }

    // --- 7. Starred ---
    const starred = $('starred-container');
    if (starred) {
        if (!store.get('gh_token')) {
            starred.innerHTML = `<div class="empty-state"><p>${esc(t('needStarred'))}</p><a href="/settings" class="btn-primary" style="display:inline-block;text-decoration:none;">${esc(t('goSettings'))}</a></div>`;
        } else {
            showMessage(starred, t('loading'));
            gh('/user/starred?per_page=30')
                .then((repos) => { renderRepos(starred, repos); starred.querySelectorAll('[data-action="star"]').forEach((b) => { b.textContent = ('⭐ ' + t('starred')); b.disabled = true; }); })
                .catch((err) => showMessage(starred, err.message));
        }
    }

    // --- 8. Profile ---
    const profile = $('profile-container');
    if (profile) {
        if (!store.get('gh_token')) {
            profile.innerHTML = `<div class="empty-state"><h3>👤 ${esc(t('profileT'))}</h3><p>${esc(t('connectP'))}</p><a href="/settings" class="btn-primary" style="display:inline-block;text-decoration:none;">${esc(t('goSettings'))}</a></div>`;
        } else {
            showMessage(profile, t('loading'));
            gh('/user').then((u) => {
                profile.innerHTML = `
                    <div class="feed-card" style="text-align:center;">
                        <img src="${esc(u.avatar_url)}" alt="" width="88" height="88" style="border-radius:50%;margin-bottom:10px;">
                        <h3>${esc(u.name || u.login)}</h3>
                        <p>@${esc(u.login)}</p>
                        <p>${esc(u.bio)}</p>
                        <div class="card-stats" style="justify-content:center;">
                            <span>📦 ${fmt(u.public_repos)} ${esc(t('repos'))}</span>
                            <span>👥 ${fmt(u.followers)} ${esc(t('followers'))}</span>
                            <span>➡️ ${fmt(u.following)} ${esc(t('followingN'))}</span>
                        </div>
                        <a href="${esc(u.html_url)}" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-decoration:none;display:inline-block;">🌐 ${esc(t('open'))}</a>
                    </div>`;
            }).catch((err) => showMessage(profile, err.message));
        }
    }
});
