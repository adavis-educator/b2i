// main.js — UI orchestrator for NBA GM Simulation
// Wires together: screens, tabs, GameState, Claude API calls, and all DOM interactions

const App = (() => {

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let selectedTeamId = null;
  let selectedLeadersTab = 'ppg';
  let tradeTargetTeam = null;
  let mySelectedPlayers = [];
  let theirSelectedPlayers = [];
  let tradeResponseData = null;
  let simulationLocked = false;

  // ─── SCREEN MANAGEMENT ────────────────────────────────────────────────────
  const SCREENS = ['screen-splash', 'screen-team-select', 'screen-gm-name',
                   'screen-briefing', 'screen-dashboard', 'screen-load',
                   'screen-champion', 'screen-fired',
                   'screen-playoffs', 'screen-offseason', 'screen-draft-day'];

  function showScreen(id) {
    SCREENS.forEach(s => {
      const el = document.getElementById(s);
      if (el) {
        el.classList.toggle('active', s === id);
        el.style.display = (s === id) ? 'flex' : 'none';
      }
    });
  }

  // ─── THEME ────────────────────────────────────────────────────────────────
  function applyTeamTheme(teamId) {
    const team = NBA_TEAMS[teamId];
    if (!team) return;
    const root = document.documentElement;
    root.style.setProperty('--team-primary', team.colors.primary);
    root.style.setProperty('--team-secondary', team.colors.secondary);
    root.style.setProperty('--team-glow', hexToRgba(team.colors.primary, 0.12));
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ─── TEAM SELECTION SCREEN ────────────────────────────────────────────────
  function buildTeamGrid() {
    const grid = document.getElementById('team-grid');
    grid.innerHTML = '';
    TEAM_IDS.forEach(tid => {
      const team = NBA_TEAMS[tid];
      const card = document.createElement('div');
      card.className = 'team-card';
      card.dataset.team = tid;
      card.style.setProperty('--card-color', team.colors.primary);
      card.innerHTML = `
        <div class="card-abbr">${team.abbr}</div>
        <div class="card-fullname">${team.city} ${team.name}</div>
        <div class="card-difficulty ${team.difficulty}">${team.difficulty}</div>
        <div class="card-flavor">${team.flavor}</div>
      `;
      card.addEventListener('click', () => selectTeam(tid));
      grid.appendChild(card);
    });
  }

  function selectTeam(tid) {
    selectedTeamId = tid;
    document.querySelectorAll('.team-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.team === tid);
    });
    const team = NBA_TEAMS[tid];
    document.getElementById('selected-team-label').textContent =
      `${team.city} ${team.name} · ${team.difficulty.toUpperCase()}`;
    document.getElementById('btn-confirm-team').disabled = false;
    applyTeamTheme(tid);
  }

  // ─── GM NAME SCREEN ───────────────────────────────────────────────────────
  function showGmNameScreen() {
    const team = NBA_TEAMS[selectedTeamId];
    document.getElementById('gm-name-abbr').textContent = team.abbr;
    document.getElementById('gm-name-abbr').style.color = team.colors.primary;
    showScreen('screen-gm-name');
  }

  // ─── BRIEFING SCREEN ──────────────────────────────────────────────────────
  async function showBriefingScreen() {
    const gmName = document.getElementById('input-gm-name').value.trim() || 'General Manager';
    GameState.init(selectedTeamId, gmName);
    applyTeamTheme(selectedTeamId);

    const team = NBA_TEAMS[selectedTeamId];
    document.getElementById('briefing-title').textContent = `Welcome to the ${team.name}`;
    document.getElementById('briefing-sig').textContent =
      `— ${team.ownerName}, Owner · ${team.fullName}`;

    showScreen('screen-briefing');
    document.getElementById('btn-begin-season').disabled = true;

    const bodyEl = document.getElementById('briefing-body');
    bodyEl.className = 'briefing-body loading';
    bodyEl.innerHTML = `<span class="loading-dots">Connecting with ownership</span>`;

    const memo = await ClaudeAPI.generateOwnerMemo();
    bodyEl.className = 'briefing-body';
    bodyEl.innerHTML = memo.replace(/\n/g, '<br/>');
    document.getElementById('btn-begin-season').disabled = false;
  }

  // ─── DASHBOARD INIT ───────────────────────────────────────────────────────
  function showDashboard() {
    showScreen('screen-dashboard');
    refreshDashboard();
    switchTab('overview');
    populateTradeTeamDropdown();
    renderProspectGrid();
  }

  function refreshDashboard() {
    const state = GameState.getState();
    const team = GameState.getTeam();

    // Header
    document.getElementById('dash-team-abbr').textContent = team.abbr;
    document.getElementById('dash-team-abbr').style.color = `var(--team-primary)`;
    document.getElementById('dash-season-label').textContent =
      `SEASON ${state.meta.season} · ${GameState.getSeasonYear()}–${GameState.getSeasonYear() + 1}`;
    document.getElementById('dash-phase-label').textContent = formatPhase(state.meta.phase);
    document.getElementById('dash-record').textContent = GameState.getRecord();
    document.getElementById('games-remaining-label').textContent =
      `Games (${GameState.GAMES_PER_SEASON - state.meta.gamesPlayed} left)`;

    const seed = getConferenceSeed();
    document.getElementById('dash-seed').textContent = seed ? `${team.conference} Seed #${seed}` : '—';

    // Pressure meter
    updatePressureMeter();

    // Cap bar (sidebar)
    updateCapBar();

    // Draft pick sidebar
    updateDraftSidebar();

    // Sidebar panels
    renderGameLog();
    renderInjuryReport();
    renderLeagueLeaders();

    // Check for phase-specific sim controls
    const inRegSeason = state.meta.phase === 'regular_season';
    ['btn-sim-1', 'btn-sim-5', 'btn-sim-10'].forEach(id => {
      document.getElementById(id).disabled = !inRegSeason || simulationLocked;
    });
  }

  // ─── TAB SWITCHING ────────────────────────────────────────────────────────
  function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const content = document.getElementById(`tab-${tab}`);
    if (content) content.classList.add('active');

    const navBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Render tab-specific content
    if (tab === 'overview') renderOverviewTab();
    if (tab === 'roster') renderRosterTab();
    if (tab === 'standings') renderStandingsTab();
    if (tab === 'free-agents') renderFreeAgentsTab();
    if (tab === 'draft') renderProspectGrid();
    if (tab === 'history') renderHistoryTab();
    if (tab === 'trade') renderTradeTab();
  }

  // ─── OVERVIEW TAB ─────────────────────────────────────────────────────────
  function renderOverviewTab() {
    const state = GameState.getState();
    const team = GameState.getTeam();

    document.getElementById('overview-team-name').textContent = `${team.city} ${team.name}`;
    document.getElementById('overview-subtitle').textContent =
      `General Manager: ${state.meta.gmName} · Season ${state.meta.season}`;

    const record = GameState.getRecord();
    document.getElementById('ov-record').textContent = record;
    document.getElementById('ov-seed').textContent = `Conference Seed: ${getConferenceSeed() || '—'}`;

    const cap = GameState.getCapSpace();
    const payroll = GameState.getTotalSalary();
    document.getElementById('ov-cap').textContent = `$${cap.toFixed(0)}M`;
    document.getElementById('ov-payroll').textContent = `Payroll: $${payroll.toFixed(1)}M / $${GameState.SALARY_CAP}M`;

    const pressure = GameState.getPressure();
    const ovPressure = document.getElementById('ov-pressure');
    ovPressure.textContent = pressure;
    ovPressure.style.color = pressure >= 75 ? 'var(--red)' : pressure >= 50 ? 'var(--yellow)' : 'var(--green)';

    const streak = state.team.streak;
    document.getElementById('ov-streak').textContent = streak > 0
      ? `W${streak} streak` : streak < 0 ? `L${Math.abs(streak)} streak` : 'No streak';

    // Top 8 roster
    const top8 = [...state.roster].sort((a, b) => b.ovr - a.ovr).slice(0, 8);
    const tbody = document.getElementById('overview-roster-body');
    tbody.innerHTML = top8.map(p => `
      <tr>
        <td class="player-name">${p.name}${p.injured ? ' <span style="color:var(--red);font-size:10px;">●</span>' : ''}</td>
        <td><span class="player-pos">${p.pos}</span></td>
        <td class="center"><span class="ovr-badge ${ovrClass(p.ovr)}">${p.ovr}</span></td>
        <td class="stat-cell right">$${p.salary.toFixed(1)}M</td>
        <td class="stat-cell right center">${p.contract_years}yr</td>
        <td><div style="display:flex;align-items:center;gap:6px;">
          <div style="width:60px;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
            <div style="width:${p.morale}%;height:100%;background:${moraleColor(p.morale)};border-radius:2px;transition:width 0.4s;"></div>
          </div>
          <span class="mono" style="font-size:10px;color:var(--text-muted);">${p.morale}</span>
        </div></td>
      </tr>
    `).join('');
  }

  // ─── ROSTER TAB ───────────────────────────────────────────────────────────
  function renderRosterTab() {
    const state = GameState.getState();
    const roster = [...state.roster].sort((a, b) => b.ovr - a.ovr);
    const payroll = GameState.getTotalSalary();
    const cap = GameState.SALARY_CAP;

    document.getElementById('roster-cap-summary').textContent =
      `Payroll: $${payroll.toFixed(1)}M / $${cap}M cap  ·  Cap space: $${(cap - payroll).toFixed(1)}M  ·  ${roster.length} players`;

    const tbody = document.getElementById('roster-body');
    tbody.innerHTML = roster.map(p => `
      <tr>
        <td class="player-name">${p.name}${p.injured ? ' <span style="color:var(--red);font-size:9px;"> INJ</span>' : ''}</td>
        <td><span class="player-pos">${p.pos}</span></td>
        <td class="stat-cell center">${p.age}</td>
        <td class="center"><span class="ovr-badge ${ovrClass(p.ovr)}">${p.ovr}</span></td>
        <td class="stat-cell center">${p.scoring}</td>
        <td class="stat-cell center">${p.playmaking}</td>
        <td class="stat-cell center">${p.defense}</td>
        <td class="stat-cell center">${p.athleticism}</td>
        <td class="stat-cell center">${p.iq}</td>
        <td class="stat-cell center" style="color:${potentialColor(p.potential)}">${p.potential}</td>
        <td class="stat-cell right">$${p.salary.toFixed(1)}M</td>
        <td class="stat-cell center">${p.contract_years}yr</td>
        <td>${moraleTag(p.morale)}</td>
        <td><button class="action-btn danger" onclick="App.releasePlayer('${p.id}')">Cut</button></td>
      </tr>
    `).join('');
  }

  // ─── STANDINGS TAB ────────────────────────────────────────────────────────
  function renderStandingsTab() {
    const state = GameState.getState();
    document.getElementById('standings-subtitle').textContent =
      `Season ${state.meta.season} · Week ${state.meta.week}`;

    const myTeamId = state.meta.teamId;
    const container = document.getElementById('standings-container');
    container.innerHTML = '';

    ['East', 'West'].forEach(conf => {
      const teams = GameState.getConferenceStandings(conf);
      const col = document.createElement('div');
      col.innerHTML = `<div class="standings-conf-title">${conf}ern Conference</div>`;
      const table = document.createElement('div');

      teams.forEach((t, i) => {
        const wins = t.wins || 0;
        const losses = t.losses || 0;
        const total = wins + losses;
        const pct = total > 0 ? (wins / total).toFixed(3).slice(1) : '.000';
        const row = document.createElement('div');
        row.className = `standings-row${t.teamId === myTeamId ? ' my-team' : ''}`;
        row.innerHTML = `
          <div class="standings-rank">${i + 1}</div>
          <div class="standings-team" style="color:${t.teamId === myTeamId ? 'var(--team-primary)' : 'inherit'}">
            ${NBA_TEAMS[t.teamId].city} ${NBA_TEAMS[t.teamId].name}
          </div>
          <div class="standings-wl">${wins}–${losses}</div>
          <div class="standings-pct">${pct}</div>
        `;
        table.appendChild(row);
      });

      col.appendChild(table);
      container.appendChild(col);
    });
  }

  // ─── FREE AGENTS TAB ──────────────────────────────────────────────────────
  function renderFreeAgentsTab() {
    const state = GameState.getState();
    const capSpace = GameState.getCapSpace();
    document.getElementById('fa-cap-label').textContent =
      `Cap space available: $${capSpace.toFixed(1)}M`;

    const fas = GameState.getTopFreeAgents(30);
    const tbody = document.getElementById('fa-body');

    if (!fas.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Free agents are available during the offseason</td></tr>`;
      return;
    }

    tbody.innerHTML = fas.map(p => `
      <tr>
        <td class="player-name">${p.name}</td>
        <td><span class="player-pos">${p.pos}</span></td>
        <td class="stat-cell center">${p.age}</td>
        <td class="center"><span class="ovr-badge ${ovrClass(p.ovr)}">${p.ovr}</span></td>
        <td class="stat-cell right">$${p.salary.toFixed(1)}M</td>
        <td class="stat-cell center">${p.contract_years}yr</td>
        <td>
          <button class="action-btn" onclick="App.signFreeAgent('${p.id}')"
            ${p.salary > capSpace ? 'disabled title="Insufficient cap space"' : ''}>
            Sign
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ─── DRAFT TAB ────────────────────────────────────────────────────────────
  function renderProspectGrid() {
    const state = GameState.getState();
    const pickPos = GameState.getDraftPickPosition();

    document.getElementById('draft-pick-label').textContent =
      `Projected pick: #${pickPos} · Scouting actions: ${state.scoutingActionsLeft}`;
    document.getElementById('scouting-actions-left').textContent = state.scoutingActionsLeft;

    const grid = document.getElementById('prospect-grid');
    grid.innerHTML = '';

    state.draftClass.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'prospect-card';
      card.dataset.id = p.id;

      if (p.scouted) {
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span class="ovr-badge ${ovrClass(p.ratings.ovr)}">${p.ratings.ovr}</span>
            <div>
              <div class="prospect-name">${p.name}</div>
              <div class="prospect-meta">${p.pos} · ${p.school} · Age ${p.age}</div>
            </div>
          </div>
          <span class="prospect-tier ${p.tier}">${p.tier.replace('-', ' ')}</span>
          <div class="scouted-overlay">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">
              <div>SCR <span style="color:var(--text-stat)">${p.ratings.scoring}</span></div>
              <div>PLY <span style="color:var(--text-stat)">${p.ratings.playmaking}</span></div>
              <div>DEF <span style="color:var(--text-stat)">${p.ratings.defense}</span></div>
              <div>ATH <span style="color:var(--text-stat)">${p.ratings.athleticism}</span></div>
              <div>IQ <span style="color:var(--text-stat)">${p.ratings.iq}</span></div>
              <div>POT <span style="color:${potentialColor(p.ratings.potential)}">${p.ratings.potential}</span></div>
            </div>
            ${p.scoutedReport ? `<div style="margin-top:8px;font-size:11px;color:var(--text-secondary);line-height:1.5;">${p.scoutedReport.headline}</div>` : ''}
          </div>
        `;
        card.addEventListener('click', () => showScoutingReport(p));
      } else {
        card.innerHTML = `
          <div>
            <div class="prospect-name">${p.name}</div>
            <div class="prospect-meta">${p.pos} · ${p.school} · Age ${p.age}</div>
          </div>
          <span class="prospect-tier ${p.tier}">${p.tier.replace('-', ' ')}</span>
          <div style="margin-top:10px;">
            <div class="hidden-ratings">
              ${Array(7).fill('<div class="hidden-rating-block"></div>').join('')}
            </div>
            <button class="action-btn" style="margin-top:10px;width:100%;"
              onclick="event.stopPropagation();App.scoutProspect('${p.id}')">
              Scout (1 action)
            </button>
          </div>
        `;
      }

      grid.appendChild(card);
    });
  }

  // ─── HISTORY TAB ──────────────────────────────────────────────────────────
  function renderHistoryTab() {
    const state = GameState.getState();

    const seasonsEl = document.getElementById('history-seasons');
    if (!state.seasonHistory.length) {
      seasonsEl.innerHTML = '<div class="empty-state">No seasons completed yet</div>';
    } else {
      seasonsEl.innerHTML = state.seasonHistory.map(s => {
        const badgeClass = s.result === 'champion' ? 'champion' : s.result.includes('miss') ? 'missed' : 'playoffs';
        const badge = { champion: '🏆 Champion', finalist: 'Finals', conf_finals: 'Conf Finals', playoffs: 'Playoffs', missed_playoffs: 'Missed Playoffs' }[s.result] || s.result;
        return `
          <div class="history-season">
            <div class="history-season-num">S${s.season}</div>
            <div>
              <div style="font-size:16px;font-weight:600;">${s.wins}–${s.losses}</div>
              <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);">
                Pressure: ${s.pressure}
              </div>
            </div>
            <div class="history-result-badge ${badgeClass}">${badge}</div>
          </div>
        `;
      }).join('');
    }

    const tradesEl = document.getElementById('history-trades');
    if (!state.tradeHistory.length) {
      tradesEl.innerHTML = '<div class="empty-state">No trades completed yet</div>';
    } else {
      tradesEl.innerHTML = state.tradeHistory.map(t => `
        <div class="panel" style="padding: 12px 16px; margin-bottom: 8px;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-bottom:6px;">
            SEASON ${t.season} · WEEK ${t.week} · WITH ${NBA_TEAMS[t.otherTeam]?.abbr || t.otherTeam}
          </div>
          <div style="display:flex;gap:16px;">
            <div style="flex:1;">
              <div style="font-size:10px;color:var(--red);margin-bottom:4px;font-family:var(--font-mono);">SENT</div>
              ${t.gave.map(n => `<div style="font-size:12px;">${n}</div>`).join('')}
            </div>
            <div style="color:var(--text-muted);">⇄</div>
            <div style="flex:1;">
              <div style="font-size:10px;color:var(--green);margin-bottom:4px;font-family:var(--font-mono);">RECEIVED</div>
              ${t.received.map(n => `<div style="font-size:12px;">${n}</div>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // ─── TRADE TAB ────────────────────────────────────────────────────────────
  function renderTradeTab() {
    const state = GameState.getState();
    const deadline = GameState.TRADE_DEADLINE_GAME;
    const gamesPlayed = state.meta.gamesPlayed;

    let label = `Trade Deadline: Game ${deadline}`;
    if (gamesPlayed >= deadline) label = 'Trade Deadline Passed — Trades resume in the offseason';
    document.getElementById('trade-deadline-label').textContent = label;

    document.getElementById('trade-my-team-label').textContent =
      `Your Offer (${NBA_TEAMS[state.meta.teamId]?.abbr})`;

    renderIncomingOffers();
  }

  function renderIncomingOffers() {
    const state = GameState.getState();
    const body = document.getElementById('incoming-offers-body');
    if (!state.incomingTradeOffers?.length) {
      body.innerHTML = '<div class="empty-state">No active trade offers</div>';
      return;
    }
    body.innerHTML = state.incomingTradeOffers.map((offer, i) => `
      <div style="padding: 12px; border-bottom: 1px solid var(--border);">
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-bottom:6px;">
          OFFER FROM ${NBA_TEAMS[offer.fromTeam]?.fullName || offer.fromTeam}
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">${offer.narrative}</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="App.acceptIncomingOffer(${i})">Accept</button>
          <button class="btn btn-ghost btn-sm" onclick="App.declineIncomingOffer(${i})">Decline</button>
        </div>
      </div>
    `).join('');
  }

  function populateTradeTeamDropdown() {
    const state = GameState.getState();
    const sel = document.getElementById('trade-target-team');
    sel.innerHTML = '<option value="">Select a team...</option>';
    TEAM_IDS.filter(t => t !== state.meta.teamId).forEach(tid => {
      const opt = document.createElement('option');
      opt.value = tid;
      opt.textContent = NBA_TEAMS[tid].fullName;
      sel.appendChild(opt);
    });
  }

  // ─── SIDEBAR PANELS ───────────────────────────────────────────────────────
  function renderGameLog() {
    const state = GameState.getState();
    const body = document.getElementById('game-log-body');
    const entries = state.gameLog.slice(0, 10);
    if (!entries.length) {
      body.innerHTML = '<div class="empty-state" style="font-size:10px;padding:8px 0;">Season hasn\'t started</div>';
      return;
    }
    body.innerHTML = entries.map(g => `
      <div class="game-log-entry">
        <span class="game-result ${g.result}">${g.result}</span>
        <span class="game-opp">${NBA_TEAMS[g.opponent]?.abbr || g.opponent}</span>
        <span class="game-score">${g.score}</span>
      </div>
    `).join('');
  }

  function renderInjuryReport() {
    const injuries = GameState.getActiveInjuries();
    const body = document.getElementById('injury-report-body');
    if (!injuries.length) {
      body.innerHTML = '<div class="empty-state" style="font-size:10px;padding:8px 0;">All players healthy</div>';
      return;
    }
    body.innerHTML = injuries.map(inj => `
      <div class="injury-entry">
        <div class="injury-dot"></div>
        <div>
          <div class="injury-name">${inj.playerName}</div>
          <div class="injury-type">${inj.type}</div>
        </div>
        <div class="injury-weeks">${inj.weeksRemaining}w</div>
      </div>
    `).join('');
  }

  function renderLeagueLeaders() {
    GameState.updateLeagueLeaders();
    const state = GameState.getState();
    renderLeadersForStat(selectedLeadersTab);
  }

  function renderLeadersForStat(stat) {
    const state = GameState.getState();
    const leaders = state.leagueLeaders[stat] || [];
    const list = document.getElementById('leaders-list');
    list.innerHTML = leaders.map((l, i) => `
      <div class="leader-row">
        <div class="leader-rank">${i + 1}</div>
        <div class="leader-name ${l.isMyPlayer ? 'mine' : ''}">${l.name}</div>
        <div class="leader-team">${l.team}</div>
        <div class="leader-stat">${l.value}</div>
      </div>
    `).join('');
  }

  function updatePressureMeter() {
    const pressure = GameState.getPressure();
    const bar = document.getElementById('pressure-bar');
    const pctEl = document.getElementById('pressure-pct');
    bar.style.width = `${pressure}%`;
    bar.style.background = pressure >= 75 ? 'var(--pressure-danger)'
      : pressure >= 50 ? 'var(--pressure-warn)'
      : 'var(--pressure-safe)';
    pctEl.textContent = `${pressure}%`;
    pctEl.style.color = pressure >= 75 ? 'var(--red)' : pressure >= 50 ? 'var(--yellow)' : 'var(--green)';
  }

  function updateCapBar() {
    const payroll = GameState.getTotalSalary();
    const cap = GameState.SALARY_CAP;
    const luxury = GameState.LUXURY_TAX;
    const pct = Math.min(100, (payroll / (cap * 1.4)) * 100);

    document.getElementById('cap-bar').style.width = `${pct}%`;
    document.getElementById('sidebar-payroll-label').textContent = `$${payroll.toFixed(1)}M`;
    document.getElementById('cap-space-sidebar').textContent =
      payroll > cap ? `⚠ Over Cap by $${(payroll - cap).toFixed(1)}M`
        : `Cap Space: $${(cap - payroll).toFixed(1)}M`;

    const luxuryPct = (luxury / (cap * 1.4)) * 100;
    document.getElementById('luxury-marker').style.left = `${luxuryPct}%`;
  }

  function updateDraftSidebar() {
    const pos = GameState.getDraftPickPosition();
    const state = GameState.getState();
    document.getElementById('sidebar-pick-num').textContent = `#${pos}`;
    document.getElementById('sidebar-pick-detail').textContent =
      `Projected · Based on current standings`;

    const assets = state.draftPicks.filter(p => p.team === state.meta.teamId);
    const assetsEl = document.getElementById('sidebar-pick-assets');
    assetsEl.innerHTML = assets.slice(0, 4).map(p =>
      `<div style="padding:3px 0;border-bottom:1px solid var(--border);">${p.year} ${NBA_TEAMS[p.originalTeam]?.abbr || p.team} ${p.round === 1 ? '1st' : '2nd'}</div>`
    ).join('');
  }

  // ─── SIMULATION ───────────────────────────────────────────────────────────
  async function simulateGames(count) {
    if (simulationLocked) return;
    const state = GameState.getState();

    if (state.meta.phase === 'offseason' || state.meta.phase === 'training_camp') {
      alert('Start the regular season first from the offseason screen.');
      return;
    }
    if (state.meta.phase !== 'regular_season') return;

    const remaining = GameState.GAMES_PER_SEASON - state.meta.gamesPlayed;
    const toSim = Math.min(count, remaining);
    if (toSim <= 0) {
      showEndOfSeasonFlow();
      return;
    }

    simulationLocked = true;
    setSimButtonsDisabled(true);

    try {
      GameState.simulateWeek(toSim);
      GameState.checkForInjury();

      refreshDashboard();
      switchTab('overview');

      // Show weekly pulse (non-blocking — just fires and continues)
      if (GameState.getState().meta.week % 3 === 0) {
        showWeeklyPulse(); // no await — pulse is informational, doesn't block sim
      }

      // Check if season over
      if (GameState.getState().meta.phase === 'playoffs' ||
          GameState.getState().meta.gamesPlayed >= GameState.GAMES_PER_SEASON) {
        showEndOfSeasonFlow();
        return;
      }

      // Pressure events
      const pressure = GameState.getPressure();
      const st = GameState.getState();
      if (pressure >= 90 && !st._pressConferenceShown) {
        st._pressConferenceShown = true;
        await showPressConference();
      } else if (pressure >= 75 && !st._warningShown) {
        st._warningShown = true;
        await showOwnerWarning();
      }

      // AI event (10% chance — less frequent, more meaningful)
      if (GameState.shouldFireEvent()) {
        await showAIEvent();
      }

      // Check fired
      if (GameState.getState().meta.phase === 'fired') {
        await showFiredScreen();
        return;
      }

      refreshDashboard();
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      simulationLocked = false;
      setSimButtonsDisabled(false);
    }
  }

  function setSimButtonsDisabled(disabled) {
    ['btn-sim-1', 'btn-sim-5', 'btn-sim-10'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = disabled;
    });
  }

  // ─── AI EVENT OVERLAY ─────────────────────────────────────────────────────
  async function showAIEvent() {
    return new Promise(async resolve => {
      const overlay = document.getElementById('overlay-event');
      const narrativeEl = document.getElementById('event-narrative-text');
      const choicesEl = document.getElementById('event-choices-container');

      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      narrativeEl.innerHTML = '<span class="loading-dots">Breaking news incoming</span>';
      choicesEl.innerHTML = '';

      const ctx = GameState.getEventContext();
      const eventData = await ClaudeAPI.generateEvent(ctx);

      narrativeEl.textContent = eventData.narrative;
      choicesEl.innerHTML = eventData.choices.map((c, i) => `
        <button class="choice-btn" data-idx="${i}">
          <span class="choice-label">${String.fromCharCode(65 + i)}</span>
          <span>${c}</span>
        </button>
      `).join('');

      choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const choice = eventData.choices[parseInt(btn.dataset.idx)];
          GameState.recordEventChoice(eventData.type, eventData.narrative, choice);
          overlay.classList.add('hidden');
          overlay.style.display = 'none';
          resolve();
        });
      });
    });
  }

  // ─── WEEKLY PULSE ─────────────────────────────────────────────────────────
  async function showWeeklyPulse() {
    return new Promise(async resolve => {
      const pulseEl = document.getElementById('overlay-pulse');
      const itemsEl = document.getElementById('pulse-items-container');
      const weekEl = document.getElementById('pulse-week-num');

      weekEl.textContent = GameState.getState().meta.week;
      pulseEl.classList.remove('hidden');
      pulseEl.style.display = 'block';
      itemsEl.innerHTML = '<span class="loading-dots">Checking with scouts</span>';

      const ctx = GameState.getEventContext();
      const pulseData = await ClaudeAPI.generateWeeklyPulse(ctx);

      itemsEl.innerHTML = pulseData.bullets.map(b => `
        <div class="pulse-item">
          <span class="pulse-bullet">▸</span>
          <span>${b}</span>
        </div>
      `).join('');

      const dismissBtn = document.getElementById('btn-dismiss-pulse');
      const dismiss = () => {
        pulseEl.classList.add('hidden');
        pulseEl.style.display = 'none';
        dismissBtn.removeEventListener('click', dismiss);
        resolve();
      };
      dismissBtn.addEventListener('click', dismiss);

      // Auto-dismiss after 8 seconds
      setTimeout(() => {
        if (!pulseEl.classList.contains('hidden')) dismiss();
      }, 8000);
    });
  }

  // ─── OWNER EVENTS ─────────────────────────────────────────────────────────
  async function showOwnerWarning() {
    const ctx = GameState.getEventContext();
    const memo = await ClaudeAPI.generateOwnerWarning(ctx);
    showEventOverlay('⚠ WARNING FROM OWNERSHIP', memo, ['Understood.'], () => {});
  }

  async function showPressConference() {
    const ctx = GameState.getEventContext();
    const data = await ClaudeAPI.generatePressConference(ctx);
    showEventOverlay('📰 PRESS CONFERENCE REQUIRED', data.setup, data.choices, (choice) => {
      GameState.recordEventChoice('press_conference', data.setup, choice);
      GameState.adjustPressure(-5, 'Handled press conference');
    });
  }

  function showEventOverlay(headline, body, choices, onChoice) {
    return new Promise(resolve => {
      const overlay = document.getElementById('overlay-event');
      const narrativeEl = document.getElementById('event-narrative-text');
      const choicesEl = document.getElementById('event-choices-container');

      // Override the BREAKING label temporarily
      const breakingLabel = overlay.querySelector('.breaking-label');
      const originalHTML = breakingLabel.innerHTML;
      breakingLabel.innerHTML = `<div class="breaking-pulse"></div> ${headline}`;

      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      narrativeEl.textContent = body;
      choicesEl.innerHTML = choices.map((c, i) => `
        <button class="choice-btn" data-idx="${i}">
          <span class="choice-label">${String.fromCharCode(65 + i)}</span>
          <span>${c}</span>
        </button>
      `).join('');

      choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          onChoice(choices[parseInt(btn.dataset.idx)]);
          overlay.classList.add('hidden');
          overlay.style.display = 'none';
          breakingLabel.innerHTML = originalHTML;
          resolve();
        });
      });
    });
  }

  // ─── END OF SEASON ────────────────────────────────────────────────────────
  async function showEndOfSeasonFlow() {
    simulationLocked = true;
    setSimButtonsDisabled(true);
    GameState.getState().meta.phase = 'playoffs';

    // Run the full interactive playoff bracket via Phases
    const result = await Phases.runPlayoffs();

    // Show exit interview
    const ctx = { ...GameState.getEventContext(), seasonResult: result };
    const exitInterview = await ClaudeAPI.generateExitInterview(ctx);

    if (result === 'champion') {
      const narrative = await ClaudeAPI.generateChampionshipNarrative(ctx);
      showChampionScreen(narrative);
    } else {
      GameState.endOfSeasonPressureAdjust(result);
      await showEventOverlay('EXIT INTERVIEW — ' + result.replace(/_/g, ' ').toUpperCase(),
        exitInterview, ['Begin Offseason'], () => {});

      if (GameState.getState().meta.phase === 'fired') {
        await showFiredScreen();
      } else {
        await Phases.runOffseason(result);
      }
    }
  }

  function showChampionScreen(narrative) {
    const team = GameState.getTeam();
    document.getElementById('champion-team-name').textContent = team.fullName.toUpperCase();
    document.getElementById('champion-title').style.color = team.colors.secondary;
    document.getElementById('champion-narrative').textContent = narrative;
    GameState.endOfSeasonPressureAdjust('champion');
    GameState.checkAchievements();
    showScreen('screen-champion');
  }

  async function showFiredScreen() {
    const state = GameState.getState();
    const ctx = GameState.getEventContext();
    const letter = await ClaudeAPI.generateFiredLetter(ctx);
    document.getElementById('fired-narrative').textContent = letter;
    document.getElementById('fired-stats').textContent =
      `${state.meta.season} seasons · ${state.team.wins}–${state.team.losses} record · ${state.team.championships} championships`;
    showScreen('screen-fired');
  }

  // ─── OFFSEASON FLOW ───────────────────────────────────────────────────────
  async function beginOffseason() {
    await Phases.runOffseason('champion');
  }

  // ─── SCOUTING ─────────────────────────────────────────────────────────────
  async function scoutProspect(prospectId) {
    const result = GameState.scoutProspect(prospectId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    const prospect = result.prospect;

    // Show loading state on card
    const card = document.querySelector(`.prospect-card[data-id="${prospectId}"]`);
    if (card) card.innerHTML = '<div class="empty-state" style="padding:20px;"><span class="loading-dots">Scouting</span></div>';

    const state = GameState.getState();
    const ctx = {
      prospect,
      teamNeeds: state.roster.slice(0, 5).map(p => p.pos).join(', '),
      pickPosition: GameState.getDraftPickPosition(),
    };
    const report = await ClaudeAPI.generateScoutingReport(ctx);
    prospect.scoutedReport = report;
    GameState.autoSave();

    renderProspectGrid();
  }

  async function showScoutingReport(prospect) {
    if (!prospect.scoutedReport) return;
    const r = prospect.scoutedReport;
    const body = `${r.headline}\n\nStrengths: ${r.strengths}\n\nWeaknesses: ${r.weaknesses}\n\nComp: ${r.comp}\n\nBottom Line: ${r.bottomLine}`;
    showEventOverlay(`SCOUTING REPORT — ${prospect.name}`, body, ['Close'], () => {});
  }

  // ─── FREE AGENCY ──────────────────────────────────────────────────────────
  function signFreeAgent(playerId) {
    const result = GameState.signFreeAgent(playerId);
    if (!result.success) {
      alert(result.reason);
      return;
    }
    refreshDashboard();
    renderFreeAgentsTab();
    renderRosterTab();
  }

  function releasePlayer(playerId) {
    if (!confirm('Release this player? They will become a free agent.')) return;
    GameState.releasePLayer(playerId);
    refreshDashboard();
    renderRosterTab();
  }

  // ─── TRADE SYSTEM ─────────────────────────────────────────────────────────
  async function proposeTrade() {
    const state = GameState.getState();
    const targetTeamId = document.getElementById('trade-target-team').value;
    if (!targetTeamId) { alert('Select a target team.'); return; }

    const deadline = GameState.TRADE_DEADLINE_GAME;
    if (state.meta.phase === 'regular_season' && state.meta.gamesPlayed > deadline) {
      alert('The trade deadline has passed. Trades resume in the offseason.');
      return;
    }

    if (!mySelectedPlayers.length && !theirSelectedPlayers.length) {
      alert('Select players to trade.');
      return;
    }

    const salaryCheck = GameState.checkSalaryMatch(mySelectedPlayers, theirSelectedPlayers);
    if (!salaryCheck.valid) {
      alert(salaryCheck.reason);
      return;
    }

    document.getElementById('trade-ai-status').style.display = 'block';
    document.getElementById('btn-propose-trade').disabled = true;
    document.getElementById('trade-response').classList.add('hidden');

    const ctx = {
      ...GameState.getEventContext(),
      myPlayers: mySelectedPlayers.map(p => `${p.name} (${p.ovr} OVR, $${p.salary}M)`).join(', '),
      theirPlayers: theirSelectedPlayers.map(p => `${p.name} (${p.ovr} OVR, $${p.salary}M)`).join(', '),
      targetTeam: NBA_TEAMS[targetTeamId].fullName,
    };

    const response = await ClaudeAPI.generateTradeResponse(ctx);
    document.getElementById('trade-ai-status').style.display = 'none';
    document.getElementById('btn-propose-trade').disabled = false;

    const responseEl = document.getElementById('trade-response');
    const textEl = document.getElementById('trade-response-text');
    const actionsEl = document.getElementById('trade-response-actions');

    responseEl.classList.remove('hidden');
    textEl.textContent = response.narrative;
    tradeResponseData = response;

    actionsEl.innerHTML = '';
    if (response.outcome === 'accept') {
      actionsEl.innerHTML = `
        <button class="btn btn-primary btn-sm" id="btn-accept-trade">Accept Trade</button>
        <button class="btn btn-ghost btn-sm" id="btn-decline-response">Decline</button>
      `;
      document.getElementById('btn-accept-trade').addEventListener('click', () => {
        GameState.executeTrade(mySelectedPlayers, [], theirSelectedPlayers, [], targetTeamId);
        mySelectedPlayers = [];
        theirSelectedPlayers = [];
        responseEl.classList.add('hidden');
        refreshDashboard();
        renderTradeTab();
        renderRosterTab();
        alert('Trade completed!');
      });
    } else {
      actionsEl.innerHTML = `<button class="btn btn-ghost btn-sm" id="btn-decline-response">Dismiss</button>`;
    }
    document.getElementById('btn-decline-response')?.addEventListener('click', () => {
      responseEl.classList.add('hidden');
    });
  }

  function acceptIncomingOffer(idx) {
    const state = GameState.getState();
    const offer = state.incomingTradeOffers[idx];
    if (!offer) return;
    // Execute simplified incoming trade
    state.incomingTradeOffers.splice(idx, 1);
    GameState.autoSave();
    renderIncomingOffers();
    refreshDashboard();
  }

  function declineIncomingOffer(idx) {
    const state = GameState.getState();
    state.incomingTradeOffers.splice(idx, 1);
    GameState.autoSave();
    renderIncomingOffers();
  }

  // ─── SAVE / LOAD ──────────────────────────────────────────────────────────
  function showSaveModal() {
    const slots = GameState.getSaveSlots();
    const modal = document.getElementById('overlay-save');
    const slotsEl = document.getElementById('save-modal-slots');

    slotsEl.innerHTML = slots.map(s => `
      <div class="save-slot ${s.empty ? 'empty' : ''}"
           onclick="App.saveToSlot(${s.slot})" style="cursor:pointer;">
        <div class="save-slot-num">${s.slot}</div>
        <div class="save-info">
          ${s.empty ? '<div class="save-label" style="color:var(--text-muted);">Empty Slot</div>'
            : `<div class="save-label">${s.label}</div>
               <div class="save-meta">${NBA_TEAMS[s.teamId]?.abbr || ''} · Season ${s.season} · ${s.record} · ${s.lastSaved}</div>`}
        </div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }

  function saveToSlot(slot) {
    const state = GameState.getState();
    const team = NBA_TEAMS[state.meta.teamId];
    const label = `${team?.abbr} · S${state.meta.season} · ${state.team.wins}-${state.team.losses}`;
    const success = GameState.saveToSlot(slot, label);
    document.getElementById('overlay-save').classList.add('hidden');
    document.getElementById('overlay-save').style.display = 'none';
    if (success) showToast('Game saved!');
  }

  function showLoadScreen() {
    const slots = GameState.getSaveSlots();
    const container = document.getElementById('save-slots-list');
    container.innerHTML = '';

    // Auto-save slot
    if (GameState.hasAutoSave()) {
      const div = document.createElement('div');
      div.className = 'save-slot';
      div.innerHTML = `
        <div class="save-slot-num">⟳</div>
        <div class="save-info">
          <div class="save-label">Continue (Auto-Save)</div>
          <div class="save-meta">Last auto-saved game</div>
        </div>
      `;
      div.addEventListener('click', () => {
        const loaded = GameState.loadAutoSave();
        if (loaded) {
          applyTeamTheme(loaded.meta.teamId);
          showDashboard();
        }
      });
      container.appendChild(div);
    }

    slots.forEach(s => {
      const div = document.createElement('div');
      div.className = `save-slot ${s.empty ? 'empty' : ''}`;
      div.innerHTML = s.empty
        ? `<div class="save-slot-num">${s.slot}</div><div class="save-info"><div class="save-label" style="color:var(--text-muted);">Empty Slot</div></div>`
        : `<div class="save-slot-num">${s.slot}</div>
           <div class="save-info">
             <div class="save-label">${s.label}</div>
             <div class="save-meta">${NBA_TEAMS[s.teamId]?.abbr || ''} · Season ${s.season} · ${s.record} · ${s.lastSaved}</div>
           </div>`;
      if (!s.empty) {
        div.addEventListener('click', () => {
          const loaded = GameState.loadFromSlot(s.slot);
          if (loaded) {
            applyTeamTheme(loaded.meta.teamId);
            showDashboard();
          }
        });
      }
      container.appendChild(div);
    });

    showScreen('screen-load');
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function getConferenceSeed() {
    const state = GameState.getState();
    const myTeam = state.meta.teamId;
    const conf = NBA_TEAMS[myTeam]?.conference;
    const standings = GameState.getConferenceStandings(conf);
    const idx = standings.findIndex(t => t.teamId === myTeam);
    return idx >= 0 ? idx + 1 : null;
  }

  function ovrClass(ovr) {
    if (ovr >= 93) return 'elite';
    if (ovr >= 83) return 'allstar';
    if (ovr >= 73) return 'starter';
    return 'bench';
  }

  function potentialColor(pot) {
    if (pot >= 90) return 'var(--yellow)';
    if (pot >= 80) return 'var(--blue)';
    if (pot >= 70) return 'var(--text-stat)';
    return 'var(--text-muted)';
  }

  function moraleColor(m) {
    if (m >= 80) return 'var(--green)';
    if (m >= 60) return 'var(--yellow)';
    return 'var(--red)';
  }

  function moraleTag(morale) {
    const label = morale >= 85 ? 'Happy' : morale >= 65 ? 'Content' : morale >= 45 ? 'Unhappy' : 'Furious';
    const color = moraleColor(morale);
    return `<span style="font-size:10px;color:${color};font-family:var(--font-mono);">${label}</span>`;
  }

  function formatPhase(phase) {
    const labels = {
      team_select: 'Team Selection',
      gm_name: 'Setup',
      briefing: 'Opening Briefing',
      offseason: 'Offseason',
      draft: 'Draft',
      training_camp: 'Training Camp',
      regular_season: 'Regular Season',
      playoffs: 'Playoffs',
      fired: 'Fired',
    };
    return labels[phase] || phase;
  }

  function showToast(msg, duration = 2000) {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-msg';
      toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: var(--bg-card); border: 1px solid var(--border);
        border-left: 3px solid var(--team-primary);
        padding: 10px 20px; border-radius: var(--radius);
        font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px;
        color: var(--text-primary); z-index: 9999; pointer-events: none;
        animation: slideUp 0.2s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { if (toast) toast.style.display = 'none'; }, duration);
  }

  // ─── EVENT LISTENERS ──────────────────────────────────────────────────────
  function bindEvents() {
    // Splash
    document.getElementById('btn-new-game').addEventListener('click', () => {
      buildTeamGrid();
      showScreen('screen-team-select');
    });
    document.getElementById('btn-load-game').addEventListener('click', showLoadScreen);
    document.getElementById('btn-set-api-key').addEventListener('click', () => {
      const overlay = document.getElementById('overlay-api-key');
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      const stored = GameState.getApiKey();
      if (stored) document.getElementById('input-api-key').value = stored;
    });

    // Team select
    document.getElementById('btn-back-to-splash').addEventListener('click', () => showScreen('screen-splash'));
    document.getElementById('btn-confirm-team').addEventListener('click', () => {
      if (!selectedTeamId) return;
      showGmNameScreen();
    });

    // GM name
    document.getElementById('btn-back-to-teams').addEventListener('click', () => showScreen('screen-team-select'));
    document.getElementById('btn-confirm-gm-name').addEventListener('click', showBriefingScreen);
    document.getElementById('input-gm-name').addEventListener('keydown', e => {
      if (e.key === 'Enter') showBriefingScreen();
    });

    // Briefing
    document.getElementById('btn-begin-season').addEventListener('click', () => {
      GameState.getState().meta.phase = 'regular_season';
      showDashboard();
    });

    // Dashboard nav tabs
    document.querySelectorAll('.nav-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Sim buttons
    document.getElementById('btn-sim-1').addEventListener('click', () => simulateGames(1));
    document.getElementById('btn-sim-5').addEventListener('click', () => simulateGames(5));
    document.getElementById('btn-sim-10').addEventListener('click', () => simulateGames(10));

    // Save
    document.getElementById('btn-save').addEventListener('click', showSaveModal);
    document.getElementById('btn-cancel-save').addEventListener('click', () => {
      document.getElementById('overlay-save').classList.add('hidden');
      document.getElementById('overlay-save').style.display = 'none';
    });

    // Load
    document.getElementById('btn-back-from-load').addEventListener('click', () => showScreen('screen-splash'));

    // API key
    document.getElementById('btn-save-api-key').addEventListener('click', () => {
      const key = document.getElementById('input-api-key').value.trim();
      GameState.setApiKey(key || null);
      document.getElementById('overlay-api-key').classList.add('hidden');
      document.getElementById('overlay-api-key').style.display = 'none';
      showToast(key ? 'API key saved' : 'API key cleared');
    });
    document.getElementById('btn-cancel-api-key').addEventListener('click', () => {
      document.getElementById('overlay-api-key').classList.add('hidden');
      document.getElementById('overlay-api-key').style.display = 'none';
    });

    // League leaders tabs
    document.querySelectorAll('.leaders-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.leaders-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedLeadersTab = tab.dataset.stat;
        renderLeadersForStat(selectedLeadersTab);
      });
    });

    // Trade target team change
    document.getElementById('trade-target-team').addEventListener('change', e => {
      tradeTargetTeam = e.target.value;
      theirSelectedPlayers = [];
      const label = NBA_TEAMS[tradeTargetTeam]?.abbr || 'Their Offer';
      document.getElementById('trade-their-team-label').textContent = label;
      if (tradeTargetTeam) renderTheirRosterForTrade(tradeTargetTeam);
    });

    // Propose trade
    document.getElementById('btn-propose-trade').addEventListener('click', proposeTrade);

    // Champion → next season
    document.getElementById('btn-next-season').addEventListener('click', () => {
      beginOffseason();
    });

    // Fired → new game
    document.getElementById('btn-new-game-from-fired').addEventListener('click', () => {
      selectedTeamId = null;
      buildTeamGrid();
      showScreen('screen-team-select');
    });

    // Settings nav
    document.getElementById('btn-settings-nav').addEventListener('click', () => {
      const overlay = document.getElementById('overlay-api-key');
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      const stored = GameState.getApiKey();
      if (stored) document.getElementById('input-api-key').value = stored;
    });
  }

  function renderTheirRosterForTrade(teamId) {
    const theirRoster = GameState.getState().leagueRosters[teamId] || [];
    const container = document.getElementById('trade-their-players');
    container.innerHTML = theirRoster.sort((a, b) => b.ovr - a.ovr).slice(0, 12).map(p => `
      <div class="game-log-entry" style="padding: 7px 0; cursor: pointer;"
           onclick="App.toggleTheirPlayer('${p.id}', '${teamId}')" id="their-player-${p.id}">
        <span class="ovr-badge ${ovrClass(p.ovr)}" style="font-size:10px;padding:1px 5px;">${p.ovr}</span>
        <span style="flex:1;font-size:12px;">${p.name}</span>
        <span class="player-pos" style="font-size:10px;">${p.pos}</span>
        <span class="stat-cell" style="font-size:11px;">$${p.salary.toFixed(1)}M</span>
      </div>
    `).join('');

    // My roster for trade (offer side)
    const myRoster = GameState.getState().roster;
    const myContainer = document.getElementById('trade-my-players');
    myContainer.innerHTML = myRoster.sort((a, b) => b.ovr - a.ovr).map(p => `
      <div class="game-log-entry" style="padding: 7px 0; cursor: pointer;"
           onclick="App.toggleMyPlayer('${p.id}')" id="my-player-${p.id}">
        <span class="ovr-badge ${ovrClass(p.ovr)}" style="font-size:10px;padding:1px 5px;">${p.ovr}</span>
        <span style="flex:1;font-size:12px;">${p.name}</span>
        <span class="player-pos" style="font-size:10px;">${p.pos}</span>
        <span class="stat-cell" style="font-size:11px;">$${p.salary.toFixed(1)}M</span>
      </div>
    `).join('');
  }

  function toggleMyPlayer(playerId) {
    const player = GameState.getState().roster.find(p => p.id === playerId);
    if (!player) return;
    const idx = mySelectedPlayers.findIndex(p => p.id === playerId);
    if (idx >= 0) {
      mySelectedPlayers.splice(idx, 1);
      document.getElementById(`my-player-${playerId}`)?.style.setProperty('background', '');
    } else {
      mySelectedPlayers.push(player);
      document.getElementById(`my-player-${playerId}`)?.style.setProperty('background', 'var(--team-glow)');
    }
    updateTradeSalaryCheck();
  }

  function toggleTheirPlayer(playerId, teamId) {
    const theirRoster = GameState.getState().leagueRosters[teamId] || [];
    const player = theirRoster.find(p => p.id === playerId);
    if (!player) return;
    const idx = theirSelectedPlayers.findIndex(p => p.id === playerId);
    if (idx >= 0) {
      theirSelectedPlayers.splice(idx, 1);
      document.getElementById(`their-player-${playerId}`)?.style.setProperty('background', '');
    } else {
      theirSelectedPlayers.push(player);
      document.getElementById(`their-player-${playerId}`)?.style.setProperty('background', 'var(--team-glow)');
    }
    updateTradeSalaryCheck();
  }

  function updateTradeSalaryCheck() {
    const myTotal = mySelectedPlayers.reduce((s, p) => s + p.salary, 0);
    const theirTotal = theirSelectedPlayers.reduce((s, p) => s + p.salary, 0);
    const check = mySelectedPlayers.length || theirSelectedPlayers.length
      ? GameState.checkSalaryMatch(mySelectedPlayers, theirSelectedPlayers)
      : { valid: true };

    document.getElementById('trade-salary-check').innerHTML = `
      <div>Out: $${myTotal.toFixed(1)}M</div>
      <div>In: $${theirTotal.toFixed(1)}M</div>
      <div style="margin-top:4px;color:${check.valid ? 'var(--green)' : 'var(--red)'};">
        ${check.valid ? '✓ Valid' : '✗ Mismatch'}
      </div>
    `;
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    // Set initial screen display
    SCREENS.forEach(id => {
      const el = document.getElementById(id);
      if (el && id !== 'screen-splash') el.style.display = 'none';
    });
    document.getElementById('screen-splash').style.display = 'flex';

    bindEvents();

    // Check for auto-save on load
    if (GameState.hasAutoSave()) {
      document.getElementById('btn-load-game').textContent = 'Continue';
    }
  }

  // Public API
  return {
    init,
    switchTab,
    showDashboard,
    simulateGames,
    scoutProspect,
    signFreeAgent,
    releasePlayer: (id) => releasePlayer(id),
    proposeTrade,
    acceptIncomingOffer,
    declineIncomingOffer,
    saveToSlot,
    toggleMyPlayer,
    toggleTheirPlayer,
    refreshDashboard,
    // Phase 2 public methods used by phases.js
    showScreenPublic: (id) => showScreen(id),
    showEventOverlayPublic: (headline, body, choices, onChoice) => showEventOverlay(headline, body, choices, onChoice),
  };
})();

// ─── CLAUDE API MODULE ────────────────────────────────────────────────────────
const ClaudeAPI = (() => {
  const MODEL = 'claude-sonnet-4-20250514';
  const API_URL = 'https://api.anthropic.com/v1/messages';

  async function call(systemPrompt, userMessage) {
    const key = GameState.getApiKey();
    if (!key) return null; // Fallback to mock

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 512,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });
      if (!resp.ok) throw new Error(`API error: ${resp.status}`);
      const data = await resp.json();
      return data.content?.[0]?.text || null;
    } catch (e) {
      console.error('Claude API error:', e);
      return null;
    }
  }

  function ctxSummary(ctx) {
    return `Team: ${ctx.teamName} | GM: ${ctx.gmName} | Season: ${ctx.season} | Record: ${ctx.record} | Pressure: ${ctx.ownershipPressure}/100 | ${ctx.salaryInfo || ''}`;
  }

  // ── Opening Owner Memo ────────────────────────────────────────────────────
  async function generateOwnerMemo() {
    const state = GameState.getState();
    const team = GameState.getTeam();
    const sys = `You are the owner of the ${team.fullName}. Write a 120-150 word confidential memo to your new GM. Reference the team's recent history, expectations for this season, one player you're excited about, and one area of concern. Be direct and businesslike. Signed by ${team.ownerName}.`;
    const user = `Write the opening memo for GM ${state.meta.gmName}. The team is a ${team.difficulty}. Flavor: ${team.flavor}`;

    const result = await call(sys, user);
    if (result) return result;

    // Fallback
    return `${state.meta.gmName},\n\nWelcome to the ${team.fullName}. The expectations here are clear: ${team.flavor}\n\nI'll be watching closely. Show me something.\n\n— ${team.ownerName}`;
  }

  // ── Weekly Pulse ──────────────────────────────────────────────────────────
  async function generateWeeklyPulse(ctx) {
    const sys = `You are a beat reporter for the ${ctx.teamName}. Generate a concise weekly status update as 3-4 bullet points. Each bullet is one sentence. Be specific, reference the record and recent games. Output ONLY the bullet points, one per line, no bullet characters.`;
    const user = ctxSummary(ctx) + ` | Recent: ${ctx.recentGames} | Week: ${ctx.week}`;

    const result = await call(sys, user);
    if (result) {
      return { bullets: result.split('\n').filter(l => l.trim()).slice(0, 4) };
    }

    return {
      bullets: [
        `The ${ctx.teamName} stand at ${ctx.record} heading into week ${ctx.week}.`,
        `Ownership pressure sits at ${ctx.ownershipPressure}% — ${ctx.ownershipPressure > 60 ? 'the seat is getting warm.' : 'management remains patient.'}`,
        `Scouts continue to monitor the draft class ahead of the offseason.',`,
        `The next few games are critical to solidifying a playoff position.`,
      ]
    };
  }

  // ── Event Generation ──────────────────────────────────────────────────────
  async function generateEvent(ctx) {
    const eventTypes = ['player_injury', 'player_slump', 'locker_room_tension', 'contract_demand', 'trade_interest'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const rosterNames = ctx.rosterSummary.split(',').slice(0, 3).map(s => s.trim().split('(')[0].trim());
    const player = rosterNames[Math.floor(Math.random() * rosterNames.length)] || 'a key player';

    const sys = `You are a beat reporter covering the ${ctx.teamName}. Generate a realistic NBA front-office situation involving ${player}. Keep it under 100 words. Be specific and dramatic. Then output exactly 3 GM decision options on separate lines starting with "OPTION A:", "OPTION B:", "OPTION C:".`;
    const user = ctxSummary(ctx) + ` | Game: ${ctx.gamesPlayed} | Event type hint: ${type}`;

    const result = await call(sys, user);
    if (result) {
      const lines = result.split('\n').filter(l => l.trim());
      const optionLines = lines.filter(l => l.startsWith('OPTION '));
      const narrative = lines.filter(l => !l.startsWith('OPTION ')).join(' ').trim();
      const choices = optionLines.map(l => l.replace(/^OPTION [ABC]: ?/, '').trim());
      if (choices.length >= 2) {
        return { type, narrative, choices };
      }
    }

    // Fallback events
    const fallbacks = {
      player_injury: {
        narrative: `${player} rolled their ankle in practice this morning and is questionable for the next three games. Team trainers are cautiously optimistic but the timeline is unclear.`,
        choices: ['Adjust the rotation and call up a G-League player', 'Stay the course and trust the remaining roster', 'Make emergency calls to available free agents']
      },
      locker_room_tension: {
        narrative: `Sources close to the team say there's growing tension between two players over shot distribution. The locker room is watching how you handle it.`,
        choices: ['Call a team meeting to address it directly', 'Meet with both players separately', 'Let it play out — teams work through these things']
      },
    };
    const fallback = fallbacks[type] || fallbacks['player_injury'];
    return { type, ...fallback };
  }

  // ── Trade Response ────────────────────────────────────────────────────────
  async function generateTradeResponse(ctx) {
    const sys = `You are the GM of ${ctx.targetTeam}. The ${ctx.teamName} has proposed a trade. Respond in character — be realistic, reference the specific players, and give a reason. Keep it under 80 words. Then on a new line write either "OUTCOME: accept", "OUTCOME: counter", or "OUTCOME: decline".`;
    const user = `${ctx.teamName} offers: ${ctx.myPlayers}. They want: ${ctx.theirPlayers}. Context: ${ctxSummary(ctx)}`;

    const result = await call(sys, user);
    if (result) {
      const outcomeMatch = result.match(/OUTCOME: (accept|counter|decline)/i);
      const outcome = outcomeMatch?.[1]?.toLowerCase() || 'decline';
      const narrative = result.replace(/OUTCOME: .*/i, '').trim();
      return { narrative, outcome };
    }

    return {
      narrative: `The ${ctx.targetTeam} GM reviewed your offer carefully but doesn't see a fit right now. They may be open to revisiting with different pieces.`,
      outcome: 'decline',
    };
  }

  // ── Scouting Report ───────────────────────────────────────────────────────
  async function generateScoutingReport(ctx) {
    const p = ctx.prospect;
    const sys = `You are an NBA scout writing an ESPN-style scouting report. Format exactly as:
HEADLINE: [one punchy sentence]
STRENGTHS: [2-3 sentences]
WEAKNESSES: [1-2 sentences]
COMP: [one NBA player comparison with brief reasoning]
BOTTOM LINE: [one sentence on draft value]`;
    const user = `Prospect: ${p.name}, ${p.pos}, Age ${p.age}, ${p.school}. Ratings: OVR ${p.ratings.ovr}, Scoring ${p.ratings.scoring}, Playmaking ${p.ratings.playmaking}, Defense ${p.ratings.defense}, Athleticism ${p.ratings.athleticism}, IQ ${p.ratings.iq}, Potential ${p.ratings.potential}. Team picking at #${ctx.pickPosition}, needs: ${ctx.teamNeeds}.`;

    const result = await call(sys, user);
    if (result) {
      const get = (key) => result.match(new RegExp(`${key}: (.+)`, 'i'))?.[1]?.trim() || '';
      return {
        headline: get('HEADLINE'),
        strengths: get('STRENGTHS'),
        weaknesses: get('WEAKNESSES'),
        comp: get('COMP'),
        bottomLine: get('BOTTOM LINE'),
      };
    }

    return {
      headline: `${p.name} projects as a versatile ${p.pos} with upside.`,
      strengths: `Shows flashes of elite-level ${p.ratings.scoring > 80 ? 'scoring' : 'playmaking'} ability.`,
      weaknesses: `Still raw in transition defense. Needs seasoning at the NBA level.`,
      comp: `Projects similarly to a young ${p.ratings.potential > 88 ? 'franchise player' : 'starter'}.`,
      bottomLine: `Solid ${p.tier} selection with ${p.ratings.potential > 85 ? 'star' : 'starter'} upside.`,
    };
  }

  // ── Exit Interview ────────────────────────────────────────────────────────
  async function generateExitInterview(ctx) {
    const sys = `You are the owner of the ${ctx.teamName}. Give a 100-120 word post-season assessment to your GM. Reference the ${ctx.seasonResult} result and the ${ctx.record} record. Be honest — praise or criticize appropriately. End with expectations for next season.`;
    const user = ctxSummary(ctx) + ` | Season result: ${ctx.seasonResult} | Seed: ${ctx.seed}`;

    const result = await call(sys, user);
    if (result) return result;

    const resultText = { champion: 'championship', finalist: 'Finals run', playoffs: 'playoff appearance', missed_playoffs: 'missed postseason' }[ctx.seasonResult] || ctx.seasonResult;
    return `After a ${resultText} this season at ${ctx.record}, we have much to evaluate. ${ctx.ownershipPressure > 60 ? 'I\'m not satisfied with where we are.' : 'There were positive signs.'} Next season, the bar is higher.`;
  }

  // ── Championship Narrative ────────────────────────────────────────────────
  async function generateChampionshipNarrative(ctx) {
    const sys = `You are an NBA journalist writing the championship victory story for the ${ctx.teamName}. Write a 150-200 word celebratory narrative capturing the emotion of winning it all. Be vivid and specific.`;
    const user = ctxSummary(ctx);

    const result = await call(sys, user);
    if (result) return result;
    return `The ${ctx.teamName} have done it. In one of the most memorable runs in recent memory, GM ${ctx.gmName} built a champion from the ground up. The final buzzer sounded, and confetti rained down — a testament to vision, grit, and franchise-defining decisions.`;
  }

  // ── Owner Warning ─────────────────────────────────────────────────────────
  async function generateOwnerWarning(ctx) {
    const sys = `You are the owner of the ${ctx.teamName}. Send a stern but fair 80-word warning memo to your GM. Ownership pressure is at ${ctx.ownershipPressure}%. Be specific about concerns.`;
    const user = ctxSummary(ctx);
    const result = await call(sys, user);
    return result || `GM ${ctx.gmName} — I need to be direct with you. The results are not meeting expectations. Ownership pressure is at a critical level. I need to see immediate improvement or we will need to reassess this partnership. You have my full support — but I need to see results.`;
  }

  // ── Press Conference ──────────────────────────────────────────────────────
  async function generatePressConference(ctx) {
    const sys = `You are setting up a press conference situation for NBA GM ${ctx.gmName} of the ${ctx.teamName}. Write a 60-word tense media situation, then provide exactly 3 talking points the GM could use. Format: SETUP: [situation] then OPTION A: [talking point] OPTION B: [talking point] OPTION C: [talking point]`;
    const user = ctxSummary(ctx);
    const result = await call(sys, user);

    if (result) {
      const setup = result.match(/SETUP: (.+?)(?=OPTION|$)/is)?.[1]?.trim() || '';
      const choices = ['A', 'B', 'C'].map(l =>
        result.match(new RegExp(`OPTION ${l}: (.+?)(?=OPTION|$)`, 'is'))?.[1]?.trim() || ''
      ).filter(Boolean);
      if (choices.length) return { setup, choices };
    }

    return {
      setup: 'Reporters are demanding answers after a string of losses. Ownership pressure is critical.',
      choices: ['Focus on the process — "We trust our system and our players."', 'Take accountability — "The results aren\'t good enough. I own that."', 'Shift focus to the future — "We\'re building something here that will pay off."'],
    };
  }

  // ── Fired Letter ──────────────────────────────────────────────────────────
  async function generateFiredLetter(ctx) {
    const sys = `You are the owner of the ${ctx.teamName}. Write a 100-word professional but final dismissal letter to GM ${ctx.gmName}. Be sympathetic but firm. Reference their tenure.`;
    const user = ctxSummary(ctx);
    const result = await call(sys, user);
    return result || `${ctx.gmName},\n\nAfter careful consideration, I've decided to make a change in our front office leadership. Your contributions to this franchise were not without merit, but the results ultimately fell short of what our fans and organization deserve. I wish you the very best in your future endeavors.\n\nThank you for your service.`;
  }

  // ── Playoff Decision ──────────────────────────────────────────────────────
  async function generatePlayoffDecision(ctx, oppName, series) {
    const myW = series.aW;
    const oppW = series.bW;
    const sys = `You are covering the ${ctx.teamName} in the playoffs. It's between games in a series vs ${oppName} (series: ${myW}-${oppW}). Write a 60-word pregame situation requiring a GM adjustment, then give 3 options. Format: SITUATION: [text] OPTION A: [text] OPTION B: [text] OPTION C: [text]`;
    const user = ctxSummary(ctx);
    const result = await call(sys, user);
    if (result) {
      const situation = result.match(/SITUATION: (.+?)(?=OPTION|$)/is)?.[1]?.trim() || '';
      const choices = ['A', 'B', 'C'].map(l =>
        result.match(new RegExp(`OPTION ${l}: (.+?)(?=OPTION|$)`, 'is'))?.[1]?.trim() || ''
      ).filter(Boolean);
      if (situation && choices.length) return { situation, choices };
    }
    return {
      situation: `Heading into Game ${myW + oppW + 1} vs the ${oppName}. Your coaching staff has identified some adjustments.`,
      choices: ['Push the tempo — attack their tired bigs', 'Slow the pace, grind them down defensively', 'No changes — trust the current rotation'],
    };
  }

  // ── Draft Pick Note ───────────────────────────────────────────────────────
  async function generateDraftPickNote(prospect, teamId, pick) {
    const teamName = NBA_TEAMS[teamId]?.fullName || teamId;
    const sys = `You are an NBA draft analyst. Write a single 8-12 word observation on why ${teamName} selected ${prospect.name} at pick #${pick}. No quotes, no punctuation at end.`;
    const user = `${prospect.name}, ${prospect.pos}, ${prospect.school}`;
    const result = await call(sys, user);
    return result?.trim() || `${teamName} adds depth with this selection`;
  }

  return {
    generateOwnerMemo,
    generateWeeklyPulse,
    generateEvent,
    generateTradeResponse,
    generateScoutingReport,
    generateExitInterview,
    generateChampionshipNarrative,
    generateOwnerWarning,
    generatePressConference,
    generateFiredLetter,
    generatePlayoffDecision,
    generateDraftPickNote,
  };
})();

// ─── BOOT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
