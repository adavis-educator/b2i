// NBA_TEAMS — All 30 franchises with colors, difficulty, and flavor text
// Used by team selection screen and throughout the game for theming

const NBA_TEAMS = {
  ATL: {
    id: 'ATL', abbr: 'ATL', city: 'Atlanta', name: 'Hawks', fullName: 'Atlanta Hawks',
    conference: 'East', division: 'Southeast',
    colors: { primary: '#C1272D', secondary: '#FDB927', accent: '#E03039' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: 'Trae Young leads the charge. Build something worthy around his brilliance.',
    ownerName: 'Tony Ressler'
  },
  BOS: {
    id: 'BOS', abbr: 'BOS', city: 'Boston', name: 'Celtics', fullName: 'Boston Celtics',
    conference: 'East', division: 'Atlantic',
    colors: { primary: '#007A33', secondary: '#BA9653', accent: '#00a345' },
    difficulty: 'contender', startingPressure: 40,
    flavor: 'Defending champions. Banner 18 hangs fresh. Keep the dynasty alive.',
    ownerName: 'Wyc Grousbeck'
  },
  BKN: {
    id: 'BKN', abbr: 'BKN', city: 'Brooklyn', name: 'Nets', fullName: 'Brooklyn Nets',
    conference: 'East', division: 'Atlantic',
    colors: { primary: '#BBBBBB', secondary: '#000000', accent: '#888888' },
    difficulty: 'rebuilder', startingPressure: 20,
    flavor: 'The superteam era is over. Draft picks and patience are your currency.',
    ownerName: 'Joe Tsai'
  },
  CHA: {
    id: 'CHA', abbr: 'CHA', city: 'Charlotte', name: 'Hornets', fullName: 'Charlotte Hornets',
    conference: 'East', division: 'Southeast',
    colors: { primary: '#1D1160', secondary: '#00788C', accent: '#29178f' },
    difficulty: 'rebuilder', startingPressure: 20,
    flavor: "LaMelo is the franchise. Build something worthy around his unique talent.",
    ownerName: 'Michael Jordan'
  },
  CHI: {
    id: 'CHI', abbr: 'CHI', city: 'Chicago', name: 'Bulls', fullName: 'Chicago Bulls',
    conference: 'East', division: 'Central',
    colors: { primary: '#CE1141', secondary: '#000000', accent: '#e5163f' },
    difficulty: 'competitive', startingPressure: 35,
    flavor: 'The city demands a return to glory. LaVine leads — make it happen.',
    ownerName: 'Jerry Reinsdorf'
  },
  CLE: {
    id: 'CLE', abbr: 'CLE', city: 'Cleveland', name: 'Cavaliers', fullName: 'Cleveland Cavaliers',
    conference: 'East', division: 'Central',
    colors: { primary: '#860038', secondary: '#FDBB30', accent: '#a8003e' },
    difficulty: 'contender', startingPressure: 40,
    flavor: 'Best record in the East. Mitchell and Mobley are a dynasty in the making.',
    ownerName: 'Dan Gilbert'
  },
  DAL: {
    id: 'DAL', abbr: 'DAL', city: 'Dallas', name: 'Mavericks', fullName: 'Dallas Mavericks',
    conference: 'West', division: 'Southwest',
    colors: { primary: '#00538C', secondary: '#002B5E', accent: '#006bb3' },
    difficulty: 'contender', startingPressure: 40,
    flavor: 'Luka reached the Finals. Now finish what he started.',
    ownerName: 'Patrick Dumont'
  },
  DEN: {
    id: 'DEN', abbr: 'DEN', city: 'Denver', name: 'Nuggets', fullName: 'Denver Nuggets',
    conference: 'West', division: 'Northwest',
    colors: { primary: '#0E2240', secondary: '#FEC524', accent: '#133060' },
    difficulty: 'contender', startingPressure: 45,
    flavor: "Jokic is the best player on Earth. Don't waste this window.",
    ownerName: 'Stan Kroenke'
  },
  DET: {
    id: 'DET', abbr: 'DET', city: 'Detroit', name: 'Pistons', fullName: 'Detroit Pistons',
    conference: 'East', division: 'Central',
    colors: { primary: '#C8102E', secondary: '#006BB6', accent: '#e51233' },
    difficulty: 'rebuilder', startingPressure: 15,
    flavor: 'Cade is your cornerstone. Build the next great Pistons team from scratch.',
    ownerName: 'Tom Gores'
  },
  GSW: {
    id: 'GSW', abbr: 'GSW', city: 'Golden State', name: 'Warriors', fullName: 'Golden State Warriors',
    conference: 'West', division: 'Pacific',
    colors: { primary: '#1D428A', secondary: '#FFC72C', accent: '#2356b3' },
    difficulty: 'competitive', startingPressure: 35,
    flavor: 'Curry is still magic. Extend the dynasty or rebuild wisely around him.',
    ownerName: 'Joe Lacob'
  },
  HOU: {
    id: 'HOU', abbr: 'HOU', city: 'Houston', name: 'Rockets', fullName: 'Houston Rockets',
    conference: 'West', division: 'Southwest',
    colors: { primary: '#CE1141', secondary: '#C4CED4', accent: '#e5163f' },
    difficulty: 'competitive', startingPressure: 25,
    flavor: 'Young and hungry. Sengun and Green lead the next Rockets generation.',
    ownerName: 'Tilman Fertitta'
  },
  IND: {
    id: 'IND', abbr: 'IND', city: 'Indiana', name: 'Pacers', fullName: 'Indiana Pacers',
    conference: 'East', division: 'Central',
    colors: { primary: '#002D62', secondary: '#FDBB30', accent: '#003d82' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: 'Haliburton runs the show. The Pacers are knocking hard on the door.',
    ownerName: 'Herb Simon'
  },
  LAC: {
    id: 'LAC', abbr: 'LAC', city: 'LA', name: 'Clippers', fullName: 'LA Clippers',
    conference: 'West', division: 'Pacific',
    colors: { primary: '#C8102E', secondary: '#1D428A', accent: '#e51233' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: 'Harden leads a gritty squad. The new arena is open — now win in it.',
    ownerName: 'Steve Ballmer'
  },
  LAL: {
    id: 'LAL', abbr: 'LAL', city: 'Los Angeles', name: 'Lakers', fullName: 'Los Angeles Lakers',
    conference: 'West', division: 'Pacific',
    colors: { primary: '#552583', secondary: '#FDB927', accent: '#6b2fa6' },
    difficulty: 'competitive', startingPressure: 40,
    flavor: "LeBron's final act. Make it legendary before the next era begins.",
    ownerName: 'Jeanie Buss'
  },
  MEM: {
    id: 'MEM', abbr: 'MEM', city: 'Memphis', name: 'Grizzlies', fullName: 'Memphis Grizzlies',
    conference: 'West', division: 'Southwest',
    colors: { primary: '#5D76A9', secondary: '#12173F', accent: '#7089c0' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: "Morant is back and dangerous. Grit and Grind lives on your watch.",
    ownerName: 'Robert Pera'
  },
  MIA: {
    id: 'MIA', abbr: 'MIA', city: 'Miami', name: 'Heat', fullName: 'Miami Heat',
    conference: 'East', division: 'Southeast',
    colors: { primary: '#98002E', secondary: '#F9A01B', accent: '#bf0039' },
    difficulty: 'competitive', startingPressure: 35,
    flavor: 'Heat Culture is your edge. Bam and the system will carry you far.',
    ownerName: 'Mickey Arison'
  },
  MIL: {
    id: 'MIL', abbr: 'MIL', city: 'Milwaukee', name: 'Bucks', fullName: 'Milwaukee Bucks',
    conference: 'East', division: 'Central',
    colors: { primary: '#00471B', secondary: '#EEE1C6', accent: '#005c22' },
    difficulty: 'contender', startingPressure: 45,
    flavor: 'Giannis demands a second ring. The clock is ticking on this window.',
    ownerName: 'Marc Lasry'
  },
  MIN: {
    id: 'MIN', abbr: 'MIN', city: 'Minnesota', name: 'Timberwolves', fullName: 'Minnesota Timberwolves',
    conference: 'West', division: 'Northwest',
    colors: { primary: '#0C2340', secondary: '#236192', accent: '#0e2e54' },
    difficulty: 'contender', startingPressure: 40,
    flavor: "Anthony Edwards has arrived. This is his league now — maximize it.",
    ownerName: 'Glen Taylor'
  },
  NOP: {
    id: 'NOP', abbr: 'NOP', city: 'New Orleans', name: 'Pelicans', fullName: 'New Orleans Pelicans',
    conference: 'West', division: 'Southwest',
    colors: { primary: '#0C2340', secondary: '#C8102E', accent: '#0e2e54' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: "Zion's talent is undeniable when healthy. Your job: keep him on the court.",
    ownerName: 'Gayle Benson'
  },
  NYK: {
    id: 'NYK', abbr: 'NYK', city: 'New York', name: 'Knicks', fullName: 'New York Knicks',
    conference: 'East', division: 'Atlantic',
    colors: { primary: '#006BB6', secondary: '#F58426', accent: '#0082d4' },
    difficulty: 'contender', startingPressure: 40,
    flavor: 'The Garden is electric. Brunson and Towns give you a real chance.',
    ownerName: 'James Dolan'
  },
  OKC: {
    id: 'OKC', abbr: 'OKC', city: 'Oklahoma City', name: 'Thunder', fullName: 'Oklahoma City Thunder',
    conference: 'West', division: 'Northwest',
    colors: { primary: '#007AC1', secondary: '#EF3B24', accent: '#0093ea' },
    difficulty: 'contender', startingPressure: 40,
    flavor: "SGA leads the youngest contender in the league. The peak hasn't even arrived.",
    ownerName: 'Clay Bennett'
  },
  ORL: {
    id: 'ORL', abbr: 'ORL', city: 'Orlando', name: 'Magic', fullName: 'Orlando Magic',
    conference: 'East', division: 'Southeast',
    colors: { primary: '#0077C0', secondary: '#C4CED4', accent: '#0092eb' },
    difficulty: 'competitive', startingPressure: 25,
    flavor: 'Banchero and Wagner are the real deal. Restore the Magic to glory.',
    ownerName: 'Dan DeVos'
  },
  PHI: {
    id: 'PHI', abbr: 'PHI', city: 'Philadelphia', name: '76ers', fullName: 'Philadelphia 76ers',
    conference: 'East', division: 'Atlantic',
    colors: { primary: '#006BB6', secondary: '#ED174C', accent: '#0082d4' },
    difficulty: 'contender', startingPressure: 45,
    flavor: 'Embiid and George, healthy and hungry. Trust the new process.',
    ownerName: 'Josh Harris'
  },
  PHX: {
    id: 'PHX', abbr: 'PHX', city: 'Phoenix', name: 'Suns', fullName: 'Phoenix Suns',
    conference: 'West', division: 'Pacific',
    colors: { primary: '#1D1160', secondary: '#E56020', accent: '#29178f' },
    difficulty: 'competitive', startingPressure: 40,
    flavor: 'KD and Booker are elite — cap constraints demand creative solutions.',
    ownerName: 'Mat Ishbia'
  },
  POR: {
    id: 'POR', abbr: 'POR', city: 'Portland', name: 'Trail Blazers', fullName: 'Portland Trail Blazers',
    conference: 'West', division: 'Northwest',
    colors: { primary: '#E03A3E', secondary: '#000000', accent: '#f54347' },
    difficulty: 'rebuilder', startingPressure: 20,
    flavor: "Scoot and Sharpe are the future. Patient rebuilding wins championships.",
    ownerName: 'Jody Allen'
  },
  SAC: {
    id: 'SAC', abbr: 'SAC', city: 'Sacramento', name: 'Kings', fullName: 'Sacramento Kings',
    conference: 'West', division: 'Pacific',
    colors: { primary: '#5A2D81', secondary: '#63727A', accent: '#6e37a0' },
    difficulty: 'competitive', startingPressure: 30,
    flavor: 'Fox and Sabonis broke the 16-year drought. Now go further.',
    ownerName: 'Vivek Ranadivé'
  },
  SAS: {
    id: 'SAS', abbr: 'SAS', city: 'San Antonio', name: 'Spurs', fullName: 'San Antonio Spurs',
    conference: 'West', division: 'Southwest',
    colors: { primary: '#C4CED4', secondary: '#000000', accent: '#d9e2e8' },
    difficulty: 'rebuilder', startingPressure: 20,
    flavor: 'Wembanyama is a generational gift. Build the next Spurs dynasty carefully.',
    ownerName: 'Peter Holt'
  },
  TOR: {
    id: 'TOR', abbr: 'TOR', city: 'Toronto', name: 'Raptors', fullName: 'Toronto Raptors',
    conference: 'East', division: 'Atlantic',
    colors: { primary: '#CE1141', secondary: '#000000', accent: '#e5163f' },
    difficulty: 'competitive', startingPressure: 25,
    flavor: "Barnes is a rising star. Build the north's next title contender around him.",
    ownerName: 'Larry Tanenbaum'
  },
  UTA: {
    id: 'UTA', abbr: 'UTA', city: 'Utah', name: 'Jazz', fullName: 'Utah Jazz',
    conference: 'West', division: 'Northwest',
    colors: { primary: '#002B5C', secondary: '#00471B', accent: '#003575' },
    difficulty: 'rebuilder', startingPressure: 20,
    flavor: 'Markkanen anchors a young core. The rebuild is your masterpiece to craft.',
    ownerName: 'Ryan Smith'
  },
  WAS: {
    id: 'WAS', abbr: 'WAS', city: 'Washington', name: 'Wizards', fullName: 'Washington Wizards',
    conference: 'East', division: 'Southeast',
    colors: { primary: '#002B5C', secondary: '#E31837', accent: '#003575' },
    difficulty: 'rebuilder', startingPressure: 15,
    flavor: 'Sarr is your future. Lottery picks and patience are the plan.',
    ownerName: 'Ted Leonsis'
  }
};

// Ordered list of team IDs for iteration
const TEAM_IDS = Object.keys(NBA_TEAMS);

// Get teams by conference
const EAST_TEAMS = TEAM_IDS.filter(id => NBA_TEAMS[id].conference === 'East');
const WEST_TEAMS = TEAM_IDS.filter(id => NBA_TEAMS[id].conference === 'West');
