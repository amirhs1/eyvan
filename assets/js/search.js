/*
Search Script
Purpose:
Run full-text search on the /search/ page with the Pagefind bundle that the
build writes to /pagefind/.

Features:
- Loads the Pagefind bundle, then swaps the no-JavaScript notice for the form
- Puts focus in the field and runs any ?q= query on load
- Searches as the visitor types, after Pagefind's debounce, and keeps ?q= in
  the address without adding history entries
- Announces the result count, "No results", or a load failure in the status line
- Renders results in batches, with a "Show more results" button
- Leaves the notice in place when the bundle fails to load

Dependencies:
- [data-search] with data-search-bundle and data-search-base
- [data-search-notice]
- [data-search-form] containing a form and input[name="q"]
- [data-search-status]
- [data-search-results]
- [data-search-more]

Related component:
- search.html
- _includes/search-form.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Search constants
     ========================================================================== */

  const ROOT_SELECTOR = '[data-search]';
  const NOTICE_SELECTOR = '[data-search-notice]';
  const FORM_WRAP_SELECTOR = '[data-search-form]';
  const STATUS_SELECTOR = '[data-search-status]';
  const RESULTS_SELECTOR = '[data-search-results]';
  const MORE_SELECTOR = '[data-search-more]';
  const QUERY_PARAM = 'q';
  const BATCH_SIZE = 10;

  /* ==========================================================================
     Element lookup
     ========================================================================== */

  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) {
    return;
  }

  const notice = root.querySelector(NOTICE_SELECTOR);
  const formWrap = root.querySelector(FORM_WRAP_SELECTOR);
  const form = formWrap ? formWrap.querySelector('form') : null;
  const input = form ? form.querySelector(`input[name="${QUERY_PARAM}"]`) : null;
  const status = root.querySelector(STATUS_SELECTOR);
  const results = root.querySelector(RESULTS_SELECTOR);
  const more = root.querySelector(MORE_SELECTOR);

  if (!notice || !formWrap || !input || !status || !results || !more) {
    return;
  }

  /* ==========================================================================
     Search state
     ========================================================================== */

  let pagefind = null;
  let latestRequest = 0;
  let matches = [];
  let shown = 0;

  /* ==========================================================================
     Rendering helpers
     ========================================================================== */

  function setStatus(message) {
    status.textContent = message;
  }

  function countMessage(total, term) {
    if (total === 0) {
      return `No results for “${term}”.`;
    }

    return `${total} ${total === 1 ? 'result' : 'results'} for “${term}”.`;
  }

  // Pagefind encodes the excerpt's text before adding <mark>; rebuilding it
  // from text nodes and <mark> alone keeps any other markup out regardless.
  function excerptNodes(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    const fragment = document.createDocumentFragment();
    template.content.childNodes.forEach((node) => {
      if (node.nodeName === 'MARK') {
        const mark = document.createElement('mark');
        mark.className = 'c-search__match';
        mark.textContent = node.textContent;
        fragment.append(mark);
      } else {
        fragment.append(document.createTextNode(node.textContent));
      }
    });

    return fragment;
  }

  function resultItem(data) {
    const item = document.createElement('li');
    item.className = 'c-search__result';

    const title = document.createElement('h2');
    title.className = 'c-search__result-title';

    const link = document.createElement('a');
    link.className = 'c-search__result-link';
    link.href = data.url;
    link.textContent = (data.meta && data.meta.title) || data.url;
    title.append(link);

    const excerpt = document.createElement('p');
    excerpt.className = 'c-search__result-excerpt';
    excerpt.append(excerptNodes(data.excerpt || ''));

    item.append(title, excerpt);
    return item;
  }

  function clearResults() {
    matches = [];
    shown = 0;
    results.replaceChildren();
    more.hidden = true;
  }

  // Appends the next batch and returns its first link, or null when the
  // request was superseded while the batch loaded.
  async function appendBatch(request) {
    const batch = matches.slice(shown, shown + BATCH_SIZE);
    const data = await Promise.all(batch.map((match) => match.data()));

    if (request !== latestRequest) {
      return null;
    }

    const items = data.map(resultItem);
    results.append(...items);
    shown += batch.length;
    more.hidden = shown >= matches.length;

    return items.length ? items[0].querySelector('a') : null;
  }

  /* ==========================================================================
     Search flow
     ========================================================================== */

  function syncQueryParam(term) {
    const url = new URL(window.location.href);

    if (term) {
      url.searchParams.set(QUERY_PARAM, term);
    } else {
      url.searchParams.delete(QUERY_PARAM);
    }

    window.history.replaceState(window.history.state, '', url);
  }

  async function runSearch(term, { debounce }) {
    const request = ++latestRequest;

    if (!term) {
      clearResults();
      setStatus('');
      return;
    }

    try {
      const search = debounce
        ? await pagefind.debouncedSearch(term)
        : await pagefind.search(term);

      // debouncedSearch resolves to null when a newer call superseded it.
      if (search === null || request !== latestRequest) {
        return;
      }

      clearResults();
      matches = search.results;
      await appendBatch(request);

      if (request === latestRequest) {
        setStatus(countMessage(matches.length, term));
      }
    } catch (error) {
      if (request === latestRequest) {
        clearResults();
        setStatus('Search could not load results.');
      }
    }
  }

  async function showMore() {
    const request = latestRequest;

    try {
      const firstNew = await appendBatch(request);
      if (firstNew) {
        firstNew.focus();
      }
    } catch (error) {
      setStatus('Search could not load results.');
    }
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  async function loadPagefind() {
    const bundle = await import(`${root.dataset.searchBundle}pagefind.js`);
    await bundle.options({ baseUrl: root.dataset.searchBase });
    await bundle.init();
    return bundle;
  }

  async function init() {
    try {
      pagefind = await loadPagefind();
    } catch (error) {
      setStatus('Search could not load.');
      return;
    }

    notice.hidden = true;
    formWrap.hidden = false;

    input.addEventListener('input', () => {
      const term = input.value.trim();
      syncQueryParam(term);
      if (term) {
        // Fetches the index chunks early; runSearch reports any real failure.
        pagefind.preload(term).catch(() => {});
      }
      runSearch(term, { debounce: true });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      runSearch(input.value.trim(), { debounce: false });
    });

    more.addEventListener('click', showMore);

    const initialTerm = (new URLSearchParams(window.location.search).get(QUERY_PARAM) || '').trim();
    input.value = initialTerm;
    input.focus();

    if (initialTerm) {
      runSearch(initialTerm, { debounce: false });
    }
  }

  init();
})();
