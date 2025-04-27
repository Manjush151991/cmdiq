const CACHE_NAME = 'cmdiq-v1';
const ASSETS = [
  './',
  'index.html',
  'assets/style.css',
  'assets/scripts.js',
  'assets/windows-style.css',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/favicon.ico',
  'offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('offline.html'));
    })
  );
});

function renderHistory() {
  const scriptContainer = document.getElementById('scriptContainer');
  const template = document.getElementById('scriptTemplate');
  const history = JSON.parse(localStorage.getItem('scriptHistory')) || [];

  scriptContainer.innerHTML = '';

  if (history.length === 0) {
    scriptContainer.innerHTML = '<p>No scripts uploaded yet.</p>';
    return;
  }

  history.forEach(script => {
    const clone = template.content.cloneNode(true);
    const date = new Date(script.date).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    clone.querySelector('.script-title').textContent = script.name;
    clone.querySelector('.script-description').textContent = script.description || 'No description provided';
    clone.querySelector('.script-date').textContent = `Uploaded: ${date}`;
    clone.querySelector('.script-date').setAttribute('datetime', script.date);

    if (script.preview) {
      clone.querySelector('.preview-content').textContent = script.preview;
    }

    clone.querySelector('[data-action="delete"]').addEventListener('click', () => {
      const updated = history.filter(s => s.date !== script.date);
      localStorage.setItem('scriptHistory', JSON.stringify(updated));
      renderHistory();
    });

    scriptContainer.appendChild(clone);
  });
}

function saveScriptToHistory(filename) {
  const file = document.getElementById('scriptFile').files[0];
  const description = document.getElementById('scriptDescription').value;
  const reader = new FileReader();

  reader.onload = (e) => {
    const preview = e.target.result.substr(0, 200);
    const history = JSON.parse(localStorage.getItem('scriptHistory')) || [];

    history.unshift({
      id: Date.now(),
      name: filename,
      description,
      preview,
      date: new Date().toISOString()
    });

    localStorage.setItem('scriptHistory', JSON.stringify(history));
    renderHistory();
  };

  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
});
