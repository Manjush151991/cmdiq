// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggler
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) body.classList.add(savedTheme);

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme',
      body.classList.contains('dark-theme') ? 'dark-theme' : ''
    );
  });

  // Upload Form Elements
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('scriptFile');
  const fileError = document.getElementById('fileError');
  const uploadResult = document.getElementById('uploadResult');
  const loadingSpinner = document.getElementById('loadingSpinner');

  const allowedTypes = ['ps1', 'sh', 'py'];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    fileError.hidden = true;
    uploadResult.hidden = true;
    loadingSpinner.hidden = false;

    try {
      const file = fileInput.files[0];
      if (!file) {
        throw new Error('No file selected');
      }

      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(ext)) {
        throw new Error('Invalid file type. Allowed: .ps1, .sh, .py');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      showUploadSuccess(file.name);
      saveScriptToHistory(file.name);
      form.reset();
    } catch (error) {
      handleUploadError(error);
    } finally {
      loadingSpinner.hidden = true;
    }
  });

  function showUploadSuccess(filename) {
    uploadResult.textContent = `✅ ${filename} uploaded successfully!`;
    uploadResult.style.color = '#16a34a'; // green color
    uploadResult.hidden = false;
  }

  function handleUploadError(error) {
    uploadResult.textContent = `❌ ${error.message}`;
    uploadResult.style.color = '#dc2626'; // red color
    uploadResult.hidden = false;
  }

  // Modal dialog logic for Windows-style UI
  function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMsg = document.getElementById('modal-message');
    if (modal && modalMsg) {
      modalMsg.textContent = message;
      modal.style.display = 'flex';
    }
  }

  // Replace all alert() calls with showModal()
  document.querySelectorAll('.fluent-button, .btn').forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === 'explore') {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal('Feature coming soon!');
      });
    }
  });

  // Script History
  const scriptContainer = document.getElementById('scriptContainer');
  const scriptTemplate = document.getElementById('scriptTemplate');

  function saveScriptToHistory(filename) {
    const scripts = JSON.parse(localStorage.getItem('scripts')) || [];
    const newScript = {
      id: Date.now(),
      name: filename,
      description: document.getElementById('scriptDescription').value,
      date: new Date().toISOString()
    };

    scripts.unshift(newScript);
    localStorage.setItem('scripts', JSON.stringify(scripts));
    renderScripts();
  }

  function renderScripts() {
    scriptContainer.innerHTML = '';
    const scripts = JSON.parse(localStorage.getItem('scripts')) || [];

    if (scripts.length === 0) {
      scriptContainer.innerHTML = '<p class="empty-state">No scripts uploaded yet</p>';
      return;
    }

    scripts.forEach(script => {
      const clone = scriptTemplate.content.cloneNode(true);
      const dateOptions = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      };
      const date = new Date(script.date).toLocaleDateString('en-US', dateOptions);

      clone.querySelector('.script-title').textContent = script.name;
      clone.querySelector('.script-date').textContent = `Uploaded: ${date}`;
      clone.querySelector('.script-date').datetime = script.date;
      clone.querySelector('.script-description').textContent =
        script.description || 'No description provided';

      clone.querySelector('[data-action="delete"]').addEventListener('click', () => {
        const updatedScripts = scripts.filter(s => s.id !== script.id);
        localStorage.setItem('scripts', JSON.stringify(updatedScripts));
        renderScripts();
      });

      scriptContainer.appendChild(clone);
    });
  }

  renderScripts(); // Load on page ready

  // Enhanced window controls for minimize, maximize, close
  function setupWindowControls() {
    const minimizeBtn = document.querySelector('.win-btn.minimize');
    const maximizeBtn = document.querySelector('.win-btn.maximize');
    const closeBtn = document.querySelector('.win-btn.close');
    const windowEl = document.querySelector('.window');

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        if (windowEl) windowEl.style.display = 'none';
        showModal('Window minimized. Refresh to restore.');
      });
    }
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => {
        if (windowEl) {
          if (!windowEl.classList.contains('maximized')) {
            windowEl.classList.add('maximized');
            windowEl.style.position = 'fixed';
            windowEl.style.top = '0';
            windowEl.style.left = '0';
            windowEl.style.width = '100vw';
            windowEl.style.height = '100vh';
            windowEl.style.zIndex = '999';
          } else {
            windowEl.classList.remove('maximized');
            windowEl.style.position = '';
            windowEl.style.top = '';
            windowEl.style.left = '';
            windowEl.style.width = '';
            windowEl.style.height = '';
            windowEl.style.zIndex = '';
          }
        }
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (windowEl) windowEl.style.display = 'none';
        showModal('Window closed. Refresh to restore.');
      });
    }
  }

  setupWindowControls();

  // --- Boot Animation ---
  function showBootAnimation() {
    const boot = document.createElement('div');
    boot.className = 'cmdiq-boot-animation';
    boot.innerHTML = `
      <div class="boot-logo"><img src="assets/CMDIQ.png" alt="CMDIQ Logo" /></div>
      <div class="boot-spinner"></div>
      <div class="boot-text">CMDIQ OS is starting...</div>
    `;
    document.body.appendChild(boot);
    setTimeout(() => boot.classList.add('show'), 10);
    setTimeout(() => {
      boot.classList.remove('show');
      setTimeout(() => boot.remove(), 700);
    }, 2200);
  }
  window.addEventListener('DOMContentLoaded', showBootAnimation);

  // --- Mock API Integration for CMDIQ ---
  const mockApi = {
    devices: () => Promise.resolve([
      { id: 1, name: 'Device 1', os: 'Windows 11 Pro', status: 'Online' },
      { id: 2, name: 'Device 2', os: 'macOS Sonoma', status: 'Offline' },
      { id: 3, name: 'Device 3', os: 'Windows 10', status: 'Online' }
    ]),
    compliance: () => Promise.resolve([
      { id: 1, policy: 'Disk Encryption', status: 'Compliant', desc: 'All devices have BitLocker/FileVault enabled.' },
      { id: 2, policy: 'Antivirus', status: 'Non-Compliant', desc: '2 devices missing antivirus updates.' }
    ]),
    remoteLog: () => Promise.resolve([
      { device: 'Device 1', action: 'Restarted', time: '2 min ago' },
      { device: 'Device 2', action: 'Locked', time: '10 min ago' }
    ])
  };

  // Inject mock data into windows if present
  function renderMockDevices(container) {
    mockApi.devices().then(devices => {
      container.innerHTML = devices.map(d => `
        <div class="device-card">
          <img src="assets/icon-192.png" alt="Device" class="device-icon" />
          <div>
            <strong>${d.name}</strong><br/>
            ${d.os}<br/>
            Status: <span class="status-${d.status.toLowerCase()}">${d.status}</span>
          </div>
          <button class="fluent-button">Details</button>
        </div>
      `).join('');
    });
  }
  function renderMockCompliance(container) {
    mockApi.compliance().then(policies => {
      container.innerHTML = policies.map(p => `
        <div class="compliance-card">
          <strong>${p.policy}</strong>
          <span class="compliance-status ${p.status === 'Compliant' ? 'compliant' : 'noncompliant'}">${p.status}</span>
          <p>${p.desc}</p>
        </div>
      `).join('');
    });
  }
  function renderMockRemoteLog(container) {
    mockApi.remoteLog().then(logs => {
      container.innerHTML = '<strong>Recent Actions</strong><ul>' + logs.map(l => `<li>${l.device}: ${l.action} (${l.time})</li>`).join('') + '</ul>';
    });
  }

  // On window open, inject mock data if window-content matches
  function injectMockDataToAppWindow(win) {
    if (!win) return;
    const devicesList = win.querySelector('.devices-list');
    if (devicesList) renderMockDevices(devicesList);
    const complianceList = win.querySelector('.compliance-list');
    if (complianceList) renderMockCompliance(complianceList);
    const remoteLog = win.querySelector('.remote-log');
    if (remoteLog) renderMockRemoteLog(remoteLog);
  }

  // --- Enhanced Desktop OS JS ---
  function focusWindow(win) {
    document.querySelectorAll('.windows-area .window').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
  }

  function createWindow(app) {
    const windowsArea = document.querySelector('.windows-area');
    if (!windowsArea) return;
    // Prevent duplicate windows
    let win = windowsArea.querySelector('.window[data-app="' + app + '"]');
    if (win) {
      win.classList.remove('minimized');
      focusWindow(win);
      return;
    }
    // Window content (can be customized per app)
    const contentMap = {
      devices: '<h2>Devices</h2><div class="devices-list"></div>',
      compliance: '<h2>Compliance</h2><div class="compliance-list"></div>',
      scripts: '<h2>Scripts</h2><p>Script automation window.</p>',
      'mac-enrollments': '<h2>Mac Enrollment</h2><p>Mac enrollment window.</p>',
      'patch-management': '<h2>Patching</h2><p>Patching window.</p>',
      'remote-commands': '<h2>Remote</h2><div class="remote-log"></div>',
      dashboards: '<h2>Dashboard</h2><p>Dashboard window.</p>',
      investigations: '<h2>Investigations</h2><p>Investigations window.</p>',
      'user-management': `
        <h2>User Management</h2>
        <div class='user-profile'>
          <img src='assets/icon-192.png' alt='User' class='user-avatar'/>
          <div>
            <strong>Username:</strong> johndoe<br/>
            <strong>Role:</strong> Admin<br/>
            <button class='fluent-button' id='logout-btn'>Logout</button>
          </div>
        </div>
        <div class='user-settings'>
          <label>Change Password: <input type='password' placeholder='New password'></label>
          <button class='fluent-button'>Update</button>
        </div>
      `,
      'notifications-center': `
        <h2>Notifications Center</h2>
        <ul class='notif-list'>
          <li>System update available <button class='fluent-button notif-dismiss'>Dismiss</button></li>
          <li>Device 2 went offline <button class='fluent-button notif-dismiss'>Dismiss</button></li>
          <li>Compliance scan completed <button class='fluent-button notif-dismiss'>Dismiss</button></li>
        </ul>
        <button class='fluent-button' id='clear-notifs'>Clear All</button>
      `,
      'file-explorer': `
        <h2>File Explorer</h2>
        <div class='file-list'>
          <div class='file-item'><img src='assets/icon-192.png' alt='File'/> report.pdf <button class='fluent-button file-open'>Open</button></div>
          <div class='file-item'><img src='assets/icon-192.png' alt='File'/> logs.txt <button class='fluent-button file-open'>Open</button></div>
          <div class='file-item'><img src='assets/icon-192.png' alt='File'/> upload.docx <button class='fluent-button file-open'>Open</button></div>
        </div>
        <input type='file' id='file-upload' style='margin-top:1rem;'>
      `,
      settings: `
        <h2>Settings</h2>
        <div class='settings-panel'>
          <label>Theme: <select id='theme-select'><option value='light'>Light</option><option value='dark'>Dark</option></select></label><br/>
          <label>Language: <select><option>English</option><option>French</option></select></label>
        </div>
      `,
      'task-manager': `
        <h2>Task Manager</h2>
        <table class='task-table'>
          <tr><th>App</th><th>Status</th><th>Action</th></tr>
          <tr><td>Devices</td><td>Running</td><td><button class='fluent-button task-end' data-app='devices'>End</button></td></tr>
          <tr><td>Compliance</td><td>Running</td><td><button class='fluent-button task-end' data-app='compliance'>End</button></td></tr>
        </table>
      `,
      'help-support': `
        <h2>Help & Support</h2>
        <ul>
          <li><a href='#' class='help-link'>User Guide</a></li>
          <li><a href='#' class='help-link'>FAQ</a></li>
          <li><a href='#' class='help-link'>Contact Support</a></li>
        </ul>
        <div class='help-content' style='margin-top:1rem;'></div>
      `,
      calendar: `
        <h2>Calendar</h2>
        <div class='calendar-widget'>
          <input type='date' id='calendar-date' value='2025-04-27'>
          <div class='calendar-events'>No events for today.</div>
          <input type='text' id='event-input' placeholder='Add event...'>
          <button class='fluent-button' id='add-event'>Add</button>
        </div>
      `,
      chat: `
        <h2>Chat</h2>
        <div class='chat-box'>
          <div class='chat-messages'><div class='chat-message'><b>Admin:</b> Welcome to CMDIQ chat!</div></div>
          <input type='text' placeholder='Type a message...' class='chat-input'/>
          <button class='fluent-button' id='send-chat'>Send</button>
        </div>
      `,
      'activity-log': `
        <h2>Activity Log</h2>
        <ul class='activity-list'>
          <li>Login: johndoe (today)</li>
          <li>Device 1 restarted</li>
          <li>Policy updated</li>
        </ul>
        <button class='fluent-button' id='clear-activity'>Clear Log</button>
      `,
      'app-store': `
        <h2>App Store</h2>
        <div class='store-list'>
          <div class='store-app'><img src='assets/icon-192.png'/> <span>Weather Widget</span> <button class='fluent-button store-install'>Install</button></div>
          <div class='store-app'><img src='assets/icon-192.png'/> <span>Notes</span> <button class='fluent-button store-install'>Install</button></div>
        </div>
      `,
      terminal: `
        <h2>Terminal</h2>
        <div class='terminal-window'><pre id='terminal-output'>C:\Users\johndoe&gt;_</pre><input type='text' id='terminal-input' class='terminal-input' placeholder='Type a command...'></div>
      `,
      widgets: `
        <h2>Widgets</h2>
        <div class='widget-area'>
          <div class='widget weather-widget'>Weather: 22°C, Sunny</div>
          <div class='widget notes-widget'>Notes: <br/>- Meeting at 3pm</div>
        </div>
      `,
      'intune': `
        <h2>Microsoft Intune</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Intune' class='integration-icon' />
            <span>Device Management (via Microsoft Graph API)</span>
          </div>
          <ul>
            <li>Compliance: <span class='status-online'>Compliant</span></li>
            <li>Device: Surface Pro 9 (Windows 11)</li>
            <li>Remote Action: <button class='fluent-button'>Restart</button> <button class='fluent-button'>Wipe</button></li>
          </ul>
        </div>
      `,
      'jamf': `
        <h2>Jamf Pro</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Jamf' class='integration-icon' />
            <span>Apple Device Management (via Jamf Pro API)</span>
          </div>
          <ul>
            <li>Device: MacBook Pro (macOS Sonoma)</li>
            <li>Policy: FileVault enabled</li>
            <li>Remote Action: <button class='fluent-button'>Lock</button> <button class='fluent-button'>Wipe</button></li>
          </ul>
        </div>
      `,
      'nexthink': `
        <h2>Nexthink</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Nexthink' class='integration-icon' />
            <span>End-user IT Analytics (via Nexthink API)</span>
          </div>
          <ul>
            <li>Experience Score: <span class='status-online'>8.7 / 10</span></li>
            <li>Device Health: <span class='status-online'>Good</span></li>
            <li>Compliance: <span class='status-online'>Compliant</span></li>
          </ul>
        </div>
      `,
      'logmein': `
        <h2>LogMeIn Rescue</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='LMI' class='integration-icon' />
            <span>Remote Desktop Control (via LMI Rescue API)</span>
          </div>
          <ul>
            <li>Session: <span class='status-online'>Active</span></li>
            <li><button class='fluent-button'>Launch Session</button> <button class='fluent-button'>Track</button></li>
          </ul>
        </div>
      `,
      'azuread': `
        <h2>Azure Active Directory</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Azure AD' class='integration-icon' />
            <span>User Management & SSO (via Microsoft Graph API)</span>
          </div>
          <ul>
            <li>User: johndoe@contoso.com</li>
            <li>Role: Global Admin</li>
            <li>Authentication: <span class='status-online'>OAuth 2.0 SSO</span></li>
          </ul>
        </div>
      `,
      'splunk': `
        <h2>Splunk</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Splunk' class='integration-icon' />
            <span>Log Monitoring & Security (via Splunk REST API)</span>
          </div>
          <ul>
            <li>Device Events: <span class='status-online'>124</span></li>
            <li>User Events: <span class='status-online'>12</span></li>
            <li>Security Insights: <span class='status-online'>No threats</span></li>
          </ul>
        </div>
      `,
      'powerbi': `
        <h2>Power BI Embedded</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='Power BI' class='integration-icon' />
            <span>IT Dashboards (via Power BI APIs)</span>
          </div>
          <div class='powerbi-mock'>
            <div class='powerbi-chart'>[Mock Power BI Chart]</div>
            <button class='fluent-button'>Refresh</button>
          </div>
        </div>
      `,
      'servicenow': `
        <h2>ServiceNow</h2>
        <div class='integration-mock'>
          <div class='integration-header'>
            <img src='assets/icon-192.png' alt='ServiceNow' class='integration-icon' />
            <span>ITSM Tickets (via ServiceNow REST API)</span>
          </div>
          <ul>
            <li>Open Incidents: <span class='status-online'>3</span></li>
            <li><button class='fluent-button'>Create Ticket</button> <button class='fluent-button'>View All</button></li>
          </ul>
        </div>
      `
    };
    win = document.createElement('div');
    win.className = 'window active';
    win.setAttribute('data-app', app);
    win.style.top = Math.random() * 200 + 60 + 'px';
    win.style.left = Math.random() * 300 + 120 + 'px';
    win.style.width = '80%';
    win.style.height = '80%';
    win.innerHTML = `
      <div class="window-titlebar">
        <span class="window-title">${app.charAt(0).toUpperCase() + app.slice(1)}</span>
        <div class="window-controls">
          <button class="win-btn minimize" title="Minimize"></button>
          <button class="win-btn maximize" title="Maximize"></button>
          <button class="win-btn close" title="Close"></button>
        </div>
      </div>
      <div class="window-content">
        ${contentMap[app] || '<p>App window</p>'}
      </div>
    `;
    windowsArea.appendChild(win);
    makeDraggable(win);
    setupAppWindowControls(win, app);
    focusWindow(win);
    addTaskbarButton(app);
    win.addEventListener('mousedown', () => focusWindow(win));
    injectMockDataToAppWindow(win);
    setTimeout(() => enhanceAppWindow(win, app), 0);
  }

  function setupAppWindowControls(win, app) {
    const minimizeBtn = win.querySelector('.win-btn.minimize');
    const maximizeBtn = win.querySelector('.win-btn.maximize');
    const closeBtn = win.querySelector('.win-btn.close');
    minimizeBtn.onclick = () => {
      win.classList.add('minimized');
      updateTaskbarButtonState(app, false);
    };
    maximizeBtn.onclick = () => {
      win.classList.toggle('maximized');
      focusWindow(win);
    };
    closeBtn.onclick = () => {
      win.remove();
      removeTaskbarButton(app);
    };
  }

  function addTaskbarButton(app) {
    const taskbar = document.querySelector('.taskbar-apps');
    if (!taskbar) return;
    if (taskbar.querySelector('[data-app="' + app + '"]')) return;
    const btn = document.createElement('button');
    btn.className = 'taskbar-app-btn active';
    btn.setAttribute('data-app', app);
    btn.innerHTML = `<img src="assets/icon-192.png" alt="${app}" style="width:20px;height:20px;vertical-align:middle;"> <span>${app.charAt(0).toUpperCase() + app.slice(1)}</span>`;
    btn.onclick = () => {
      const win = document.querySelector('.window[data-app="' + app + '"]');
      if (win) {
        if (win.classList.contains('minimized')) {
          win.classList.remove('minimized');
        }
        focusWindow(win);
      } else {
        createWindow(app);
      }
      updateTaskbarButtonState(app, true);
    };
    taskbar.appendChild(btn);
  }

  function removeTaskbarButton(app) {
    const btn = document.querySelector('.taskbar-app-btn[data-app="' + app + '"]');
    if (btn) btn.remove();
  }

  function updateTaskbarButtonState(app, active) {
    const btn = document.querySelector('.taskbar-app-btn[data-app="' + app + '"]');
    if (btn) {
      if (active) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  function makeDraggable(win) {
    const titlebar = win.querySelector('.window-titlebar');
    let isDragging = false, offsetX = 0, offsetY = 0;
    titlebar.onmousedown = function (e) {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      document.body.style.userSelect = 'none';
    };
    document.onmousemove = function (e) {
      if (!isDragging) return;
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    };
    document.onmouseup = function () {
      isDragging = false;
      document.body.style.userSelect = '';
    };
  }

  // Notification popup system
  function showNotification(message, type = 'info') {
    let notif = document.createElement('div');
    notif.className = 'cmdiq-notification ' + type;
    notif.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 400);
    }, 3500);
  }

  // Add notification triggers for remote actions
  if (document.querySelector('.remote-actions')) {
    document.querySelectorAll('.remote-actions button').forEach(btn => {
      btn.onclick = () => {
        showNotification(`${btn.textContent} sent!`, 'success');
      };
    });
  }

  // Desktop icon click
  Array.from(document.querySelectorAll('.desktop-icon')).forEach(icon => {
    icon.onclick = () => createWindow(icon.getAttribute('data-app'));
  });

  // Start menu logic
  const startBtn = document.getElementById('start-button');
  const startMenu = document.getElementById('start-menu');
  if (startBtn && startMenu) {
    startBtn.onclick = () => {
      startMenu.classList.toggle('hidden');
    };
    document.addEventListener('click', e => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.classList.add('hidden');
      }
    });
    startMenu.querySelectorAll('li[data-app]').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        createWindow(link.getAttribute('data-app'));
        startMenu.classList.add('hidden');
      };
    });
  }

  // Taskbar clock
  function updateClock() {
    const clock = document.getElementById('taskbar-clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Add interactivity for new modules after window creation
  function enhanceAppWindow(win, app) {
    if (!win) return;
    // Notifications Center: Dismiss and Clear All
    if (app === 'notifications-center') {
      win.querySelectorAll('.notif-dismiss').forEach(btn => {
        btn.onclick = () => btn.parentElement.remove();
      });
      const clearBtn = win.querySelector('#clear-notifs');
      if (clearBtn) clearBtn.onclick = () => win.querySelector('.notif-list').innerHTML = '';
    }
    // File Explorer: Open file
    if (app === 'file-explorer') {
      win.querySelectorAll('.file-open').forEach(btn => {
        btn.onclick = () => showNotification('Opening file: ' + btn.parentElement.textContent.trim(), 'info');
      });
      const upload = win.querySelector('#file-upload');
      if (upload) upload.onchange = () => showNotification('File uploaded: ' + upload.files[0]?.name, 'success');
    }
    // Settings: Theme switch
    if (app === 'settings') {
      const themeSel = win.querySelector('#theme-select');
      if (themeSel) themeSel.onchange = e => {
        document.body.classList.toggle('dark-theme', themeSel.value === 'dark');
        showNotification('Theme changed to ' + themeSel.value, 'info');
      };
    }
    // Task Manager: End app
    if (app === 'task-manager') {
      win.querySelectorAll('.task-end').forEach(btn => {
        btn.onclick = () => {
          const appToEnd = btn.getAttribute('data-app');
          const appWin = document.querySelector('.window[data-app="' + appToEnd + '"]');
          if (appWin) appWin.remove();
          showNotification('Ended ' + appToEnd, 'success');
        };
      });
    }
    // Help: Show help content
    if (app === 'help-support') {
      win.querySelectorAll('.help-link').forEach(link => {
        link.onclick = e => {
          e.preventDefault();
          win.querySelector('.help-content').textContent = 'Help content for ' + link.textContent;
        };
      });
    }
    // Calendar: Add event
    if (app === 'calendar') {
      const addBtn = win.querySelector('#add-event');
      const input = win.querySelector('#event-input');
      const eventsDiv = win.querySelector('.calendar-events');
      if (addBtn && input && eventsDiv) {
        addBtn.onclick = () => {
          if (input.value) {
            eventsDiv.innerHTML += `<div>${input.value}</div>`;
            input.value = '';
          }
        };
      }
    }
    // Chat: Send message
    if (app === 'chat') {
      const sendBtn = win.querySelector('#send-chat');
      const input = win.querySelector('.chat-input');
      const messages = win.querySelector('.chat-messages');
      if (sendBtn && input && messages) {
        sendBtn.onclick = () => {
          if (input.value) {
            messages.innerHTML += `<div class='chat-message'><b>You:</b> ${input.value}</div>`;
            input.value = '';
          }
        };
      }
    }
    // Activity Log: Clear log
    if (app === 'activity-log') {
      const clearBtn = win.querySelector('#clear-activity');
      if (clearBtn) clearBtn.onclick = () => win.querySelector('.activity-list').innerHTML = '';
    }
    // App Store: Install
    if (app === 'app-store') {
      win.querySelectorAll('.store-install').forEach(btn => {
        btn.onclick = () => showNotification('Installed: ' + btn.parentElement.textContent.trim(), 'success');
      });
    }
    // Terminal: Simulate command
    if (app === 'terminal') {
      const termInput = win.querySelector('#terminal-input');
      const termOut = win.querySelector('#terminal-output');
      if (termInput && termOut) {
        termInput.onkeydown = e => {
          if (e.key === 'Enter') {
            termOut.innerHTML += '\n' + termInput.value + '\nC:\\Users\\johndoe&gt;_';
            termInput.value = '';
          }
        };
      }
    }
    // User Management: Logout
    if (app === 'user-management') {
      const logoutBtn = win.querySelector('#logout-btn');
      if (logoutBtn) logoutBtn.onclick = () => showNotification('Logged out!', 'info');
    }
  }
});
