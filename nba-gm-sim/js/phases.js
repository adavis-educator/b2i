// phases.js — Phase 2: Playoffs · Offseason · Free Agency · Draft Day
// Depends on: game-state.js, teams.js, players.js, draft-prospects.js, main.js (App), ClaudeAPI

const Phases = (() => {

  // ─── SHARED UTILITY ────────────────────────────────────────────────────────
  function avgTopOvr(roster, n = 8) {
    if (!roster || !roster.length) return 70;
    return [...roster].sort((a, b) => b.ovr - a.ovr)
      .slice(0, n).reduce((s, p) => s + p.ovr, 0) / n;
  }

  function teamName(id) { return NBA_TEAMS[id]?.fullName || id; }
  function teamAbbr(id) { return NBA_TEAMS[id]?.abbr || id; }
  function teamColor(id) { return NBA_TEAMS[id]?.colors?.primary || '#888'; }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function setContent(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // ─── PLAYOFF ENGINE ────────────────────────────────────────────────────────
  function simGame(teamA, teamB) {
    const st = GameState.getState();
    const myId = st.meta.teamId;
    const getRoster = id => (id === myId ? st.roster : st.leagueRosters[id] || [])
      .filter(p => !p.injured);
    const aOvr = avgTopOvr(getRoster(teamA));
    const bOvr = avgTopOvr(getRoster(teamB));
    const diff = aOvr - bOvr;
    const roll = (Math.random() - 0.5) * 20;
    const aWins = diff + roll > 0;
    const base = 100 + Math.floor(Math.random() * 14);
    const margin = 2 + Math.floor(Math.random() * 16);
    return {
      winner: aWins ? teamA : teamB,
      loser:  aWins ? teamB : teamA,
      aScore: aWins ? base + margin : base,
      bScore: aWins ? base : base + margin,
    };
  }

  function simSeriesFast(teamA, teamB) {
    let aW = 0, bW = 0;
    const games = [];
    while (aW < 4 && bW < 4) {
      const g = simGame(teamA, teamB);
      games.push(g);
      g.winner === teamA ? aW++ : bW++;
    }
    return { winner: aW === 4 ? teamA : teamB, loser: aW === 4 ? teamB : teamA, aW, bW, games };
  }

  // ─── BRACKET STATE ─────────────────────────────────────────────────────────
  let bracket = {
    east:   [null, null, null, null], // matchup objects per slot
    west:   [null, null, null, null],
    eastSemis:  [null, null],
    westSemis:  [null, null],
    eastFinals: null,
    westFinals: null,
    finals: null,
  };
  let myPlayoffResult = null;

  function makeSeries(teamA, teamB, roundLabel) {
    return { teamA, teamB, winner: null, loser: null, aW: 0, bW: 0, games: [], roundLabel };
  }

  // ─── MAIN PLAYOFF ENTRY POINT ──────────────────────────────────────────────
  async function runPlayoffs() {
    const st = GameState.getState();
    const myId = st.meta.teamId;
    const myConf = NBA_TEAMS[myId].conference;

    const eastR = GameState.getConferenceStandings('East');
    const westR = GameState.getConferenceStandings('West');
    const myConfR = myConf === 'East' ? eastR : westR;
    const mySeed = myConfR.findIndex(t => t.teamId === myId) + 1;

    if (mySeed > 6) {
      await showMissedPlayoffs();
      return 'missed_playoffs';
    }

    const e8 = eastR.slice(0, 8).map(t => t.teamId);
    const w8 = westR.slice(0, 8).map(t => t.teamId);

    // Build first-round bracket
    bracket.east[0] = makeSeries(e8[0], e8[7], 'East R1');
    bracket.east[1] = makeSeries(e8[1], e8[6], 'East R1');
    bracket.east[2] = makeSeries(e8[2], e8[5], 'East R1');
    bracket.east[3] = makeSeries(e8[3], e8[4], 'East R1');
    bracket.west[0] = makeSeries(w8[0], w8[7], 'West R1');
    bracket.west[1] = makeSeries(w8[1], w8[6], 'West R1');
    bracket.west[2] = makeSeries(w8[2], w8[5], 'West R1');
    bracket.west[3] = makeSeries(w8[3], w8[4], 'West R1');

    App.showScreenPublic('screen-playoffs');
    renderBracketFull();

    // ── Round 1 ──────────────────────────────────────────────────────────────
    document.getElementById('playoff-round-label').textContent = 'FIRST ROUND';
    const eR1Winners = await playRound(bracket.east, myId);
    const wR1Winners = await playRound(bracket.west, myId);
    if (!checkStillIn([...eR1Winners, ...wR1Winners], myId)) {
      myPlayoffResult = 'first_round'; return 'first_round';
    }

    // ── Conference Semis ──────────────────────────────────────────────────────
    document.getElementById('playoff-round-label').textContent = 'CONFERENCE SEMIFINALS';
    bracket.eastSemis[0] = makeSeries(eR1Winners[0], eR1Winners[1], 'East Semis');
    bracket.eastSemis[1] = makeSeries(eR1Winners[2], eR1Winners[3], 'East Semis');
    bracket.westSemis[0] = makeSeries(wR1Winners[0], wR1Winners[1], 'West Semis');
    bracket.westSemis[1] = makeSeries(wR1Winners[2], wR1Winners[3], 'West Semis');
    renderBracketFull();

    const eSemiWinners = await playRound(bracket.eastSemis, myId);
    const wSemiWinners = await playRound(bracket.westSemis, myId);
    if (!checkStillIn([...eSemiWinners, ...wSemiWinners], myId)) {
      myPlayoffResult = 'conf_semis'; return 'conf_semis';
    }

    // ── Conference Finals ─────────────────────────────────────────────────────
    document.getElementById('playoff-round-label').textContent = 'CONFERENCE FINALS';
    bracket.eastFinals = makeSeries(eSemiWinners[0], eSemiWinners[1], 'East Finals');
    bracket.westFinals = makeSeries(wSemiWinners[0], wSemiWinners[1], 'West Finals');
    renderBracketFull();

    const eFinalWinner = await playOneSeries(bracket.eastFinals, myId);
    const wFinalWinner = await playOneSeries(bracket.westFinals, myId);
    if (!checkStillIn([eFinalWinner, wFinalWinner], myId)) {
      myPlayoffResult = 'conf_finals'; return 'conf_finals';
    }

    // ── NBA Finals ────────────────────────────────────────────────────────────
    document.getElementById('playoff-round-label').textContent = 'NBA FINALS';
    bracket.finals = makeSeries(eFinalWinner, wFinalWinner, 'NBA Finals');
    renderBracketFull();

    const champion = await playOneSeries(bracket.finals, myId);
    myPlayoffResult = champion === myId ? 'champion' : 'finalist';
    return myPlayoffResult;
  }

  function checkStillIn(winners, myId) {
    return winners.includes(myId);
  }

  // playRound: plays all matchups in parallel (other teams) or waits for user's
  async function playRound(matchups, myId) {
    const winners = [];
    for (const m of matchups) {
      if (!m) continue;
      const w = await playOneSeries(m, myId);
      winners.push(w);
    }
    return winners;
  }

  async function playOneSeries(series, myId) {
    const isMyeries = series.teamA === myId || series.teamB === myId;
    if (isMyeries) {
      return await playUserSeries(series);
    } else {
      // Sim instantly and update bracket
      const result = simSeriesFast(series.teamA, series.teamB);
      Object.assign(series, result);
      renderBracketFull();
      await sleep(300);
      return result.winner;
    }
  }

  // Plays a series where the user is involved — shows game-by-game
  async function playUserSeries(series) {
    return new Promise(async resolve => {
      const seriesView = document.getElementById('playoff-series-view');
      seriesView.classList.remove('hidden');
      seriesView.style.display = 'block';

      while (series.aW < 4 && series.bW < 4) {
        renderSeriesView(series);
        await sleep(400);

        // Between-game decision prompt (every 2 games)
        if ((series.aW + series.bW) % 2 === 0 && series.aW + series.bW > 0) {
          await showBetweenGameDecision(series);
        }

        const g = simGame(series.teamA, series.teamB);
        series.games.push(g);
        g.winner === series.teamA ? series.aW++ : series.bW++;
        renderSeriesView(series);
        renderBracketFull();
        await sleep(600);
      }

      series.winner = series.aW === 4 ? series.teamA : series.teamB;
      series.loser  = series.winner === series.teamA ? series.teamB : series.teamA;
      renderSeriesView(series);
      renderBracketFull();

      seriesView.innerHTML += `
        <div style="text-align:center;margin-top:20px;padding:16px;background:var(--bg-surface);border-radius:var(--radius-lg);">
          <div style="font-family:var(--font-display);font-size:28px;letter-spacing:3px;color:var(--team-primary)">
            ${teamAbbr(series.winner)} WIN THE SERIES
          </div>
          <button class="btn btn-primary" id="btn-series-continue" style="margin-top:14px;">
            Continue →
          </button>
        </div>`;

      document.getElementById('btn-series-continue').addEventListener('click', () => {
        resolve(series.winner);
      });
    });
  }

  function renderSeriesView(series) {
    const el = document.getElementById('playoff-series-view');
    if (!el) return;
    const myId = GameState.getState().meta.teamId;
    const isA = series.teamA === myId;
    const myW = isA ? series.aW : series.bW;
    const oppW = isA ? series.bW : series.aW;
    const opp = isA ? series.teamB : series.teamA;

    const gameBoxes = series.games.map((g, i) => {
      const myScore = isA ? g.aScore : g.bScore;
      const oppScore = isA ? g.bScore : g.aScore;
      const won = g.winner === myId;
      return `<div class="series-game ${won ? 'sg-win' : 'sg-loss'}">
        <div class="sg-num">G${i+1}</div>
        <div class="sg-score">${myScore}–${oppScore}</div>
        <div class="sg-result ${won ? 'positive' : 'negative'}">${won ? 'W' : 'L'}</div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="series-header">
        <div class="series-team-block">
          <div class="series-abbr" style="color:${teamColor(myId)}">${teamAbbr(myId)}</div>
          <div class="series-wins">${myW}</div>
        </div>
        <div class="series-vs">
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">
            ${series.roundLabel.toUpperCase()}
          </div>
          <div style="font-size:24px;color:var(--text-muted);margin:4px 0;">VS</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">BEST OF 7</div>
        </div>
        <div class="series-team-block">
          <div class="series-abbr" style="color:${teamColor(opp)}">${teamAbbr(opp)}</div>
          <div class="series-wins">${oppW}</div>
        </div>
      </div>
      <div class="series-games">${gameBoxes}</div>
    `;
  }

  async function showBetweenGameDecision(series) {
    const opp = series.teamA === GameState.getState().meta.teamId ? series.teamB : series.teamA;
    const ctx = GameState.getEventContext();
    const data = await ClaudeAPI.generatePlayoffDecision(ctx, teamName(opp), series);
    return App.showEventOverlayPublic(
      `GAME ${series.aW + series.bW + 1} PREGAME`,
      data.situation,
      data.choices,
      () => {}
    );
  }

  // ─── BRACKET RENDER ────────────────────────────────────────────────────────
  function renderBracketFull() {
    const el = document.getElementById('playoff-bracket');
    if (!el) return;

    const seriesHTML = (s, compact = false) => {
      if (!s) return `<div class="bracket-matchup bracket-tbd">TBD</div>`;
      const tA = NBA_TEAMS[s.teamA];
      const tB = NBA_TEAMS[s.teamB];
      const myId = GameState.getState().meta.teamId;
      const isMine = s.teamA === myId || s.teamB === myId;
      return `
        <div class="bracket-matchup${isMine ? ' bracket-mine' : ''}${s.winner ? ' bracket-done' : ''}">
          <div class="bracket-team${s.winner === s.teamA ? ' bw' : ''}${s.winner && s.winner !== s.teamA ? ' bl' : ''}">
            <span style="font-family:var(--font-display);font-size:14px;color:${tA?.colors.primary}">${tA?.abbr}</span>
            <span class="b-wl">${s.aW}</span>
          </div>
          <div class="bracket-team${s.winner === s.teamB ? ' bw' : ''}${s.winner && s.winner !== s.teamB ? ' bl' : ''}">
            <span style="font-family:var(--font-display);font-size:14px;color:${tB?.colors.primary}">${tB?.abbr}</span>
            <span class="b-wl">${s.bW}</span>
          </div>
        </div>`;
    };

    el.innerHTML = `
      <div class="bracket-layout">
        <div class="bracket-conf-col">
          <div class="bracket-conf-label">EASTERN CONFERENCE</div>
          <div class="bracket-round-col">
            ${bracket.east.map(s => seriesHTML(s)).join('')}
          </div>
          <div class="bracket-round-col">
            ${bracket.eastSemis.map(s => seriesHTML(s)).join('')}
          </div>
          <div class="bracket-round-col">
            ${seriesHTML(bracket.eastFinals)}
          </div>
        </div>
        <div class="bracket-finals-col">
          <div class="bracket-conf-label">NBA FINALS</div>
          ${seriesHTML(bracket.finals)}
        </div>
        <div class="bracket-conf-col bracket-conf-right">
          <div class="bracket-conf-label">WESTERN CONFERENCE</div>
          <div class="bracket-round-col">
            ${bracket.west.map(s => seriesHTML(s)).join('')}
          </div>
          <div class="bracket-round-col">
            ${bracket.westSemis.map(s => seriesHTML(s)).join('')}
          </div>
          <div class="bracket-round-col">
            ${seriesHTML(bracket.westFinals)}
          </div>
        </div>
      </div>`;
  }

  async function showMissedPlayoffs() {
    App.showScreenPublic('screen-playoffs');
    document.getElementById('playoff-round-label').textContent = 'MISSED PLAYOFFS';
    document.getElementById('playoff-bracket').innerHTML = `
      <div style="text-align:center;padding:60px 40px;">
        <div style="font-family:var(--font-display);font-size:64px;color:var(--text-muted);letter-spacing:4px;">OUT</div>
        <div style="color:var(--text-secondary);margin-top:12px;font-size:15px;">
          The ${GameState.getTeam().fullName} did not qualify for the playoffs this season.
        </div>
        <button class="btn btn-ghost" id="btn-playoff-continue" style="margin-top:28px;">
          Begin Offseason →
        </button>
      </div>`;
    document.getElementById('playoff-series-view').style.display = 'none';
    return new Promise(r => {
      document.getElementById('btn-playoff-continue').addEventListener('click', r);
    });
  }

  // ─── OFFSEASON FLOW ────────────────────────────────────────────────────────
  let offseasonPhase = 'development'; // development → free_agency → done

  async function runOffseason(seasonResult) {
    App.showScreenPublic('screen-offseason');
    offseasonPhase = 'development';

    // Tab setup
    setContent('offseason-title', `OFFSEASON — SEASON ${GameState.getState().meta.season}`);
    showOffseasonTab('development');

    // 1. Development
    await showDevelopmentPhase();
  }

  function showOffseasonTab(tab) {
    ['development', 'free-agency', 'summary'].forEach(t => {
      document.getElementById(`os-tab-${t}`)?.classList.toggle('active', t === tab);
      document.getElementById(`os-panel-${t}`)?.classList.toggle('active', t === tab);
    });
  }

  async function showDevelopmentPhase() {
    showOffseasonTab('development');
    const panel = document.getElementById('os-panel-development');
    if (!panel) return;

    panel.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <span class="loading-dots" style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);">
          Calculating offseason development
        </span>
      </div>`;

    await sleep(800);

    const narratives = GameState.applyOffseasonDevelopment();
    const roster = GameState.getRoster().sort((a, b) => b.ovr - a.ovr);

    panel.innerHTML = `
      <div style="margin-bottom:20px;">
        <div style="font-family:var(--font-display);font-size:24px;letter-spacing:2px;margin-bottom:4px;">
          Player Development
        </div>
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">
          All players have aged and developed based on their potential and morale.
        </div>
      </div>

      ${narratives.length ? `
        <div style="margin-bottom:20px;">
          <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:2px;color:var(--team-primary);margin-bottom:10px;">NOTABLE DEVELOPMENT</div>
          ${narratives.map(n => `
            <div style="padding:10px 14px;background:var(--bg-surface);border:1px solid var(--border);border-left:3px solid var(--team-primary);border-radius:var(--radius);margin-bottom:8px;font-size:13px;color:var(--text-secondary);line-height:1.6;">
              ${n}
            </div>`).join('')}
        </div>` : ''}

      <div style="margin-bottom:20px;">
        <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:2px;color:var(--text-muted);margin-bottom:10px;">YOUR UPDATED ROSTER</div>
        <table class="data-table">
          <thead><tr>
            <th>Player</th><th>Pos</th><th>Age</th>
            <th class="center">OVR</th><th class="center">POT</th>
            <th class="right">Salary</th><th class="center">Yrs Left</th>
          </tr></thead>
          <tbody>
            ${roster.map(p => `
              <tr>
                <td class="player-name">${p.name}</td>
                <td><span class="player-pos">${p.pos}</span></td>
                <td class="stat-cell center">${p.age}</td>
                <td class="center"><span class="ovr-badge ${ovrCls(p.ovr)}">${p.ovr}</span></td>
                <td class="stat-cell center" style="color:${potClr(p.potential)}">${p.potential}</td>
                <td class="stat-cell right">$${p.salary.toFixed(1)}M</td>
                <td class="stat-cell center">${p.contract_years}yr</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <button class="btn btn-primary" id="btn-to-free-agency">Continue to Free Agency →</button>
      </div>`;

    document.getElementById('btn-to-free-agency').addEventListener('click', () => {
      showFreeAgencyPhase();
    });
  }

  async function showFreeAgencyPhase() {
    showOffseasonTab('free-agency');
    const panel = document.getElementById('os-panel-free-agency');
    if (!panel) return;

    GameState.startOffseason(); // processes expirations, resets standings
    const state = GameState.getState();
    const capSpace = GameState.getCapSpace();
    const fas = GameState.getTopFreeAgents(40);

    panel.innerHTML = `
      <div style="margin-bottom:20px;display:flex;align-items:flex-end;justify-content:space-between;">
        <div>
          <div style="font-family:var(--font-display);font-size:24px;letter-spacing:2px;">Free Agency</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);margin-top:4px;">
            Cap Space: <span style="color:var(--green)">$${capSpace.toFixed(1)}M</span>
            &nbsp;·&nbsp; Roster: ${state.roster.length} players
          </div>
        </div>
        <button class="btn btn-ghost" id="btn-to-draft-day">Skip to Draft →</button>
      </div>

      ${fas.length === 0 ? `<div class="empty-state">No free agents available</div>` : `
        <table class="data-table" id="fa-offseason-table">
          <thead><tr>
            <th>Player</th><th>Pos</th><th>Age</th>
            <th class="center">OVR</th><th class="center">POT</th>
            <th class="right">Asking</th><th class="center">Yrs</th><th></th>
          </tr></thead>
          <tbody id="fa-offseason-body">
            ${fas.map(p => freeAgentRow(p, capSpace)).join('')}
          </tbody>
        </table>`}

      <div style="display:flex;justify-content:flex-end;margin-top:20px;">
        <button class="btn btn-primary" id="btn-to-draft-day-bottom">Continue to Draft Day →</button>
      </div>`;

    document.getElementById('btn-to-draft-day')?.addEventListener('click', () => runDraftDay());
    document.getElementById('btn-to-draft-day-bottom')?.addEventListener('click', () => runDraftDay());
  }

  function freeAgentRow(p, capSpace) {
    const canSign = p.salary <= capSpace;
    return `
      <tr id="fa-row-${p.id}">
        <td class="player-name">${p.name}</td>
        <td><span class="player-pos">${p.pos}</span></td>
        <td class="stat-cell center">${p.age}</td>
        <td class="center"><span class="ovr-badge ${ovrCls(p.ovr)}">${p.ovr}</span></td>
        <td class="stat-cell center" style="color:${potClr(p.potential)}">${p.potential}</td>
        <td class="stat-cell right">$${p.salary.toFixed(1)}M / yr</td>
        <td class="stat-cell center">${p.contract_years}yr</td>
        <td>
          <button class="action-btn" ${canSign ? '' : 'disabled title="Insufficient cap space"'}
            onclick="Phases.signFA('${p.id}')">
            Sign
          </button>
        </td>
      </tr>`;
  }

  function signFA(playerId) {
    const result = GameState.signFreeAgent(playerId);
    if (!result.success) { alert(result.reason); return; }
    const row = document.getElementById(`fa-row-${playerId}`);
    if (row) row.style.opacity = '0.3';
    // Update cap space label
    const capSpace = GameState.getCapSpace();
    const capEl = document.querySelector('#os-panel-free-agency .stat-cell') || document.querySelector('#os-panel-free-agency');
    App.refreshDashboard();
    showToast(`Player signed! Cap space: $${capSpace.toFixed(1)}M`);
  }

  // ─── DRAFT DAY ─────────────────────────────────────────────────────────────
  let draftLog = [];
  let userPickNum = null;
  let draftPaused = false;

  async function runDraftDay() {
    App.showScreenPublic('screen-draft-day');

    const state = GameState.getState();
    const myId = state.meta.teamId;
    userPickNum = GameState.getDraftPickPosition();
    draftLog = [];
    let draftClass = [...state.draftClass];

    document.getElementById('dd-pick-position').textContent = `Your pick: #${userPickNum}`;
    document.getElementById('dd-scouting-left').textContent = state.scoutingActionsLeft;

    renderDraftBoard(draftClass, userPickNum);
    renderDraftTicker([]);

    return new Promise(async resolve => {
      for (let pick = 1; pick <= 30; pick++) {
        if (draftClass.length === 0) break;

        if (pick === userPickNum) {
          // User's pick — pause and let them choose
          await userPickTurn(pick, draftClass, resolve);
          break; // After user picks, we continue below
        } else {
          // Auto-sim pick
          const team = getTeamForPick(pick, myId);
          const prospect = autoPick(draftClass, team, pick);
          if (prospect) {
            draftClass = draftClass.filter(p => p.id !== prospect.id);
            const entry = {
              pick, team, prospect,
              note: await ClaudeAPI.generateDraftPickNote(prospect, team, pick),
            };
            draftLog.push(entry);
            renderDraftTicker(draftLog);
            renderDraftBoard(draftClass, userPickNum);
            await sleep(250);
          }
        }
      }
    });
  }

  async function userPickTurn(pick, draftClass, resolve) {
    document.getElementById('dd-user-turn-banner').style.display = 'block';
    document.getElementById('dd-user-turn-banner').innerHTML = `
      <div style="text-align:center;padding:16px;background:var(--team-glow);border:1px solid var(--team-primary);border-radius:var(--radius-lg);margin-bottom:16px;">
        <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px;color:var(--team-primary)">
          YOU ARE ON THE CLOCK — PICK #${pick}
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
          Click a prospect below to make your selection
        </div>
      </div>`;

    renderDraftBoardWithCallback(draftClass, userPickNum, async (prospect) => {
      document.getElementById('dd-user-turn-banner').style.display = 'none';
      const newPlayer = GameState.draftPlayer(prospect.id, pick);
      draftLog.push({ pick, team: GameState.getState().meta.teamId, prospect, note: 'YOUR PICK', userPick: true });
      renderDraftTicker(draftLog);

      showToast(`🎉 ${prospect.name} drafted!`, 3000);

      // Continue simming remaining picks briefly
      let remaining = GameState.getState().draftClass.slice(0, Math.min(8, 30 - pick));
      for (let i = 0; i < remaining.length; i++) {
        const nextPick = pick + i + 1;
        const team = getTeamForPick(nextPick, GameState.getState().meta.teamId);
        const p = autoPick(remaining, team, nextPick);
        if (p) {
          remaining = remaining.filter(x => x.id !== p.id);
          draftLog.push({ pick: nextPick, team, prospect: p, note: `Selected by ${teamAbbr(team)}` });
          renderDraftTicker(draftLog);
          await sleep(180);
        }
      }

      // Show continue button
      document.getElementById('dd-continue-btn').style.display = 'block';
      document.getElementById('dd-continue-btn').addEventListener('click', () => {
        resolve();
        beginNewSeason();
      });
    });
  }

  function autoPick(draftClass, teamId, pickNum) {
    if (!draftClass.length) return null;
    // Lottery picks favor high potential; late picks favor readiness
    if (pickNum <= 10) {
      return [...draftClass].sort((a, b) => b.ratings.potential - a.ratings.potential)[0];
    }
    return [...draftClass].sort((a, b) => b.ratings.ovr - a.ratings.ovr)[0];
  }

  function getTeamForPick(pick, myId) {
    // Assign picks to teams in reverse standings order (worst team picks first)
    const allTeams = [...TEAM_IDS].filter(t => t !== myId);
    return allTeams[(pick - 1) % allTeams.length];
  }

  function renderDraftBoard(draftClass, myPick, onSelect = null) {
    const el = document.getElementById('dd-draft-board');
    if (!el) return;

    el.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:2px;color:var(--text-muted);margin-bottom:10px;">
        AVAILABLE PROSPECTS
      </div>
      ${draftClass.map(p => `
        <div class="draft-board-row ${onSelect ? 'draft-board-row-selectable' : ''}"
             ${onSelect ? `onclick="Phases._handleDraftBoardClick('${p.id}')"` : ''}
             data-prospect="${p.id}">
          <span class="prospect-tier ${p.tier}" style="font-size:9px;">${p.tier.replace('-',' ')}</span>
          <span class="player-name" style="flex:1;">${p.name}</span>
          <span class="player-pos">${p.pos}</span>
          <span style="font-size:11px;color:var(--text-muted);">${p.school}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">Age ${p.age}</span>
          ${p.scouted ? `<span class="ovr-badge ${ovrCls(p.ratings.ovr)}">${p.ratings.ovr}</span>` : '<span class="ovr-badge bench">?</span>'}
        </div>`).join('')}`;
  }

  // Stored callback for when user clicks a draft board row
  let _draftSelectCallback = null;
  function _handleDraftBoardClick(prospectId) {
    if (_draftSelectCallback) {
      const state = GameState.getState();
      const p = state.draftClass.find(x => x.id === prospectId);
      if (p) _draftSelectCallback(p);
    }
  }

  // Override renderDraftBoard to store callback
  const _origRenderDraftBoard = renderDraftBoard;
  function renderDraftBoardWithCallback(draftClass, myPick, onSelect) {
    _draftSelectCallback = onSelect || null;
    _origRenderDraftBoard(draftClass, myPick, onSelect);
  }

  function renderDraftTicker(log) {
    const el = document.getElementById('dd-ticker');
    if (!el) return;
    el.innerHTML = [...log].reverse().map(entry => `
      <div class="ticker-entry ${entry.userPick ? 'ticker-mine' : ''}">
        <span class="ticker-pick">#${entry.pick}</span>
        <span class="ticker-team" style="color:${teamColor(entry.team)}">${teamAbbr(entry.team)}</span>
        <span class="ticker-name">${entry.prospect.name}</span>
        <span class="ticker-pos">${entry.prospect.pos}</span>
        <span class="ticker-note">${entry.note || ''}</span>
      </div>`).join('');
  }

  // ─── NEW SEASON START ──────────────────────────────────────────────────────
  function beginNewSeason() {
    const state = GameState.getState();
    state.meta.phase = 'regular_season';
    state.meta.week = 0;
    state.meta.gamesPlayed = 0;
    state.team.wins = 0;
    state.team.losses = 0;
    state.team.streak = 0;
    state._warningShown = false;
    state._pressConferenceShown = false;
    // Reset standings
    TEAM_IDS.forEach(tid => {
      state.standings[tid] = { wins: 0, losses: 0, confRank: null };
    });
    GameState.autoSave();
    App.showScreenPublic('screen-dashboard');
    App.refreshDashboard();
    App.switchTab('overview');
    showToast(`Season ${state.meta.season} — Let's go!`, 3000);
  }

  // ─── SHARED HELPERS ────────────────────────────────────────────────────────
  function ovrCls(ovr) {
    if (ovr >= 93) return 'elite';
    if (ovr >= 83) return 'allstar';
    if (ovr >= 73) return 'starter';
    return 'bench';
  }

  function potClr(p) {
    if (p >= 90) return 'var(--yellow)';
    if (p >= 80) return 'var(--blue)';
    return 'var(--text-muted)';
  }

  function showToast(msg, ms = 2500) {
    let t = document.getElementById('toast-msg');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast-msg';
      t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
        background:var(--bg-card);border:1px solid var(--border);
        border-left:3px solid var(--team-primary);padding:10px 20px;
        border-radius:var(--radius);font-family:var(--font-mono);font-size:11px;
        color:var(--text-primary);z-index:9999;pointer-events:none;`;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.display = 'none'; }, ms);
  }

  // Public API
  return {
    runPlayoffs,
    runOffseason,
    runDraftDay,
    beginNewSeason,
    signFA,
    showMissedPlayoffs,
    // For onclick handlers
    _handleDraftBoardClick,
  };

})();
