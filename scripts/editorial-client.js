// Served only by the loopback workspace server; never copied to publication output.
const devOrigin = 'http://127.0.0.1:5177';
const publicOrigin = 'http://127.0.0.1:5178';
const isPublic = location.origin === publicOrigin;
const ru = document.documentElement.lang !== 'en';
const currentPath = () => location.pathname + location.search + location.hash;
const contentLanguage = () =>
  location.pathname === '/editorial/'
    ? new URLSearchParams(location.search).get('lang') === 'en'
      ? 'en'
      : 'ru'
    : ru
      ? 'ru'
      : 'en';
const toolbar = document.createElement('nav');
toolbar.className = 'editorial-toolbar';
toolbar.dataset.editorialToolbar = isPublic ? 'public' : 'dev';
toolbar.setAttribute('aria-label', ru ? 'Локальный редакционный просмотр' : 'Local editorial workspace');
const label = document.createElement('strong');
label.textContent = ru ? 'Локальная среда сайта' : 'Local site workspace';
const modes = document.createElement('div');
modes.className = 'editorial-toolbar__modes';
const tools = document.createElement('div');
tools.className = 'editorial-toolbar__tools';
toolbar.append(modes, tools);
function link(text, origin, current) {
  const a = document.createElement('a');
  a.textContent = text;
  a.href = origin + currentPath();
  if (current) a.setAttribute('aria-current', 'page');
  modes.append(a);
  return a;
}
const devLink = link(ru ? 'Рабочая версия' : 'Working site', devOrigin, !isPublic);
const publicLink = link(ru ? 'Проверка PUBLIC' : 'PUBLIC preview', publicOrigin, isPublic);
const registerLink = link(ru ? 'Редактура текстов' : 'Edit texts', devOrigin, false);
devLink.dataset.editorialMode = 'dev';
publicLink.dataset.editorialMode = 'public';
registerLink.dataset.editorialMode = 'texts';
registerLink.href = devOrigin + '/editorial/?lang=' + contentLanguage();
const output = document.createElement('output');
output.setAttribute('aria-live', 'polite');
const buildDetails = document.createElement('details');
buildDetails.className = 'editorial-toolbar__status';
buildDetails.dataset.editorialBuild = '';
const buildSummary = document.createElement('summary');
buildSummary.textContent = ru ? 'PUBLIC: проверяем' : 'PUBLIC: checking';
const buildPanel = document.createElement('div');
buildPanel.className = 'editorial-toolbar__panel';
buildPanel.classList.add('editorial-toolbar__panel--help');
const help = document.createElement('dl');
for (const [term, description] of ru
  ? [
      ['Рабочая версия · DEV', 'Текущие изменения и служебные материалы.'],
      ['Проверка PUBLIC', 'Локальный просмотр публикуемой версии; это не обновление odadream.art.'],
      ['Редактура текстов', 'Реестр текстовых блоков, их готовность и статусы проверки.'],
    ]
  : [
      ['Working site · DEV', 'Current edits and internal material.'],
      ['PUBLIC preview', 'Local publishable version; this does not update odadream.art.'],
      ['Edit texts', 'Content blocks, readiness and review statuses.'],
    ]) {
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = description;
  help.append(dt, dd);
}
const routeInfo = document.createElement('p');
buildPanel.append(label, help, routeInfo, output);
buildDetails.append(buildSummary, buildPanel);
tools.append(buildDetails);
if (!isPublic) {
  // Browser-local drafts are pending source updates, never a successful server save.
  const cropKey = 'oda.media-framing.v2';
  const cropDetails = document.createElement('details');
  cropDetails.className = 'editorial-toolbar__status';
  const cropSummary = document.createElement('summary');
  cropSummary.dataset.framingPending = '';
  const cropInfo = document.createElement('p');
  const cropExport = document.createElement('button');
  cropExport.type = 'button';
  cropExport.className = 'button';
  cropExport.textContent = ru ? 'Экспорт настроек' : 'Export settings';
  let cropDrafts = Object.create(null);
  const updateCropStatus = () => {
    cropDrafts = Object.create(null);
    try {
      const raw = JSON.parse(localStorage.getItem(cropKey) ?? '{}');
      if (raw?.schemaVersion !== 2 || !raw.media || typeof raw.media !== 'object' || Array.isArray(raw.media))
        throw Error('Invalid framing draft');
      for (const [id, value] of Object.entries(raw.media ?? {})) {
        if (
          /^[a-z0-9][a-z0-9-]*$/.test(id) &&
          ['natural', 'contain', 'cover'].includes(value?.fit) &&
          [value.x, value.y].every((point) => Number.isFinite(point) && point >= 0 && point <= 100)
        )
          cropDrafts[id] = value;
      }
    } catch {
      /* No persisted local drafts. */
    }
    const ids = Object.keys(cropDrafts).sort();
    cropSummary.textContent = (ru ? 'Кадрирование · ' : 'Framing · ') + ids.length;
    cropInfo.textContent = ids.length
      ? (ru ? 'Ожидают переноса на сервер: ' : 'Pending source updates: ') + ids.join(', ')
      : ru
        ? 'Нет настроек, ожидающих переноса на сервер.'
        : 'No pending source updates.';
    cropExport.disabled = !ids.length;
  };
  cropExport.addEventListener('click', () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ schemaVersion: 2, media: cropDrafts }, null, 2)], {
        type: 'application/json',
      }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'oda-media-framing.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const cropPanel = document.createElement('div');
  cropPanel.className = 'editorial-toolbar__panel';
  const cropHelp = document.createElement('p');
  cropHelp.textContent = ru
    ? 'Настройки сохранены только в этом браузере. Счётчик — количество материалов, ожидающих переноса настроек в данные сайта. Экспорт скачивает JSON для переноса; сервер и публикация не меняются.'
    : 'Settings are stored only in this browser. The count shows media awaiting transfer to site data. Export downloads JSON; it does not update the server or published site.';
  cropPanel.append(cropHelp, cropInfo, cropExport);
  cropDetails.append(cropSummary, cropPanel);
  tools.append(cropDetails);
  document.addEventListener('oda:media-drafts-changed', updateCropStatus);
  window.addEventListener('storage', (event) => {
    if (event.key === cropKey || event.key === null) updateCropStatus();
  });
  updateCropStatus();
}
const refresh = document.createElement('button');
refresh.type = 'button';
refresh.className = 'button';
refresh.dataset.editorialRefresh = '';
refresh.textContent = ru ? 'Пересобрать локальный PUBLIC' : 'Rebuild local PUBLIC';
buildPanel.append(refresh);
if (isPublic) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = publicOrigin + '/__editorial/style.css';
  document.head.append(style);
}
document.querySelector('.site-header')?.append(toolbar);
if (!toolbar.isConnected) document.body.prepend(toolbar);
toolbar.querySelectorAll('details').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (details.open) {
      document.dispatchEvent(new CustomEvent('oda:workspace:open'));
      toolbar.querySelectorAll('details').forEach((other) => {
        if (other !== details) other.open = false;
      });
    }
  });
});
const closeTools = () => toolbar.querySelectorAll('details').forEach((details) => (details.open = false));
document.addEventListener('oda:contents:open', closeTools);
document.addEventListener('oda:main-menu:open', closeTools);
document.addEventListener('focusin', (event) => {
  if (!toolbar.contains(event.target)) closeTools();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const opened = toolbar.querySelector('details[open]');
  if (opened) {
    opened.open = false;
    opened.querySelector('summary').focus();
  }
});
document.addEventListener('click', (event) => {
  if (!toolbar.contains(event.target))
    toolbar.querySelectorAll('details').forEach((details) => (details.open = false));
});
let state;
const openedBuild = document.querySelector('script[data-public-built-at]')?.dataset.publicBuiltAt;
const date = (value) => new Date(value).toLocaleString(ru ? 'ru-RU' : 'en-GB');
async function loadBuildStatus() {
  try {
    const response = await fetch(publicOrigin + '/__editorial/status', { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('Unavailable');
    state = await response.json();
    const old = isPublic && openedBuild && state.builtAt !== openedBuild;
    output.textContent =
      state.error ||
      (state.building
        ? ru
          ? 'PUBLIC пересобирается; доступна предыдущая версия.'
          : 'PUBLIC rebuilding; the previous version remains available.'
        : !state.ready
          ? ru
            ? 'PUBLIC ещё не готов.'
            : 'PUBLIC is not ready.'
          : old
            ? ru
              ? 'Есть новая сборка. Обнови страницу.'
              : 'A new build is ready. Reload this page.'
            : (ru ? 'PUBLIC собран: ' : 'PUBLIC built: ') + date(state.builtAt));
    buildSummary.textContent = state.error
      ? ru
        ? 'PUBLIC: ошибка'
        : 'PUBLIC: error'
      : state.building
        ? ru
          ? 'PUBLIC: собирается'
          : 'PUBLIC: building'
        : old
          ? ru
            ? 'PUBLIC: обновить'
            : 'PUBLIC: reload'
          : ru
            ? state.ready
              ? 'PUBLIC: готов'
              : 'PUBLIC: не готов'
            : state.ready
              ? 'PUBLIC: ready'
              : 'PUBLIC: not ready';
    refresh.disabled = state.building;
    refresh.textContent = old
      ? ru
        ? 'Показать новую локальную версию'
        : 'Show new local version'
      : ru
        ? 'Пересобрать локальный PUBLIC'
        : 'Rebuild local PUBLIC';
    const present = state.routes.includes(location.pathname);
    publicLink.href = publicOrigin + (present ? currentPath() : fallback());
    routeInfo.textContent = present
      ? ru
        ? '«Проверка PUBLIC» откроет эту же страницу в публикуемой версии.'
        : 'PUBLIC preview opens this same page in the publishable version.'
      : ru
        ? `Эта страница не входит в PUBLIC. Кнопка «Проверка PUBLIC» откроет ${fallback() === '/' + contentLanguage() + '/' ? 'главную страницу' : 'каталог раздела'}. Служебные страницы и непубличные материалы доступны только в рабочей версии.`
        : 'This page is not included in PUBLIC. PUBLIC preview opens the section index or homepage. Internal tools and unpublished material remain in DEV.';
  } catch {
    state = undefined;
    buildSummary.textContent = ru ? 'PUBLIC: недоступен' : 'PUBLIC: offline';
    output.textContent = ru
      ? 'Локальная проверка публикации недоступна. Запустите start-local-v2.cmd в папке проекта. Рабочая версия продолжает работать.'
      : 'Local PUBLIC preview is offline. Run start-local-v2.cmd in the project folder. DEV remains available.';
  }
}
function fallback() {
  const lang = contentLanguage();
  const section = location.pathname.split('/')[2];
  return [
    'works',
    'education',
    'cases',
    'cooperation',
    'studio',
    'technology',
    'recognition',
    'contact',
  ].includes(section)
    ? '/' + lang + '/' + section + '/'
    : '/' + lang + '/';
}
function updateLinks() {
  devLink.href = devOrigin + currentPath();
  registerLink.href = devOrigin + '/editorial/?lang=' + contentLanguage();
  if (state)
    publicLink.href = publicOrigin + (state.routes.includes(location.pathname) ? currentPath() : fallback());
}
window.addEventListener('hashchange', updateLinks);
window.addEventListener('popstate', updateLinks);
document.addEventListener('change', (event) => {
  if (event.target instanceof Element && event.target.matches('.editorial-filters [name="language"]'))
    updateLinks();
});
publicLink.addEventListener('click', (event) => {
  if (!state?.ready) {
    event.preventDefault();
    void loadBuildStatus();
  }
});
refresh.addEventListener('click', async () => {
  if (isPublic && state?.ready && openedBuild !== state.builtAt) {
    location.reload();
    return;
  }
  try {
    await fetch(publicOrigin + '/__editorial/rebuild', { method: 'POST' });
    await loadBuildStatus();
  } catch {
    output.textContent = ru ? 'Не удалось запустить сборку.' : 'Could not start the build.';
  }
});
void loadBuildStatus();
const poll = setInterval(() => {
  if (!document.hidden) void loadBuildStatus();
}, 5000);
window.addEventListener('pagehide', () => clearInterval(poll), { once: true });
