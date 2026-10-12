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
label.textContent = ru ? 'Локально' : 'Local';
toolbar.append(label);
function link(text, origin, current) {
  const a = document.createElement('a');
  a.textContent = text;
  a.href = origin + currentPath();
  if (current) a.setAttribute('aria-current', 'page');
  toolbar.append(a);
  return a;
}
const devLink = link('DEV', devOrigin, !isPublic);
const publicLink = link('PUBLIC', publicOrigin, isPublic);
const registerLink = link(ru ? 'Тексты' : 'Texts', devOrigin, false);
registerLink.href = devOrigin + '/editorial/?lang=' + contentLanguage();
const output = document.createElement('output');
output.setAttribute('aria-live', 'polite');
const buildDetails = document.createElement('details');
buildDetails.className = 'editorial-toolbar__status';
const buildSummary = document.createElement('summary');
buildSummary.textContent = ru ? 'Сборка' : 'Build';
buildDetails.append(buildSummary, output);
toolbar.append(buildDetails);
const refresh = document.createElement('button');
refresh.type = 'button';
refresh.dataset.editorialRefresh = '';
refresh.textContent = ru ? 'Обновить PUBLIC' : 'Refresh PUBLIC';
buildDetails.append(refresh);
if (isPublic) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = publicOrigin + '/__editorial/style.css';
  document.head.append(style);
}
document.querySelector('.site-header')?.after(toolbar);
if (!toolbar.isConnected) document.body.prepend(toolbar);
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
        ? 'Сборка · ошибка'
        : 'Build · error'
      : state.building
        ? ru
          ? 'Сборка · обновляется'
          : 'Build · rebuilding'
        : old
          ? ru
            ? 'Сборка · новая'
            : 'Build · new'
          : ru
            ? 'Сборка'
            : 'Build';
    refresh.disabled = state.building;
    const present = state.routes.includes(location.pathname);
    publicLink.href = publicOrigin + (present ? currentPath() : fallback());
    publicLink.textContent = present
      ? 'PUBLIC'
      : ru
        ? 'PUBLIC · страница отсутствует → каталог'
        : 'PUBLIC · page absent → catalogue';
  } catch {
    state = undefined;
    buildSummary.textContent = ru ? 'PUBLIC · недоступен' : 'PUBLIC · unavailable';
    output.textContent = ru
      ? 'Сервер PUBLIC недоступен. Запусти start-local-v2.cmd.'
      : 'PUBLIC server unavailable. Run start-local-v2.cmd.';
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
