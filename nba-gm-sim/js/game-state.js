// game-state.js — Central game state manager
// Single serializable object for LocalStorage persistence

const GameState = (() => {

  // ─── CONSTANTS ─────────────────────────────────────────────────────────────
  const SALARY_CAP = 140;
  const LUXURY_TAX = 165;
  const HARD_CAP = 185;
  const GAMES_PER_SEASON = 40;
  const TRADE_DEADLINE_GAME = 20;

  const SEASON_PHASES = ['offseason', 'draft', 'training_camp', 'regular_season', 'playoffs'];

  const PRESSURE_EVENTS = {
    win_championship: -60,
    make_finals: -25,
    win_conference: -15,
    make_playoffs: -10,
    miss_playoffs: +25,
    luxury_tax: +5,
    win_streak_10: -5,
    lose_streak_10: +10,
    star_leaves_fa: +10,
  };

  // ─── STATE TEMPLATE ────────────────────────────────────────────────────────
  function createInitialState() {
    return {
      version: '1.0',
      meta: {
        gmName: 'General Manager',
        teamId: null,
        season: 1,
        startYear: 2025,
        phase: 'team_select', // team_select → gm_name → briefing → offseason → draft → training_camp → regular_season → playoffs
        week: 0,
        gamesPlayed: 0,
        createdAt: Date.now(),
        lastSaved: Date.now(),
      },
      team: {
        id: null,
        wins: 0,
        losses: 0,
        confSeed: null,
        streak: 0,        // positive = win streak, negative = lose streak
        playoffAppearances: 0,
        championships: 0,
        consecutiveMissedPlayoffs: 0,
      },
      roster: [],           // array of player objects (deep copy from players.js)
      draftPicks: [],       // [{team, year, round, protected: null|'top-N', originalTeam}]
      leagueRosters: {},    // teamId → array of players (all 30 teams)
      freeAgents: [],       // players not on a roster
      draftClass: [],       // current year draft prospects
      scoutingActionsLeft: 5,
      ownershipPressure: 30,
      pressureHistory: [],
      gameLog: [],          // [{week, opponent, result:'W'|'L', score:'110-98', ptsFor, ptsAgainst}]
      eventHistory: [],     // [{season, week, type, narrative, choiceMade}]
      tradeHistory: [],     // [{season, week, gave:[], received:[], otherTeam}]
      seasonHistory: [],    // [{season, wins, losses, pressure, result:'champion'|'finalist'|'semifinals'|'first_round'|'missed_playoffs'}]
      achievements: {
        dynasty: false,
        riseFromAshes: false,
        draftWizard: false,
        underPressure: false,
        loyalBuilder: false,
        tradeDeadlineKing: false,
      },
      standings: {},        // teamId → {wins, losses, confRank}
      leagueLeaders: {
        ppg: [], rpg: [], apg: []
      },
      injuries: [],         // [{playerId, weeksRemaining, description}]
      incomingTradeOffers: [],
      apiKey: null,
      settings: {
        simulationSpeed: 'normal',
        autoSave: true,
      },
      ui: {
        activeTab: 'dashboard',
        lastEvent: null,
      }
    };
  }

  // ─── STATE REFERENCE ───────────────────────────────────────────────────────
  let state = createInitialState();

  // ─── INITIALIZATION ────────────────────────────────────────────────────────
  function init(teamId, gmName) {
    const team = NBA_TEAMS[teamId];
    if (!team) throw new Error(`Unknown team: ${teamId}`);

    state.meta.teamId = teamId;
    state.meta.gmName = gmName || 'General Manager';
    state.meta.phase = 'briefing';
    state.team.id = teamId;

    // Set starting pressure based on difficulty
    const pressureMap = { contender: 40, competitive: 30, rebuilder: 20 };
    state.ownershipPressure = team.startingPressure || pressureMap[team.difficulty] || 30;

    // Deep copy all players into league rosters
    const allPlayers = getInitialRosters();
    state.leagueRosters = {};
    TEAM_IDS.forEach(tid => { state.leagueRosters[tid] = []; });
    allPlayers.forEach(p => {
      if (state.leagueRosters[p.team]) {
        state.leagueRosters[p.team].push(p);
      }
    });

    // Set player roster
    state.roster = state.leagueRosters[teamId].map(p => ({ ...p }));

    // Initialize standings
    TEAM_IDS.forEach(tid => {
      state.standings[tid] = { wins: 0, losses: 0, confRank: null };
    });

    // Draft picks: give player team their first-round pick for current + 2 future seasons
    state.draftPicks = [
      { id: `pick_${teamId}_2025_1`, team: teamId, year: 2025, round: 1, protected: null, originalTeam: teamId },
      { id: `pick_${teamId}_2026_1`, team: teamId, year: 2026, round: 1, protected: null, originalTeam: teamId },
      { id: `pick_${teamId}_2027_1`, team: teamId, year: 2027, round: 1, protected: null, originalTeam: teamId },
      { id: `pick_${teamId}_2025_2`, team: teamId, year: 2025, round: 2, protected: null, originalTeam: teamId },
    ];

    // Initialize draft class
    state.draftClass = getInitialDraftClass();

    // Initialize free agents pool (empty at season start, populated in offseason)
    state.freeAgents = [];

    autoSave();
    return state;
  }

  // ─── GETTERS ───────────────────────────────────────────────────────────────
  function getState() { return state; }

  function getTeam() { return NBA_TEAMS[state.team.id]; }

  function getRoster() { return state.roster; }

  function getRecord() { return `${state.team.wins}-${state.team.losses}`; }

  function getTotalSalary() {
    return state.roster.reduce((sum, p) => sum + (p.salary || 0), 0);
  }

  function getCapSpace() {
    return Math.max(0, SALARY_CAP - getTotalSalary());
  }

  function isOverLuxuryTax() {
    return getTotalSalary() > LUXURY_TAX;
  }

  function getSeasonYear() {
    return state.meta.startYear + state.meta.season - 1;
  }

  function getPhase() { return state.meta.phase; }

  function getWeek() { return state.meta.week; }

  function getPressure() { return state.ownershipPressure; }

  function getActiveInjuries() {
    return state.injuries.filter(i => i.weeksRemaining > 0);
  }

  function getPlayerById(id) {
    return state.roster.find(p => p.id === id) ||
           Object.values(state.leagueRosters).flat().find(p => p.id === id);
  }

  function getTopFreeAgents(limit = 20) {
    return [...state.freeAgents].sort((a, b) => b.ovr - a.ovr).slice(0, limit);
  }

  function getConferenceStandings(conf) {
    const teams = conf === 'East' ? EAST_TEAMS : WEST_TEAMS;
    return teams
      .map(tid => ({ teamId: tid, ...state.standings[tid], team: NBA_TEAMS[tid] }))
      .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  }

  // ─── GAME LOG ──────────────────────────────────────────────────────────────
  function addGameResult(opponentId, result, ptsFor, ptsAgainst) {
    const entry = {
      week: state.meta.week,
      gameNum: state.meta.gamesPlayed + 1,
      opponent: opponentId,
      result,
      score: `${ptsFor}-${ptsAgainst}`,
      ptsFor,
      ptsAgainst,
    };
    state.gameLog.unshift(entry);
    if (state.gameLog.length > 40) state.gameLog.pop();

    // Update record
    if (result === 'W') {
      state.team.wins++;
      state.standings[state.team.id].wins++;
      state.team.streak = state.team.streak >= 0 ? state.team.streak + 1 : 1;
    } else {
      state.team.losses++;
      state.standings[state.team.id].losses++;
      state.team.streak = state.team.streak <= 0 ? state.team.streak - 1 : -1;
    }
    state.meta.gamesPlayed++;

    // Check streak pressure events
    if (state.team.streak >= 10) adjustPressure(PRESSURE_EVENTS.win_streak_10, 'Win streak of 10+');
    if (state.team.streak <= -10) adjustPressure(PRESSURE_EVENTS.lose_streak_10, 'Lose streak of 10+');

    autoSave();
    return entry;
  }

  // ─── SIMULATION ENGINE ─────────────────────────────────────────────────────
  function simulateGame(opponentId) {
    const myRoster = state.roster.filter(p => !p.injured);
    const oppRoster = state.leagueRosters[opponentId] || [];

    const myOvr = averageOvr(myRoster) + moraleBonus(myRoster);
    const oppOvr = averageOvr(oppRoster);
    const homeCourt = 2; // slight home court advantage

    // Base scores driven by OVR differential with randomness
    const diff = myOvr - oppOvr + homeCourt;
    const variance = 12;
    const gameRoll = (Math.random() - 0.5) * 2 * variance;
    const won = (diff + gameRoll) > 0;

    // Generate realistic scores
    const avgScore = 112 + (diff * 0.3);
    const ptsFor = Math.round(avgScore + (Math.random() - 0.5) * 20 + (won ? 4 : -4));
    const ptsAgainst = Math.round(avgScore - diff * 0.3 + (Math.random() - 0.5) * 18 + (won ? -4 : 4));
    const finalFor = Math.max(88, Math.min(145, ptsFor));
    const finalAgainst = Math.max(88, Math.min(145, ptsAgainst));

    // Sim other team result vs random opponent
    simLeagueGame(opponentId);

    return addGameResult(opponentId, won ? 'W' : 'L', finalFor, finalAgainst);
  }

  function simLeagueGame(teamId) {
    // Simulate a game for a league team to update standings
    const opponents = TEAM_IDS.filter(t => t !== teamId && t !== state.team.id);
    const opp = opponents[Math.floor(Math.random() * opponents.length)];
    if (!state.standings[teamId] || !state.standings[opp]) return;
    if (Math.random() > 0.5) {
      state.standings[teamId].wins++;
      state.standings[opp].losses++;
    } else {
      state.standings[teamId].losses++;
      state.standings[opp].wins++;
    }
  }

  function simulateWeek(gamesInChunk) {
    const opponents = getRandomOpponents(gamesInChunk);
    const results = [];
    for (let i = 0; i < gamesInChunk; i++) {
      const result = simulateGame(opponents[i]);
      results.push(result);
    }
    state.meta.week++;

    // Sim remaining teams to keep standings realistic
    TEAM_IDS.filter(t => t !== state.team.id).forEach(tid => {
      for (let i = 0; i < gamesInChunk; i++) {
        simLeagueGame(tid);
      }
    });

    // Check for end of regular season
    if (state.meta.gamesPlayed >= GAMES_PER_SEASON) {
      state.meta.phase = 'playoffs';
    }

    updateInjuries();
    autoSave();
    return results;
  }

  function getRandomOpponents(count) {
    const conf = getTeam().conference;
    const sameConf = (conf === 'East' ? EAST_TEAMS : WEST_TEAMS).filter(t => t !== state.team.id);
    const otherConf = (conf === 'East' ? WEST_TEAMS : EAST_TEAMS);

    const pool = [...sameConf, ...sameConf, ...otherConf]; // weight same conference
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return result;
  }

  function averageOvr(players) {
    if (!players.length) return 70;
    const top8 = [...players].sort((a, b) => b.ovr - a.ovr).slice(0, 8);
    return top8.reduce((s, p) => s + p.ovr, 0) / top8.length;
  }

  function moraleBonus(players) {
    const avgMorale = players.reduce((s, p) => s + (p.morale || 80), 0) / players.length;
    return (avgMorale - 75) * 0.1; // small bonus/penalty
  }

  // ─── INJURY SYSTEM ─────────────────────────────────────────────────────────
  function checkForInjury() {
    // Random injury check — higher chance for high-mileage older players
    const candidates = state.roster.filter(p => !p.injured && p.age > 28);
    if (!candidates.length || Math.random() > 0.08) return null;

    const player = candidates[Math.floor(Math.random() * candidates.length)];
    const weeks = 1 + Math.floor(Math.random() * 5);
    const injuryTypes = ['ankle sprain', 'hamstring strain', 'knee soreness', 'hip flexor', 'back tightness'];
    const type = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];

    player.injured = true;
    player.injuryWeeks = weeks;
    state.injuries.push({ playerId: player.id, playerName: player.name, weeksRemaining: weeks, type });

    return { player, weeks, type };
  }

  function updateInjuries() {
    state.injuries.forEach(inj => {
      if (inj.weeksRemaining > 0) {
        inj.weeksRemaining--;
        if (inj.weeksRemaining === 0) {
          const player = state.roster.find(p => p.id === inj.playerId);
          if (player) {
            player.injured = false;
            player.injuryWeeks = 0;
          }
        }
      }
    });
    state.injuries = state.injuries.filter(i => i.weeksRemaining > 0);
  }

  // ─── TRADE SYSTEM ──────────────────────────────────────────────────────────
  function checkSalaryMatch(outgoing, incoming) {
    const outSalary = outgoing.reduce((s, p) => s + (p.salary || 0), 0);
    const inSalary = incoming.reduce((s, p) => s + (p.salary || 0), 0);
    const luxuryMultiplier = isOverLuxuryTax() ? 1.10 : 1.25;
    const maxOut = inSalary * luxuryMultiplier + 0.1;
    if (outSalary > maxOut) return { valid: false, reason: `Salary mismatch. Sending out $${outSalary.toFixed(1)}M but can only send $${maxOut.toFixed(1)}M` };
    const newTotal = getTotalSalary() - outSalary + inSalary;
    if (newTotal > HARD_CAP) return { valid: false, reason: `Trade would exceed hard cap ($${HARD_CAP}M)` };
    return { valid: true };
  }

  function executeTrade(myPlayers, myPicks, theirPlayers, theirPicks, otherTeamId) {
    // Remove my players from roster
    myPlayers.forEach(p => {
      state.roster = state.roster.filter(r => r.id !== p.id);
      if (state.leagueRosters[state.team.id]) {
        state.leagueRosters[state.team.id] = state.leagueRosters[state.team.id].filter(r => r.id !== p.id);
      }
      if (state.leagueRosters[otherTeamId]) {
        state.leagueRosters[otherTeamId].push({ ...p, team: otherTeamId });
      }
    });

    // Remove my picks
    myPicks.forEach(pick => {
      state.draftPicks = state.draftPicks.filter(dp => dp.id !== pick.id);
    });

    // Add their players to roster
    theirPlayers.forEach(p => {
      const updated = { ...p, team: state.team.id };
      state.roster.push(updated);
      if (state.leagueRosters[state.team.id]) {
        state.leagueRosters[state.team.id].push(updated);
      }
      if (state.leagueRosters[otherTeamId]) {
        state.leagueRosters[otherTeamId] = state.leagueRosters[otherTeamId].filter(r => r.id !== p.id);
      }
    });

    // Add their picks
    theirPicks.forEach(pick => {
      state.draftPicks.push({ ...pick, team: state.team.id });
    });

    // Log trade
    state.tradeHistory.push({
      season: state.meta.season,
      week: state.meta.week,
      gave: [...myPlayers.map(p => p.name), ...myPicks.map(p => `${p.year} ${p.team} 1st`)],
      received: [...theirPlayers.map(p => p.name), ...theirPicks.map(p => `${p.year} ${p.team} 1st`)],
      otherTeam: otherTeamId,
    });

    autoSave();
    return true;
  }

  // ─── FREE AGENCY ───────────────────────────────────────────────────────────
  function signFreeAgent(playerId) {
    const player = state.freeAgents.find(p => p.id === playerId);
    if (!player) return { success: false, reason: 'Player not found in free agency' };
    if (getTotalSalary() + player.salary > HARD_CAP) {
      return { success: false, reason: `Signing would exceed hard cap ($${HARD_CAP}M)` };
    }
    player.team = state.team.id;
    state.roster.push(player);
    state.freeAgents = state.freeAgents.filter(p => p.id !== playerId);
    autoSave();
    return { success: true };
  }

  function releasePLayer(playerId) {
    const player = state.roster.find(p => p.id === playerId);
    if (!player) return false;
    state.roster = state.roster.filter(p => p.id !== playerId);
    player.team = 'FA';
    player.salary = Math.max(0.8, player.salary * 0.4); // Released players take discount
    state.freeAgents.push(player);
    autoSave();
    return true;
  }

  // ─── PRESSURE METER ────────────────────────────────────────────────────────
  function adjustPressure(delta, reason) {
    state.ownershipPressure = Math.min(100, Math.max(0, state.ownershipPressure + delta));
    state.pressureHistory.push({
      season: state.meta.season,
      week: state.meta.week,
      delta,
      reason,
      newValue: state.ownershipPressure,
    });
    autoSave();

    if (state.ownershipPressure >= 100) {
      state.meta.phase = 'fired';
    }
    return state.ownershipPressure;
  }

  function endOfSeasonPressureAdjust(result) {
    const adjustments = {
      champion: PRESSURE_EVENTS.win_championship,
      finalist: PRESSURE_EVENTS.make_finals,
      conf_finals: PRESSURE_EVENTS.win_conference,
      playoffs: PRESSURE_EVENTS.make_playoffs,
      missed_playoffs: PRESSURE_EVENTS.miss_playoffs,
    };
    const delta = adjustments[result] || 0;
    if (delta !== 0) adjustPressure(delta, `Season result: ${result}`);

    if (isOverLuxuryTax()) {
      adjustPressure(PRESSURE_EVENTS.luxury_tax, 'Over luxury tax');
    }

    if (result === 'missed_playoffs') {
      state.team.consecutiveMissedPlayoffs++;
      if (state.team.consecutiveMissedPlayoffs >= 2) {
        state.meta.phase = 'fired';
      }
    } else {
      state.team.consecutiveMissedPlayoffs = 0;
      state.team.playoffAppearances++;
    }
    if (result === 'champion') state.team.championships++;

    state.seasonHistory.push({
      season: state.meta.season,
      wins: state.team.wins,
      losses: state.team.losses,
      pressure: state.ownershipPressure,
      result,
    });
    autoSave();
  }

  // ─── DRAFT SYSTEM ──────────────────────────────────────────────────────────
  function scoutProspect(prospectId) {
    if (state.scoutingActionsLeft <= 0) return { success: false, reason: 'No scouting actions remaining' };
    const prospect = state.draftClass.find(p => p.id === prospectId);
    if (!prospect) return { success: false, reason: 'Prospect not found' };
    if (prospect.scouted) return { success: false, reason: 'Already scouted' };
    prospect.scouted = true;
    state.scoutingActionsLeft--;
    autoSave();
    return { success: true, prospect };
  }

  function draftPlayer(prospectId, pickNumber) {
    const prospect = state.draftClass.find(p => p.id === prospectId);
    if (!prospect) return false;

    // Convert prospect to player
    const newPlayer = {
      id: `drafted_${prospectId}`,
      name: prospect.name,
      pos: prospect.pos,
      team: state.team.id,
      age: prospect.age,
      ...prospect.ratings,
      salary: pickNumber <= 5 ? 10.0 : pickNumber <= 14 ? 6.5 : 4.0,
      contract_years: 4,
      morale: 90,
      stats: { ppg: 0, rpg: 0, apg: 0, gamesPlayed: 0 },
      injured: false,
      injuryWeeks: 0,
    };

    state.roster.push(newPlayer);
    state.draftClass = state.draftClass.filter(p => p.id !== prospectId);
    autoSave();
    return newPlayer;
  }

  function getDraftPickPosition() {
    const myWins = state.standings[state.team.id]?.wins || 0;
    const myLosses = state.standings[state.team.id]?.losses || 0;
    const myWinPct = myWins / Math.max(1, myWins + myLosses);
    const teams = TEAM_IDS.map(tid => ({
      tid,
      wins: state.standings[tid]?.wins || 0,
      losses: state.standings[tid]?.losses || 0,
    }));
    teams.sort((a, b) => (a.wins / Math.max(1, a.wins + a.losses)) - (b.wins / Math.max(1, b.wins + b.losses)));
    const myPos = teams.findIndex(t => t.tid === state.team.id) + 1;
    return myPos;
  }

  // ─── PLAYER DEVELOPMENT ────────────────────────────────────────────────────
  function applyOffseasonDevelopment() {
    const narratives = [];
    state.roster.forEach(player => {
      const { delta, narrative } = calculateDevelopment(player);
      if (delta !== 0) {
        player.ovr = Math.min(99, Math.max(40, player.ovr + delta));
        player.age++;
        player.contract_years = Math.max(0, player.contract_years - 1);
        if (narrative) narratives.push(narrative);
      } else {
        player.age++;
        player.contract_years = Math.max(0, player.contract_years - 1);
      }
    });
    // Also age/develop all league players
    Object.values(state.leagueRosters).forEach(roster => {
      roster.forEach(p => {
        const { delta } = calculateDevelopment(p);
        p.ovr = Math.min(99, Math.max(40, p.ovr + delta));
        p.age++;
        p.contract_years = Math.max(0, p.contract_years - 1);
      });
    });
    return narratives;
  }

  function calculateDevelopment(player) {
    const age = player.age;
    const potential = player.potential || 75;
    const morale = player.morale || 80;
    const moraleMultiplier = morale > 80 ? 1.1 : morale < 60 ? 0.85 : 1.0;

    let base, variance, narrative = null;

    if (age <= 22) {
      base = 1 + (potential - 75) * 0.06;
      variance = 4;
    } else if (age <= 27) {
      base = 0.8 + (potential - 75) * 0.02;
      variance = 2;
    } else if (age <= 30) {
      base = 0.2;
      variance = 1;
    } else if (age <= 33) {
      base = -1.0;
      variance = 1;
    } else {
      base = -2.0;
      variance = 1.5;
    }

    base *= moraleMultiplier;
    const roll = (Math.random() - 0.5) * variance * 2;
    const delta = Math.round(base + roll);

    // Generate narrative for significant changes
    if (delta >= 4) narrative = `${player.name} had a transformative offseason — scouts are raving about his development.`;
    else if (delta >= 2 && age <= 23) narrative = `${player.name} showed impressive growth, raising his ceiling significantly.`;
    else if (delta <= -3) narrative = `Concerning signs for ${player.name} — the decline is accelerating.`;

    return { delta, narrative };
  }

  // ─── OFFSEASON LOGIC ───────────────────────────────────────────────────────
  function startOffseason() {
    state.meta.phase = 'offseason';
    state.meta.week = 0;
    state.meta.gamesPlayed = 0;
    state.team.wins = 0;
    state.team.losses = 0;
    state.team.streak = 0;

    // Expiring contracts become free agents
    const expiring = state.roster.filter(p => p.contract_years <= 0);
    expiring.forEach(p => {
      state.roster = state.roster.filter(r => r.id !== p.id);
      p.team = 'FA';
      state.freeAgents.push(p);
    });

    // Add some league-wide free agents
    Object.values(state.leagueRosters).forEach(roster => {
      const leagueFAs = roster.filter(p => p.contract_years <= 0);
      leagueFAs.forEach(p => {
        p.team = 'FA';
        if (!state.freeAgents.find(fa => fa.id === p.id)) state.freeAgents.push(p);
      });
    });

    // Reset standings
    TEAM_IDS.forEach(tid => {
      state.standings[tid] = { wins: 0, losses: 0, confRank: null };
    });

    // Reset scouting
    state.scoutingActionsLeft = 5;
    state.draftClass = getInitialDraftClass();

    state.meta.season++;
    autoSave();
  }

  // ─── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  function checkAchievements() {
    const a = state.achievements;
    if (!a.dynasty && state.team.championships >= 3) {
      a.dynasty = true;
      return 'Dynasty';
    }
    if (!a.riseFromAshes && state.team.championships > 0 && NBA_TEAMS[state.team.id]?.difficulty === 'rebuilder') {
      a.riseFromAshes = true;
      return 'Rise from the Ashes';
    }
    const hasDraftWizard = state.roster.some(p => p.id.startsWith('drafted_') && p.ovr >= 85);
    if (!a.draftWizard && hasDraftWizard) {
      a.draftWizard = true;
      return 'Draft Wizard';
    }
    if (!a.underPressure && state.team.championships > 0 && state.ownershipPressure >= 70) {
      a.underPressure = true;
      return 'Under Pressure';
    }
    return null;
  }

  // ─── EVENT SYSTEM ──────────────────────────────────────────────────────────
  function shouldFireEvent() {
    const week = state.meta.week;
    const pressure = state.ownershipPressure;
    const isDeadlineZone = state.meta.gamesPlayed >= 15 && state.meta.gamesPlayed <= 22;

    let baseProb = 0.20;
    if (pressure > 60) baseProb += 0.10;
    if (state.team.streak <= -4) baseProb += 0.10;
    if (isDeadlineZone) baseProb += 0.15;

    return Math.random() < baseProb;
  }

  function getEventContext() {
    const roster = state.roster.slice(0, 8).map(p => `${p.name} (${p.ovr} OVR, morale: ${p.morale})`).join(', ');
    return {
      teamName: getTeam().fullName,
      gmName: state.meta.gmName,
      season: state.meta.season,
      week: state.meta.week,
      record: getRecord(),
      ownershipPressure: state.ownershipPressure,
      rosterSummary: roster,
      recentGames: state.gameLog.slice(0, 5).map(g => `${g.result} ${g.score} vs ${g.opponent}`).join(', '),
      gamesPlayed: state.meta.gamesPlayed,
      salaryInfo: `$${getTotalSalary().toFixed(1)}M / $${SALARY_CAP}M cap`,
    };
  }

  function recordEventChoice(eventType, narrative, choiceMade) {
    state.eventHistory.push({
      season: state.meta.season,
      week: state.meta.week,
      type: eventType,
      narrative,
      choiceMade,
    });
    state.ui.lastEvent = { type: eventType, narrative, choiceMade, timestamp: Date.now() };
    autoSave();
  }

  // ─── LEAGUE LEADERS ────────────────────────────────────────────────────────
  function updateLeagueLeaders() {
    const allPlayers = [
      ...state.roster,
      ...Object.values(state.leagueRosters).flat()
    ];

    const withStats = allPlayers.map(p => {
      const s = estimateStats(p);
      return { ...p, estPpg: s.ppg, estRpg: s.rpg, estApg: s.apg };
    });

    state.leagueLeaders.ppg = withStats.sort((a, b) => b.estPpg - a.estPpg).slice(0, 5).map(p => ({
      name: p.name, team: p.team, value: p.estPpg, isMyPlayer: p.team === state.team.id
    }));
    state.leagueLeaders.rpg = withStats.sort((a, b) => b.estRpg - a.estRpg).slice(0, 5).map(p => ({
      name: p.name, team: p.team, value: p.estRpg, isMyPlayer: p.team === state.team.id
    }));
    state.leagueLeaders.apg = withStats.sort((a, b) => b.estApg - a.estApg).slice(0, 5).map(p => ({
      name: p.name, team: p.team, value: p.estApg, isMyPlayer: p.team === state.team.id
    }));
  }

  // ─── SAVE / LOAD ───────────────────────────────────────────────────────────
  const SAVE_KEY_PREFIX = 'nba_gm_save_';
  const AUTO_SAVE_KEY = 'nba_gm_autosave';

  function autoSave() {
    if (!state.settings.autoSave) return;
    state.meta.lastSaved = Date.now();
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('AutoSave failed:', e.message);
    }
  }

  function saveToSlot(slotNum, label) {
    const key = `${SAVE_KEY_PREFIX}${slotNum}`;
    const saveData = {
      ...state,
      meta: { ...state.meta, lastSaved: Date.now(), saveLabel: label }
    };
    try {
      localStorage.setItem(key, JSON.stringify(saveData));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadFromSlot(slotNum) {
    const key = `${SAVE_KEY_PREFIX}${slotNum}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      state = JSON.parse(raw);
      return state;
    } catch (e) {
      return null;
    }
  }

  function loadAutoSave() {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_KEY);
      if (!raw) return null;
      state = JSON.parse(raw);
      return state;
    } catch (e) {
      return null;
    }
  }

  function getSaveSlots() {
    const slots = [];
    for (let i = 1; i <= 3; i++) {
      const key = `${SAVE_KEY_PREFIX}${i}`;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw);
          slots.push({
            slot: i,
            teamId: data.meta.teamId,
            season: data.meta.season,
            record: `${data.team.wins}-${data.team.losses}`,
            phase: data.meta.phase,
            lastSaved: new Date(data.meta.lastSaved).toLocaleDateString(),
            label: data.meta.saveLabel || `Season ${data.meta.season}`,
          });
        } else {
          slots.push({ slot: i, empty: true });
        }
      } catch {
        slots.push({ slot: i, empty: true });
      }
    }
    return slots;
  }

  function hasAutoSave() {
    return !!localStorage.getItem(AUTO_SAVE_KEY);
  }

  function setApiKey(key) {
    state.apiKey = key;
    autoSave();
  }

  function getApiKey() {
    return state.apiKey;
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────────────
  return {
    // Init
    init, createInitialState,
    // Getters
    getState, getTeam, getRoster, getRecord, getTotalSalary, getCapSpace,
    isOverLuxuryTax, getSeasonYear, getPhase, getWeek, getPressure,
    getActiveInjuries, getPlayerById, getTopFreeAgents, getConferenceStandings,
    getDraftPickPosition,
    // Game simulation
    simulateWeek, simulateGame, checkForInjury,
    // Trade
    checkSalaryMatch, executeTrade,
    // Free agency
    signFreeAgent, releasePLayer,
    // Draft
    scoutProspect, draftPlayer,
    // Development
    applyOffseasonDevelopment,
    // Offseason
    startOffseason,
    // Pressure
    adjustPressure, endOfSeasonPressureAdjust,
    // Events
    shouldFireEvent, getEventContext, recordEventChoice,
    // Achievements
    checkAchievements,
    // Leaders
    updateLeagueLeaders,
    // Save/Load
    autoSave, saveToSlot, loadFromSlot, loadAutoSave, getSaveSlots, hasAutoSave,
    // Settings
    setApiKey, getApiKey,
    // Constants
    SALARY_CAP, LUXURY_TAX, HARD_CAP, GAMES_PER_SEASON, TRADE_DEADLINE_GAME,
  };

})();
