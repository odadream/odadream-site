// Served only by the loopback workspace server; never copied to publication output.
const devOrigin = 'http://127.0.0.1:5177';
const publicOrigin = 'http://127.0.0.1:5178';
const isPublic = location.origin === publicOrigin;
const ru = document.documentElement.lang !== 'en';
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
  a.href = origin + location.pathname + location.hash;
  if (current) a.setAttribute('aria-current', 'page');
  toolbar.append(a);
  return a;
}
const devLink = link('DEV', devOrigin, !isPublic);
const publicLink = link('PUBLIC', publicOrigin, isPublic);
const registerLink = link(ru ? 'Тексты' : 'Texts', devOrigin, false);
registerLink.href = devOrigin + '/editorial/?lang=' + (ru ? 'ru' : 'en');
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
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = publicOrigin + '/__editorial/style.css';
document.head.append(style);
document.querySelector('.site-header')?.after(toolbar);
if (!toolbar.isConnected) document.body.prepend(toolbar);
let state;
const openedBuild = document.querySelector('script[data-public-built-at]')?.dataset.publicBuiltAt;
const date = (value) => new Date(value).toLocaleString(ru ? 'ru-RU' : 'en-GB');
async function loadBuildStatus() {
  try {
    const response = await fetch(publicOrigin + '/__editorial/status');
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
    publicLink.href = publicOrigin + (present ? location.pathname + location.hash : fallback());
    publicLink.textContent = present
      ? 'PUBLIC'
      : ru
        ? 'PUBLIC · страница отсутствует → каталог'
        : 'PUBLIC · page absent → catalogue';
  } catch {
    output.textContent = ru
      ? 'Сервер PUBLIC недоступен. Запусти start-local-v2.cmd.'
      : 'PUBLIC server unavailable. Run start-local-v2.cmd.';
  }
}
function fallback() {
  const lang = ru ? 'ru' : 'en';
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
window.addEventListener('hashchange', () => {
  devLink.href = devOrigin + location.pathname + location.hash;
  if (state?.routes.includes(location.pathname))
    publicLink.href = publicOrigin + location.pathname + location.hash;
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
