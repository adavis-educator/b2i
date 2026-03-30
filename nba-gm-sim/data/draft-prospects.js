// DRAFT_PROSPECTS_2025 — Real 2025 NBA Draft first-round prospects
// Ratings are HIDDEN until the GM spends a scouting action
// tier: 'lottery' (1-14), 'late-first' (15-20), 'project' (21-30)

const DRAFT_PROSPECTS_2025 = [
  {
    id: 'prospect_flagg', name: 'Cooper Flagg', pos: 'PF', age: 18,
    school: 'Duke', country: 'USA',
    tier: 'lottery', projectedRange: '1-2',
    ratings: { ovr: 85, scoring: 83, playmaking: 80, defense: 85, athleticism: 87, iq: 88, potential: 97 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_harper', name: 'Dylan Harper', pos: 'PG', age: 19,
    school: 'Rutgers', country: 'USA',
    tier: 'lottery', projectedRange: '1-4',
    ratings: { ovr: 83, scoring: 85, playmaking: 82, defense: 72, athleticism: 84, iq: 80, potential: 94 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_edgecombe', name: 'V.J. Edgecombe', pos: 'SG', age: 19,
    school: 'Baylor', country: 'Bahamas',
    tier: 'lottery', projectedRange: '3-7',
    ratings: { ovr: 78, scoring: 80, playmaking: 70, defense: 78, athleticism: 92, iq: 72, potential: 90 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_tjohnson', name: 'Tre Johnson', pos: 'SG', age: 18,
    school: 'Texas', country: 'USA',
    tier: 'lottery', projectedRange: '3-8',
    ratings: { ovr: 80, scoring: 88, playmaking: 68, defense: 62, athleticism: 82, iq: 75, potential: 88 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_bailey', name: 'Ace Bailey', pos: 'SF', age: 18,
    school: 'Rutgers', country: 'USA',
    tier: 'lottery', projectedRange: '4-9',
    ratings: { ovr: 79, scoring: 82, playmaking: 72, defense: 72, athleticism: 86, iq: 74, potential: 91 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_knueppel', name: 'Kon Knueppel', pos: 'SG', age: 19,
    school: 'Duke', country: 'USA',
    tier: 'lottery', projectedRange: '5-11',
    ratings: { ovr: 77, scoring: 82, playmaking: 72, defense: 72, athleticism: 75, iq: 80, potential: 84 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_maluach', name: 'Khaman Maluach', pos: 'C', age: 18,
    school: 'Duke', country: 'South Sudan',
    tier: 'lottery', projectedRange: '6-12',
    ratings: { ovr: 76, scoring: 72, playmaking: 52, defense: 78, athleticism: 88, iq: 68, potential: 90 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_essengue', name: 'Noa Essengue', pos: 'PF', age: 17,
    school: 'Ratiopharm Ulm', country: 'France',
    tier: 'lottery', projectedRange: '7-14',
    ratings: { ovr: 74, scoring: 73, playmaking: 65, defense: 73, athleticism: 85, iq: 70, potential: 91 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_demin', name: 'Egor Demin', pos: 'PG', age: 18,
    school: 'BYU', country: 'Russia',
    tier: 'lottery', projectedRange: '8-15',
    ratings: { ovr: 73, scoring: 72, playmaking: 78, defense: 65, athleticism: 74, iq: 76, potential: 86 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_jakucionis', name: 'Kasparas Jakucionis', pos: 'PG', age: 20,
    school: 'Illinois', country: 'Lithuania',
    tier: 'lottery', projectedRange: '9-16',
    ratings: { ovr: 75, scoring: 76, playmaking: 79, defense: 68, athleticism: 73, iq: 78, potential: 84 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_mcneeley', name: 'Liam McNeeley', pos: 'SF', age: 19,
    school: 'UConn', country: 'USA',
    tier: 'lottery', projectedRange: '9-17',
    ratings: { ovr: 74, scoring: 78, playmaking: 65, defense: 70, athleticism: 76, iq: 75, potential: 83 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_cbryant', name: 'Carter Bryant', pos: 'SF', age: 19,
    school: 'Arizona', country: 'USA',
    tier: 'lottery', projectedRange: '10-18',
    ratings: { ovr: 73, scoring: 74, playmaking: 63, defense: 74, athleticism: 78, iq: 72, potential: 82 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_jrichardson', name: 'Jase Richardson', pos: 'PG', age: 19,
    school: 'Michigan State', country: 'USA',
    tier: 'lottery', projectedRange: '11-20',
    ratings: { ovr: 72, scoring: 73, playmaking: 76, defense: 67, athleticism: 72, iq: 77, potential: 82 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_rjluis', name: 'RJ Luis Jr.', pos: 'PF', age: 21,
    school: "St. John's", country: 'USA',
    tier: 'late-first', projectedRange: '12-20',
    ratings: { ovr: 72, scoring: 74, playmaking: 60, defense: 73, athleticism: 76, iq: 70, potential: 79 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_gonzalez', name: 'Hugo González', pos: 'SF', age: 19,
    school: 'Baskonia', country: 'Spain',
    tier: 'late-first', projectedRange: '13-22',
    ratings: { ovr: 71, scoring: 73, playmaking: 65, defense: 72, athleticism: 74, iq: 73, potential: 80 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_murrayboyles', name: 'Collin Murray-Boyles', pos: 'PF', age: 20,
    school: 'South Carolina', country: 'USA',
    tier: 'late-first', projectedRange: '14-22',
    ratings: { ovr: 71, scoring: 70, playmaking: 58, defense: 76, athleticism: 77, iq: 71, potential: 79 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_broome', name: 'Johni Broome', pos: 'C', age: 23,
    school: 'Auburn', country: 'USA',
    tier: 'late-first', projectedRange: '15-24',
    ratings: { ovr: 74, scoring: 76, playmaking: 60, defense: 74, athleticism: 72, iq: 78, potential: 76 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_riley', name: 'Will Riley', pos: 'SF', age: 19,
    school: 'Illinois', country: 'Canada',
    tier: 'late-first', projectedRange: '15-25',
    ratings: { ovr: 70, scoring: 74, playmaking: 63, defense: 65, athleticism: 75, iq: 69, potential: 80 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_fland', name: 'Boogie Fland', pos: 'PG', age: 19,
    school: 'Arkansas', country: 'USA',
    tier: 'late-first', projectedRange: '16-26',
    ratings: { ovr: 70, scoring: 72, playmaking: 74, defense: 63, athleticism: 73, iq: 72, potential: 80 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_philon', name: 'Labaron Philon', pos: 'PG', age: 20,
    school: 'Alabama', country: 'USA',
    tier: 'late-first', projectedRange: '17-27',
    ratings: { ovr: 69, scoring: 70, playmaking: 73, defense: 65, athleticism: 72, iq: 70, potential: 78 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_sorber', name: 'Thomas Sorber', pos: 'C', age: 20,
    school: 'Georgetown', country: 'USA',
    tier: 'late-first', projectedRange: '18-28',
    ratings: { ovr: 70, scoring: 68, playmaking: 55, defense: 73, athleticism: 74, iq: 70, potential: 77 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_fleming', name: 'Rasheer Fleming', pos: 'PF', age: 22,
    school: "St. Joseph's", country: 'USA',
    tier: 'late-first', projectedRange: '19-28',
    ratings: { ovr: 69, scoring: 68, playmaking: 56, defense: 72, athleticism: 76, iq: 68, potential: 75 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_walterclayton', name: 'Walter Clayton Jr.', pos: 'PG', age: 24,
    school: 'Florida', country: 'USA',
    tier: 'late-first', projectedRange: '19-30',
    ratings: { ovr: 71, scoring: 75, playmaking: 73, defense: 64, athleticism: 68, iq: 76, potential: 73 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_penda', name: 'Noah Penda', pos: 'SF', age: 20,
    school: 'Le Mans Sarthe', country: 'France',
    tier: 'project', projectedRange: '20-30',
    ratings: { ovr: 68, scoring: 66, playmaking: 60, defense: 70, athleticism: 75, iq: 67, potential: 78 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_clifford', name: 'Nique Clifford', pos: 'SG', age: 23,
    school: 'Colorado State', country: 'USA',
    tier: 'project', projectedRange: '22-30',
    ratings: { ovr: 69, scoring: 71, playmaking: 62, defense: 68, athleticism: 70, iq: 70, potential: 73 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_thiero', name: 'Adou Thiero', pos: 'SG', age: 21,
    school: 'Arkansas', country: 'France',
    tier: 'project', projectedRange: '22-30',
    ratings: { ovr: 67, scoring: 68, playmaking: 60, defense: 67, athleticism: 78, iq: 64, potential: 76 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_ighodaro', name: 'Oso Ighodaro', pos: 'C', age: 24,
    school: 'Marquette', country: 'Nigeria',
    tier: 'project', projectedRange: '23-30',
    ratings: { ovr: 67, scoring: 64, playmaking: 58, defense: 70, athleticism: 72, iq: 68, potential: 73 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_lawal', name: 'Tobi Lawal', pos: 'PF', age: 24,
    school: 'Texas A&M', country: 'Nigeria',
    tier: 'project', projectedRange: '24-30',
    ratings: { ovr: 66, scoring: 63, playmaking: 52, defense: 68, athleticism: 74, iq: 65, potential: 71 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_cadeau', name: 'Elliot Cadeau', pos: 'PG', age: 19,
    school: 'North Carolina', country: 'USA',
    tier: 'project', projectedRange: '25-30',
    ratings: { ovr: 66, scoring: 64, playmaking: 70, defense: 60, athleticism: 70, iq: 68, potential: 79 },
    scouted: false, scoutedReport: null
  },
  {
    id: 'prospect_bwilliams', name: 'Brice Williams', pos: 'SG', age: 22,
    school: 'NC State', country: 'USA',
    tier: 'project', projectedRange: '25-30',
    ratings: { ovr: 67, scoring: 70, playmaking: 58, defense: 64, athleticism: 68, iq: 69, potential: 72 },
    scouted: false, scoutedReport: null
  }
];

// Helper: get prospect by id
function getProspect(id) {
  return DRAFT_PROSPECTS_2025.find(p => p.id === id);
}

// Create a deep copy for game use (so game mutations don't affect the template)
function getInitialDraftClass() {
  return DRAFT_PROSPECTS_2025.map(p => ({ ...p, ratings: { ...p.ratings } }));
}
