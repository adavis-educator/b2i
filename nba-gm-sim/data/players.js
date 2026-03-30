// NBA_PLAYERS — Real 2024-25 NBA rosters with full ratings
// Ratings scale: 40-99. Positions: PG, SG, SF, PF, C
// salary in millions/year, contract_years remaining, morale 0-100

let _playerIdCounter = 1;
function pid() { return `p${String(_playerIdCounter++).padStart(3, '0')}`; }

function player(name, pos, team, age, ovr, scoring, playmaking, defense, athleticism, iq, potential, salary, contractYears, morale = 80) {
  return { id: pid(), name, pos, team, age, ovr, scoring, playmaking, defense, athleticism, iq, potential, salary, contract_years: contractYears, morale, stats: { ppg: 0, rpg: 0, apg: 0, gamesPlayed: 0 }, injured: false, injuryWeeks: 0 };
}

const NBA_PLAYERS_RAW = [

  // ── ATLANTA HAWKS ──────────────────────────────────────────────────────────
  player('Trae Young',           'PG', 'ATL', 26, 89, 90, 95, 52, 72, 85, 90,  40.1, 3),
  player('Dyson Daniels',        'SG', 'ATL', 21, 78, 72, 70, 83, 85, 72, 86,   4.7, 2),
  player('Jalen Johnson',        'SF', 'ATL', 23, 81, 78, 75, 74, 86, 76, 88,  13.0, 3),
  player('Clint Capela',         'C',  'ATL', 30, 76, 62, 48, 75, 80, 70, 72,  18.5, 2),
  player('De\'Andre Hunter',     'SF', 'ATL', 26, 75, 72, 60, 76, 76, 72, 78,  13.1, 2),
  player('Bogdan Bogdanovic',    'SG', 'ATL', 32, 72, 76, 68, 63, 68, 74, 68,  18.0, 1),
  player('Bruno Fernando',       'C',  'ATL', 25, 66, 62, 48, 66, 72, 58, 62,   3.5, 2),
  player('Vit Krejci',           'PG', 'ATL', 23, 63, 60, 64, 62, 70, 62, 70,   2.0, 2),
  player('Kobe Bufkin',          'SG', 'ATL', 22, 67, 66, 64, 60, 72, 63, 76,   3.5, 2),
  player('Onyeka Okongwu',       'C',  'ATL', 23, 71, 65, 52, 72, 78, 68, 78,  11.9, 2),
  player('Garrison Mathews',     'SG', 'ATL', 27, 63, 68, 52, 58, 62, 64, 60,   2.0, 1),
  player('Seth Lundy',           'SF', 'ATL', 23, 62, 63, 55, 63, 65, 60, 68,   1.6, 2),
  player('Mouhamed Gueye',       'PF', 'ATL', 22, 61, 60, 48, 62, 72, 57, 72,   1.8, 2),

  // ── BOSTON CELTICS ────────────────────────────────────────────────────────
  player('Jayson Tatum',         'SF', 'BOS', 26, 95, 93, 82, 80, 88, 90, 96,  32.6, 4),
  player('Jaylen Brown',         'SG', 'BOS', 27, 88, 88, 72, 78, 88, 78, 88,  49.0, 4),
  player('Jrue Holiday',         'PG', 'BOS', 34, 80, 72, 78, 86, 78, 84, 72,  30.0, 2),
  player('Derrick White',        'SG', 'BOS', 30, 82, 75, 74, 84, 78, 80, 80,  22.6, 3),
  player('Al Horford',           'C',  'BOS', 38, 73, 65, 60, 72, 62, 82, 60,  26.5, 1),
  player('Kristaps Porzingis',   'C',  'BOS', 29, 82, 80, 62, 72, 76, 76, 80,  30.0, 2),
  player('Payton Pritchard',     'PG', 'BOS', 26, 76, 74, 73, 64, 68, 74, 76,  15.0, 3),
  player('Sam Hauser',           'SF', 'BOS', 26, 74, 76, 58, 62, 68, 70, 72,   5.3, 2),
  player('Xavier Tillman',       'PF', 'BOS', 25, 67, 60, 58, 68, 68, 68, 68,   2.2, 2),
  player('Luke Kornet',          'C',  'BOS', 29, 67, 62, 52, 65, 63, 67, 63,   2.7, 2),
  player('Neemias Queta',        'C',  'BOS', 25, 66, 60, 50, 67, 70, 63, 70,   2.0, 2),
  player('Jordan Walsh',         'SF', 'BOS', 21, 63, 60, 54, 63, 72, 60, 74,   2.0, 3),
  player('Lonnie Walker IV',     'SG', 'BOS', 26, 68, 70, 60, 60, 76, 62, 66,   2.5, 1),

  // ── BROOKLYN NETS ─────────────────────────────────────────────────────────
  player('Cam Johnson',          'SF', 'BKN', 27, 80, 78, 62, 68, 76, 72, 80,  22.6, 2),
  player('Nic Claxton',          'C',  'BKN', 25, 78, 66, 55, 78, 84, 68, 82,  19.9, 3),
  player('Ben Simmons',          'PG', 'BKN', 28, 72, 56, 74, 76, 80, 70, 72,  37.9, 1, 60),
  player('Dennis Schroder',      'PG', 'BKN', 31, 74, 72, 76, 64, 76, 70, 68,  13.0, 1),
  player('Noah Clowney',         'PF', 'BKN', 21, 68, 66, 55, 66, 78, 62, 80,   4.2, 3),
  player('Day\'Ron Sharpe',      'C',  'BKN', 23, 68, 64, 52, 66, 74, 62, 72,   5.9, 2),
  player('Shake Milton',         'SG', 'BKN', 27, 67, 68, 64, 58, 65, 66, 64,   3.5, 1),
  player('Trendon Watford',      'PF', 'BKN', 24, 66, 64, 58, 63, 68, 63, 68,   2.0, 2),
  player('Dariq Whitehead',      'SG', 'BKN', 21, 67, 68, 60, 62, 72, 62, 78,   3.8, 3),
  player('Maxwell Lewis',        'SF', 'BKN', 21, 65, 66, 55, 60, 68, 62, 74,   2.8, 3),
  player('Ziaire Williams',      'SF', 'BKN', 23, 66, 66, 58, 62, 72, 60, 72,   5.0, 1),
  player('Keon Johnson',         'SG', 'BKN', 23, 64, 62, 58, 60, 80, 56, 68,   2.0, 2),
  player('Tyrese Martin',        'SG', 'BKN', 24, 62, 62, 55, 62, 68, 60, 65,   1.8, 2),

  // ── CHARLOTTE HORNETS ─────────────────────────────────────────────────────
  player('LaMelo Ball',          'PG', 'CHA', 23, 88, 84, 92, 58, 82, 80, 93,  32.6, 4),
  player('Miles Bridges',        'SF', 'CHA', 26, 80, 78, 63, 70, 84, 70, 80,  22.0, 3),
  player('Brandon Miller',       'SF', 'CHA', 22, 78, 80, 65, 67, 78, 71, 87,   9.7, 3),
  player('Mark Williams',        'C',  'CHA', 23, 74, 65, 52, 72, 76, 68, 80,   7.0, 3),
  player('Grant Williams',       'PF', 'CHA', 25, 71, 64, 58, 72, 68, 72, 70,  13.0, 2),
  player('Nick Richards',        'C',  'CHA', 25, 68, 62, 50, 67, 72, 62, 66,   4.3, 2),
  player('Tre Mann',             'SG', 'CHA', 24, 70, 73, 66, 58, 72, 65, 73,   3.8, 2),
  player('Josh Green',           'SG', 'CHA', 24, 70, 68, 64, 70, 78, 63, 72,   7.7, 2),
  player('Cody Martin',          'SF', 'CHA', 28, 66, 62, 60, 66, 70, 65, 62,   5.7, 1),
  player('Seth Curry',           'SG', 'CHA', 34, 72, 78, 62, 56, 62, 74, 58,  12.2, 1),
  player('JT Thor',              'PF', 'CHA', 22, 64, 63, 52, 63, 72, 58, 70,   2.0, 2),
  player('Aleksej Pokusevski',   'PF', 'CHA', 23, 63, 63, 58, 60, 68, 60, 68,   2.2, 2),
  player('Bryce McGowens',       'SG', 'CHA', 22, 62, 63, 56, 58, 68, 58, 68,   1.8, 2),

  // ── CHICAGO BULLS ─────────────────────────────────────────────────────────
  player('Zach LaVine',          'SG', 'CHI', 29, 88, 90, 78, 62, 88, 72, 84,  43.9, 3),
  player('Josh Giddey',          'PG', 'CHI', 22, 78, 72, 80, 62, 74, 74, 85,  17.1, 2),
  player('Nikola Vucevic',       'C',  'CHI', 34, 79, 76, 62, 66, 68, 76, 64,  21.0, 1),
  player('Coby White',           'PG', 'CHI', 24, 80, 82, 76, 62, 74, 70, 82,  22.0, 3),
  player('Patrick Williams',     'PF', 'CHI', 23, 72, 68, 60, 72, 76, 66, 78,  13.1, 2),
  player('Ayo Dosunmu',          'SG', 'CHI', 24, 72, 70, 70, 68, 72, 70, 74,   7.4, 3),
  player('Torrey Craig',         'SF', 'CHI', 34, 66, 60, 55, 68, 68, 66, 56,   3.0, 1),
  player('Julian Phillips',      'SF', 'CHI', 21, 66, 65, 55, 62, 74, 60, 74,   3.5, 3),
  player('Matas Buzelis',        'PF', 'CHI', 20, 68, 67, 58, 65, 76, 62, 82,   4.6, 3),
  player('Dalen Terry',          'SG', 'CHI', 22, 65, 62, 60, 64, 72, 60, 71,   2.8, 3),
  player('Julian Phillips',      'SF', 'CHI', 21, 65, 63, 52, 62, 72, 58, 72,   2.5, 3),
  player('Jalen Smith',          'PF', 'CHI', 24, 67, 65, 52, 66, 72, 62, 68,   3.5, 2),
  player('Chris Duarte',         'SG', 'CHI', 27, 65, 66, 56, 60, 68, 62, 62,   2.5, 1),

  // ── CLEVELAND CAVALIERS ───────────────────────────────────────────────────
  player('Donovan Mitchell',     'SG', 'CLE', 28, 92, 93, 82, 72, 84, 86, 90,  35.9, 3),
  player('Darius Garland',       'PG', 'CLE', 25, 87, 85, 90, 60, 76, 82, 88,  43.3, 4),
  player('Evan Mobley',          'C',  'CLE', 23, 87, 78, 65, 86, 86, 82, 94,  35.0, 4),
  player('Jarrett Allen',        'C',  'CLE', 26, 79, 68, 54, 80, 82, 74, 78,  20.0, 2),
  player('Caris LeVert',         'SG', 'CLE', 30, 74, 74, 72, 62, 72, 68, 68,  13.0, 1),
  player('Ty Jerome',            'PG', 'CLE', 27, 73, 72, 72, 62, 67, 72, 72,   4.5, 2),
  player('Sam Merrill',          'SG', 'CLE', 29, 70, 74, 60, 60, 62, 70, 65,   3.5, 2),
  player('Isaac Okoro',          'SG', 'CLE', 23, 70, 65, 60, 74, 78, 62, 72,   9.1, 2),
  player('Dean Wade',            'PF', 'CLE', 27, 68, 66, 56, 67, 66, 68, 64,   3.0, 2),
  player('Max Strus',            'SG', 'CLE', 28, 72, 74, 62, 62, 68, 68, 68,  13.0, 2),
  player('Georges Niang',        'PF', 'CLE', 31, 70, 72, 58, 60, 58, 72, 60,   7.4, 1),
  player('Craig Porter Jr.',     'PG', 'CLE', 23, 65, 63, 66, 63, 68, 63, 70,   2.0, 3),
  player('Emoni Bates',          'SF', 'CLE', 21, 65, 67, 58, 58, 70, 60, 72,   2.0, 2),

  // ── DALLAS MAVERICKS ──────────────────────────────────────────────────────
  player('Luka Doncic',          'PG', 'DAL', 25, 96, 94, 97, 68, 82, 96, 98,  43.0, 4),
  player('Kyrie Irving',         'PG', 'DAL', 32, 91, 94, 88, 70, 88, 88, 84,  39.0, 2),
  player('Klay Thompson',        'SG', 'DAL', 34, 80, 84, 64, 74, 74, 76, 70,  13.3, 2),
  player('PJ Washington',        'PF', 'DAL', 26, 78, 74, 62, 72, 76, 70, 78,  15.0, 3),
  player('Dereck Lively II',     'C',  'DAL', 20, 73, 64, 55, 75, 80, 66, 85,   5.6, 3),
  player('Maxi Kleber',          'PF', 'DAL', 33, 70, 68, 55, 68, 66, 68, 60,  10.0, 1),
  player('Daniel Gafford',       'C',  'DAL', 26, 76, 68, 52, 76, 84, 66, 76,  14.0, 2),
  player('Dante Exum',           'PG', 'DAL', 29, 68, 65, 66, 62, 74, 64, 64,   6.0, 2),
  player('Naji Marshall',        'SF', 'DAL', 27, 70, 68, 62, 66, 70, 64, 68,   6.5, 2),
  player('Olivier-Maxence Prosper','SF','DAL', 22, 67, 65, 55, 65, 72, 60, 72,   3.8, 3),
  player('Quentin Grimes',       'SG', 'DAL', 24, 70, 70, 60, 64, 70, 65, 72,   4.0, 2),
  player('Dwight Powell',        'C',  'DAL', 33, 64, 60, 52, 64, 68, 62, 56,   3.5, 1),
  player('Greg Brown III',       'PF', 'DAL', 22, 63, 61, 52, 62, 74, 57, 70,   2.0, 2),

  // ── DENVER NUGGETS ────────────────────────────────────────────────────────
  player('Nikola Jokic',         'C',  'DEN', 29, 97, 90, 97, 78, 74, 99, 96,  47.6, 3),
  player('Jamal Murray',         'PG', 'DEN', 27, 88, 88, 86, 68, 82, 84, 88,  33.8, 3),
  player('Michael Porter Jr.',   'SF', 'DEN', 26, 83, 86, 65, 64, 80, 72, 86,  33.4, 3),
  player('Aaron Gordon',         'PF', 'DEN', 29, 80, 70, 62, 80, 84, 72, 76,  21.6, 2),
  player('Kentavious Caldwell-Pope','SG','DEN', 31, 76, 76, 62, 76, 72, 72, 66, 16.0, 1),
  player('Reggie Jackson',       'PG', 'DEN', 34, 70, 68, 70, 60, 68, 70, 58,   3.0, 1),
  player('Julian Strawther',     'SG', 'DEN', 22, 70, 72, 58, 62, 72, 64, 76,   4.6, 2),
  player('Peyton Watson',        'SF', 'DEN', 22, 68, 64, 58, 68, 78, 60, 78,   4.0, 3),
  player('Christian Braun',      'SG', 'DEN', 23, 72, 70, 62, 68, 76, 66, 76,   6.5, 3),
  player('Zeke Nnaji',           'PF', 'DEN', 23, 66, 62, 52, 65, 72, 60, 68,   3.3, 2),
  player('DaRon Holmes II',      'C',  'DEN', 21, 67, 65, 55, 66, 74, 62, 78,   4.4, 3),
  player('Hunter Tyson',         'PF', 'DEN', 26, 63, 63, 52, 60, 66, 60, 62,   1.8, 2),
  player('Jay Huff',             'C',  'DEN', 25, 62, 60, 48, 63, 66, 58, 62,   1.5, 2),

  // ── DETROIT PISTONS ───────────────────────────────────────────────────────
  player('Cade Cunningham',      'PG', 'DET', 23, 86, 82, 88, 68, 76, 82, 92,  32.6, 4),
  player('Jalen Duren',          'C',  'DET', 21, 78, 68, 56, 78, 86, 66, 88,  13.6, 3),
  player('Ausar Thompson',       'SF', 'DET', 21, 74, 68, 65, 74, 90, 64, 85,   8.3, 3),
  player('Tobias Harris',        'PF', 'DET', 32, 74, 72, 60, 66, 68, 72, 62,   5.0, 1),
  player('Isaiah Stewart',       'PF', 'DET', 23, 72, 65, 58, 72, 76, 66, 74,  13.6, 3),
  player('Malik Beasley',        'SG', 'DET', 28, 72, 76, 60, 58, 70, 66, 68,   4.3, 1),
  player('Tim Hardaway Jr.',     'SG', 'DET', 32, 72, 75, 60, 58, 68, 66, 60,  15.9, 1),
  player('Simone Fontecchio',    'SF', 'DET', 28, 71, 73, 60, 62, 70, 68, 68,  11.1, 2),
  player('Jaden Ivey',           'PG', 'DET', 23, 74, 73, 72, 62, 82, 64, 80,   9.1, 3),
  player('Marcus Sasser',        'PG', 'DET', 23, 66, 66, 65, 60, 70, 62, 70,   2.0, 2),
  player('Ron Holland',          'SF', 'DET', 19, 67, 65, 57, 63, 80, 58, 84,   4.5, 4),
  player('Bojan Bogdanovic',     'SF', 'DET', 35, 72, 76, 58, 58, 60, 72, 54,   7.0, 1),
  player('Stanley Umude',        'SG', 'DET', 25, 61, 62, 52, 60, 65, 58, 63,   1.5, 2),

  // ── GOLDEN STATE WARRIORS ─────────────────────────────────────────────────
  player('Stephen Curry',        'PG', 'GSW', 36, 95, 96, 86, 68, 78, 94, 88,  51.9, 2),
  player('Draymond Green',       'PF', 'GSW', 34, 80, 60, 82, 84, 72, 94, 66,  22.3, 3),
  player('Andrew Wiggins',       'SF', 'GSW', 29, 79, 76, 62, 74, 82, 68, 74,  24.3, 2),
  player('Jonathan Kuminga',     'SF', 'GSW', 22, 80, 80, 64, 70, 88, 68, 88,  29.0, 4),
  player('Brandin Podziemski',   'SG', 'GSW', 22, 74, 72, 70, 66, 72, 70, 82,   4.1, 3),
  player('Moses Moody',          'SG', 'GSW', 23, 72, 72, 60, 66, 72, 65, 74,   5.9, 2),
  player('Buddy Hield',          'SG', 'GSW', 32, 73, 78, 60, 58, 64, 70, 62,  12.0, 2),
  player('Gary Payton II',       'SG', 'GSW', 31, 68, 62, 62, 78, 78, 65, 60,  10.6, 2),
  player('Kyle Anderson',        'SF', 'GSW', 30, 68, 62, 66, 65, 60, 72, 60,   6.0, 1),
  player('De\'Anthony Melton',   'SG', 'GSW', 27, 69, 66, 64, 70, 72, 64, 66,   7.0, 2),
  player('Kevon Looney',         'C',  'GSW', 28, 66, 58, 52, 66, 66, 68, 60,  12.0, 2),
  player('Trayce Jackson-Davis', 'C',  'GSW', 24, 70, 66, 54, 70, 76, 64, 74,   4.0, 2),
  player('Gui Santos',           'SF', 'GSW', 22, 62, 62, 55, 60, 66, 60, 66,   1.5, 2),

  // ── HOUSTON ROCKETS ───────────────────────────────────────────────────────
  player('Jalen Green',          'SG', 'HOU', 23, 85, 90, 72, 60, 88, 70, 88,  25.8, 3),
  player('Alperen Sengun',       'C',  'HOU', 22, 84, 80, 78, 68, 74, 82, 90,  19.5, 3),
  player('Fred VanVleet',        'PG', 'HOU', 30, 78, 76, 80, 70, 68, 80, 72,  42.9, 3),
  player('Dillon Brooks',        'SF', 'HOU', 29, 76, 72, 60, 78, 74, 70, 70,  20.0, 2),
  player('Amen Thompson',        'SF', 'HOU', 21, 75, 68, 70, 72, 92, 65, 88,   8.9, 3),
  player('Jabari Smith Jr.',     'PF', 'HOU', 22, 76, 74, 60, 74, 76, 68, 84,  13.6, 3),
  player('Tari Eason',           'PF', 'HOU', 23, 73, 70, 58, 72, 80, 65, 78,   7.6, 3),
  player('Aaron Holiday',        'PG', 'HOU', 29, 68, 66, 68, 62, 66, 66, 62,   2.5, 2),
  player('Cam Whitmore',         'SF', 'HOU', 21, 71, 72, 58, 62, 78, 62, 80,   5.3, 3),
  player('Reed Sheppard',        'PG', 'HOU', 20, 70, 72, 70, 62, 68, 70, 82,   6.0, 4),
  player('Jae\'Sean Tate',       'SF', 'HOU', 29, 67, 64, 58, 66, 70, 65, 60,   7.6, 2),
  player('Jeff Green',           'PF', 'HOU', 37, 63, 62, 54, 62, 60, 66, 50,   2.8, 1),
  player('Nate Williams',        'SG', 'HOU', 23, 62, 62, 55, 60, 66, 58, 65,   1.5, 2),

  // ── INDIANA PACERS ────────────────────────────────────────────────────────
  player('Tyrese Haliburton',    'PG', 'IND', 24, 89, 82, 94, 64, 76, 88, 92,  35.6, 4),
  player('Pascal Siakam',        'PF', 'IND', 30, 86, 84, 76, 74, 84, 80, 80,  37.9, 3),
  player('Myles Turner',         'C',  'IND', 28, 80, 72, 58, 82, 76, 76, 76,  19.9, 2),
  player('Bennedict Mathurin',   'SG', 'IND', 23, 78, 80, 62, 64, 80, 68, 83,   9.1, 3),
  player('Aaron Nesmith',        'SF', 'IND', 25, 72, 68, 58, 70, 76, 65, 70,  10.0, 3),
  player('T.J. McConnell',       'PG', 'IND', 32, 72, 62, 74, 64, 68, 76, 60,  13.0, 2),
  player('Obi Toppin',           'PF', 'IND', 26, 72, 72, 55, 62, 80, 62, 70,  13.3, 2),
  player('Isaiah Jackson',       'C',  'IND', 23, 68, 60, 50, 70, 78, 60, 74,   5.6, 3),
  player('Andrew Nembhard',      'PG', 'IND', 25, 72, 68, 72, 65, 68, 70, 72,   4.6, 2),
  player('Ben Sheppard',         'SG', 'IND', 23, 70, 70, 62, 62, 68, 65, 74,   4.0, 3),
  player('Enrique Freeman',      'PF', 'IND', 22, 65, 62, 52, 64, 70, 60, 70,   2.0, 3),
  player('Kendall Brown',        'SF', 'IND', 22, 63, 62, 54, 62, 74, 57, 70,   2.0, 3),
  player('James Johnson',        'SF', 'IND', 37, 62, 60, 56, 63, 62, 66, 48,   2.0, 1),

  // ── LA CLIPPERS ───────────────────────────────────────────────────────────
  player('Kawhi Leonard',        'SF', 'LAC', 33, 90, 88, 70, 88, 82, 88, 78,  39.3, 2, 70),
  player('James Harden',         'PG', 'LAC', 35, 85, 88, 90, 60, 70, 88, 72,  35.6, 2),
  player('Norman Powell',        'SG', 'LAC', 31, 78, 80, 62, 65, 76, 70, 68,  17.1, 3),
  player('Ivica Zubac',          'C',  'LAC', 27, 76, 70, 55, 74, 70, 72, 72,  15.4, 2),
  player('Terance Mann',         'SF', 'LAC', 27, 71, 68, 60, 68, 74, 64, 66,  10.1, 2),
  player('Kevin Porter Jr.',     'PG', 'LAC', 24, 72, 72, 70, 58, 72, 62, 72,   3.0, 1),
  player('Derrick Jones Jr.',    'SF', 'LAC', 28, 68, 62, 54, 70, 82, 58, 60,   4.5, 2),
  player('Moussa Diabate',       'C',  'LAC', 23, 67, 63, 50, 66, 74, 58, 70,   2.5, 2),
  player('Kobe Brown',           'PF', 'LAC', 24, 67, 66, 56, 63, 68, 62, 68,   2.5, 3),
  player('Jordan Miller',        'SG', 'LAC', 24, 65, 65, 56, 62, 68, 60, 66,   2.2, 3),
  player('Amir Coffey',          'SG', 'LAC', 27, 65, 65, 56, 60, 66, 62, 60,   2.0, 1),
  player('Nicolas Batum',        'SF', 'LAC', 36, 65, 60, 55, 63, 60, 72, 50,   3.5, 1),
  player('Bones Hyland',         'PG', 'LAC', 24, 68, 70, 66, 56, 70, 60, 68,   3.5, 2),

  // ── LOS ANGELES LAKERS ────────────────────────────────────────────────────
  player('LeBron James',         'SF', 'LAL', 40, 92, 88, 90, 74, 84, 96, 76,  47.6, 2),
  player('Anthony Davis',        'C',  'LAL', 31, 91, 84, 66, 88, 84, 82, 84,  40.6, 3),
  player('D\'Angelo Russell',    'PG', 'LAL', 28, 78, 78, 80, 56, 68, 74, 72,  18.5, 1),
  player('Austin Reaves',        'SG', 'LAL', 26, 80, 78, 74, 66, 70, 76, 78,  13.0, 3),
  player('Rui Hachimura',        'PF', 'LAL', 26, 76, 76, 58, 66, 72, 66, 74,  17.0, 3),
  player('Jarred Vanderbilt',    'PF', 'LAL', 25, 70, 58, 58, 72, 78, 62, 68,  11.0, 3, 70),
  player('Max Christie',         'SG', 'LAL', 21, 68, 67, 58, 64, 72, 62, 74,   4.1, 3),
  player('Dalton Knecht',        'SG', 'LAL', 23, 71, 74, 58, 60, 70, 64, 76,   5.0, 3),
  player('Jaxson Hayes',         'C',  'LAL', 24, 68, 62, 50, 68, 78, 58, 68,   9.0, 2),
  player('Gabe Vincent',         'PG', 'LAL', 28, 66, 65, 64, 62, 64, 64, 60,   9.9, 1, 70),
  player('Spencer Dinwiddie',    'PG', 'LAL', 31, 70, 70, 70, 56, 68, 67, 62,   5.0, 1),
  player('Cam Reddish',          'SF', 'LAL', 25, 68, 67, 57, 65, 74, 59, 68,   3.0, 1),
  player('Bronny James',         'SG', 'LAL', 20, 60, 60, 60, 58, 68, 57, 70,   7.9, 3),

  // ── MEMPHIS GRIZZLIES ─────────────────────────────────────────────────────
  player('Ja Morant',            'PG', 'MEM', 25, 90, 88, 90, 64, 96, 80, 92,  33.6, 4),
  player('Jaren Jackson Jr.',    'C',  'MEM', 25, 88, 82, 62, 90, 80, 80, 88,  25.0, 4),
  player('Desmond Bane',         'SG', 'MEM', 26, 83, 84, 72, 70, 72, 78, 82,  25.0, 3),
  player('Marcus Smart',         'PG', 'MEM', 30, 76, 66, 74, 82, 72, 78, 66,  20.0, 2),
  player('Santi Aldama',         'PF', 'MEM', 23, 74, 72, 60, 68, 70, 70, 78,   8.3, 3),
  player('Vince Williams Jr.',   'SF', 'MEM', 23, 72, 70, 62, 66, 74, 64, 74,   4.5, 3),
  player('Luke Kennard',         'SG', 'MEM', 27, 71, 74, 60, 60, 63, 68, 66,  13.3, 2),
  player('GG Jackson',           'PF', 'MEM', 21, 72, 73, 58, 60, 72, 62, 80,   5.8, 3),
  player('Brandon Clarke',       'PF', 'MEM', 28, 68, 65, 52, 68, 74, 64, 62, 12.0, 1, 65),
  player('Scotty Pippen Jr.',    'PG', 'MEM', 24, 67, 65, 68, 56, 65, 63, 66,   2.0, 2),
  player('Jaylen Wells',         'SG', 'MEM', 22, 68, 67, 57, 62, 70, 62, 74,   3.5, 3),
  player('Jay Huff',             'C',  'MEM', 25, 63, 60, 48, 62, 65, 59, 62,   2.0, 2),
  player('John Konchar',         'SF', 'MEM', 27, 64, 62, 55, 65, 67, 62, 58,   5.0, 2),

  // ── MIAMI HEAT ────────────────────────────────────────────────────────────
  player('Bam Adebayo',          'C',  'MIA', 27, 89, 78, 72, 86, 86, 84, 88,  32.6, 4),
  player('Tyler Herro',          'SG', 'MIA', 24, 85, 88, 76, 58, 72, 76, 84,  27.0, 3),
  player('Jimmy Butler',         'SF', 'MIA', 35, 87, 82, 74, 80, 78, 88, 72,  48.8, 2, 65),
  player('Terry Rozier',         'PG', 'MIA', 31, 78, 78, 72, 66, 72, 72, 68,  26.5, 3),
  player('Duncan Robinson',      'SG', 'MIA', 30, 74, 80, 58, 60, 65, 68, 65,  18.0, 2),
  player('Jaime Jaquez Jr.',     'SF', 'MIA', 23, 74, 72, 64, 67, 72, 70, 78,   4.6, 3),
  player('Nikola Jovic',         'PF', 'MIA', 22, 72, 70, 65, 62, 68, 70, 78,   4.5, 3),
  player('Josh Richardson',      'SG', 'MIA', 31, 68, 65, 62, 68, 70, 65, 58,   4.2, 1),
  player('Haywood Highsmith',    'PF', 'MIA', 28, 67, 64, 55, 68, 70, 62, 60,   5.5, 2),
  player('Thomas Bryant',        'C',  'MIA', 27, 68, 65, 50, 65, 68, 62, 62,   3.5, 1),
  player('Alec Burks',           'SG', 'MIA', 33, 68, 70, 60, 58, 64, 65, 56,   3.0, 1),
  player('Pelle Larsson',        'SG', 'MIA', 24, 64, 64, 58, 60, 65, 60, 66,   2.0, 3),
  player('Orlando Robinson',     'C',  'MIA', 24, 64, 62, 50, 63, 65, 60, 66,   2.0, 2),

  // ── MILWAUKEE BUCKS ───────────────────────────────────────────────────────
  player('Giannis Antetokounmpo','PF', 'MIL', 29, 96, 88, 80, 86, 98, 84, 96,  48.8, 3),
  player('Damian Lillard',       'PG', 'MIL', 34, 91, 95, 88, 62, 76, 86, 80,  45.6, 3),
  player('Brook Lopez',          'C',  'MIL', 36, 78, 72, 55, 78, 62, 76, 60,  14.7, 2),
  player('Khris Middleton',      'SF', 'MIL', 33, 82, 82, 72, 70, 70, 80, 70,  40.4, 2, 65),
  player('Bobby Portis',         'PF', 'MIL', 30, 75, 74, 55, 65, 70, 70, 65,  13.0, 2),
  player('AJ Green',             'SG', 'MIL', 24, 73, 76, 58, 60, 68, 68, 74,   4.5, 2),
  player('Pat Connaughton',      'SG', 'MIL', 31, 68, 67, 58, 63, 70, 65, 58,   8.9, 2),
  player('Taurean Prince',       'SF', 'MIL', 30, 70, 68, 56, 65, 67, 65, 60,   7.3, 2),
  player('MarJon Beauchamp',     'SF', 'MIL', 23, 68, 66, 56, 66, 74, 60, 70,   4.5, 3),
  player('Chris Livingston',     'SF', 'MIL', 21, 66, 65, 56, 62, 72, 58, 72,   2.5, 3),
  player('Gary Trent Jr.',       'SG', 'MIL', 25, 74, 78, 58, 62, 70, 66, 68,  19.0, 2),
  player('Jaylin Galloway',      'SG', 'MIL', 24, 64, 64, 58, 60, 66, 60, 66,   2.0, 2),
  player('Andre Jackson Jr.',    'SG', 'MIL', 22, 64, 62, 56, 63, 70, 57, 68,   2.0, 3),

  // ── MINNESOTA TIMBERWOLVES ────────────────────────────────────────────────
  player('Anthony Edwards',      'SG', 'MIN', 22, 93, 92, 80, 78, 96, 78, 97,  26.1, 4),
  player('Rudy Gobert',          'C',  'MIN', 32, 82, 65, 52, 90, 78, 74, 70,  41.0, 2),
  player('Julius Randle',        'PF', 'MIN', 30, 82, 82, 74, 66, 76, 72, 76,  24.4, 2),
  player('Donte DiVincenzo',     'SG', 'MIN', 28, 76, 76, 66, 66, 72, 68, 70,  13.0, 2),
  player('Mike Conley',          'PG', 'MIN', 37, 74, 70, 76, 64, 64, 80, 56,  16.3, 1),
  player('Naz Reid',             'C',  'MIN', 25, 76, 74, 56, 70, 72, 70, 74,  13.1, 3),
  player('Jaden McDaniels',      'SF', 'MIN', 23, 75, 70, 60, 76, 78, 66, 78,  13.4, 3),
  player('Rob Dillingham',       'PG', 'MIN', 20, 71, 73, 72, 56, 74, 66, 82,   8.9, 4),
  player('Nickeil Alexander-Walker','SG','MIN',25, 72, 70, 65, 65, 72, 64, 68,  14.3, 2),
  player('Jordan McLaughlin',    'PG', 'MIN', 27, 65, 60, 67, 62, 62, 67, 58,   2.0, 2),
  player('Terrence Shannon Jr.', 'SG', 'MIN', 24, 70, 72, 60, 60, 72, 62, 70,   2.0, 2),
  player('Josh Minott',          'SF', 'MIN', 22, 64, 62, 55, 62, 72, 57, 68,   2.0, 3),
  player('Troy Brown Jr.',       'SF', 'MIN', 25, 66, 63, 58, 63, 68, 60, 60,   2.5, 1),

  // ── NEW ORLEANS PELICANS ──────────────────────────────────────────────────
  player('Zion Williamson',      'PF', 'NOP', 24, 89, 90, 72, 72, 96, 74, 92,  35.5, 3, 70),
  player('Brandon Ingram',       'SF', 'NOP', 27, 85, 85, 74, 65, 78, 76, 82,  36.2, 2),
  player('CJ McCollum',          'SG', 'NOP', 33, 80, 84, 74, 62, 68, 78, 66,  30.9, 2),
  player('Herb Jones',           'SF', 'NOP', 26, 74, 66, 62, 82, 80, 68, 74,   6.2, 3),
  player('Trey Murphy III',      'SF', 'NOP', 24, 76, 76, 60, 67, 74, 66, 78,  13.3, 3),
  player('Dejounte Murray',      'PG', 'NOP', 28, 84, 78, 82, 76, 82, 76, 82,  27.9, 3),
  player('Jordan Hawkins',       'SG', 'NOP', 22, 70, 72, 56, 60, 72, 62, 74,   4.0, 3),
  player('Jose Alvarado',        'PG', 'NOP', 26, 70, 66, 68, 74, 72, 68, 66,   4.2, 3),
  player('Larry Nance Jr.',      'PF', 'NOP', 31, 70, 63, 58, 70, 72, 70, 62,   9.7, 2),
  player('Willy Hernangomez',    'C',  'NOP', 30, 70, 66, 55, 66, 65, 68, 58,   7.8, 2),
  player('Javonte Green',        'SF', 'NOP', 29, 67, 62, 55, 66, 78, 58, 56,   3.5, 2),
  player('E.J. Liddell',         'PF', 'NOP', 24, 67, 65, 56, 65, 70, 62, 68,   3.5, 3),
  player('Cody Zeller',          'C',  'NOP', 32, 64, 60, 52, 63, 62, 64, 53,   2.5, 1),

  // ── NEW YORK KNICKS ───────────────────────────────────────────────────────
  player('Jalen Brunson',        'PG', 'NYK', 28, 91, 90, 88, 66, 74, 88, 88,  24.1, 4),
  player('Karl-Anthony Towns',   'C',  'NYK', 29, 90, 88, 74, 72, 78, 82, 86,  49.6, 4),
  player('Mikal Bridges',        'SF', 'NYK', 28, 84, 78, 66, 80, 80, 76, 82,  25.0, 4),
  player('OG Anunoby',           'SF', 'NYK', 27, 82, 74, 60, 84, 84, 72, 80,  34.3, 4),
  player('Josh Hart',            'SF', 'NYK', 29, 78, 68, 65, 75, 78, 72, 68,  12.9, 3),
  player('Deuce McBride',        'PG', 'NYK', 24, 70, 68, 68, 62, 66, 66, 70,   4.3, 3),
  player('Miles McBride',        'PG', 'NYK', 24, 72, 70, 70, 65, 68, 68, 72,   4.3, 3),
  player('Mitchell Robinson',    'C',  'NYK', 27, 72, 60, 48, 74, 82, 60, 70,  16.0, 2, 65),
  player('Precious Achiuwa',     'PF', 'NYK', 25, 70, 65, 55, 68, 76, 62, 68,   5.1, 2),
  player('Cameron Payne',        'PG', 'NYK', 30, 68, 66, 67, 58, 65, 65, 58,   2.5, 1),
  player('Tyler Kolek',          'PG', 'NYK', 23, 68, 65, 70, 58, 62, 66, 72,   3.5, 3),
  player('Landry Shamet',        'SG', 'NYK', 27, 67, 69, 58, 56, 60, 66, 58,   3.5, 1),
  player('Isaiah Roby',          'PF', 'NYK', 26, 65, 63, 55, 63, 68, 60, 60,   2.5, 2),

  // ── OKLAHOMA CITY THUNDER ─────────────────────────────────────────────────
  player('Shai Gilgeous-Alexander','PG','OKC', 26, 96, 95, 92, 80, 92, 90, 97,  34.4, 4),
  player('Jalen Williams',       'SG', 'OKC', 23, 88, 86, 80, 72, 82, 82, 92,  22.7, 4),
  player('Chet Holmgren',        'C',  'OKC', 22, 84, 80, 65, 86, 78, 80, 91,  19.0, 4),
  player('Alex Caruso',          'SG', 'OKC', 30, 76, 66, 68, 84, 76, 78, 66,  12.0, 2),
  player('Isaiah Hartenstein',   'C',  'OKC', 26, 77, 66, 60, 76, 74, 72, 74,  16.0, 3),
  player('Lu Dort',              'SG', 'OKC', 25, 74, 70, 60, 80, 78, 65, 70,  11.0, 2),
  player('Aaron Wiggins',        'SG', 'OKC', 25, 69, 68, 58, 64, 68, 62, 66,   3.9, 3),
  player('Ousmane Dieng',        'SF', 'OKC', 22, 67, 65, 58, 62, 72, 60, 74,   3.4, 3),
  player('Isaiah Joe',           'SG', 'OKC', 25, 67, 69, 55, 57, 63, 62, 60,   2.5, 2),
  player('Kenrich Williams',     'SF', 'OKC', 30, 67, 62, 58, 65, 66, 65, 56,   8.0, 2),
  player('Adam Flagler',         'PG', 'OKC', 24, 65, 65, 63, 56, 62, 63, 64,   2.0, 3),
  player('Cason Wallace',        'PG', 'OKC', 21, 69, 65, 65, 66, 70, 64, 76,   5.0, 3),
  player('Jaylin Williams',      'PF', 'OKC', 22, 65, 61, 54, 63, 66, 62, 66,   2.0, 3),

  // ── ORLANDO MAGIC ─────────────────────────────────────────────────────────
  player('Paolo Banchero',       'PF', 'ORL', 22, 87, 85, 78, 70, 84, 78, 93,  16.7, 4),
  player('Franz Wagner',         'SF', 'ORL', 23, 85, 82, 76, 70, 80, 78, 88,  16.3, 4),
  player('Jalen Suggs',          'PG', 'ORL', 23, 76, 70, 72, 74, 78, 68, 78,   6.7, 3),
  player('Wendell Carter Jr.',   'C',  'ORL', 25, 76, 66, 60, 76, 72, 72, 72,  14.6, 2),
  player('Cole Anthony',         'PG', 'ORL', 24, 74, 74, 70, 58, 70, 66, 74,  12.7, 2),
  player('Gary Harris',          'SG', 'ORL', 30, 68, 66, 60, 66, 66, 65, 58,  13.3, 2),
  player('Moritz Wagner',        'C',  'ORL', 27, 72, 70, 56, 64, 68, 66, 66,  10.0, 2),
  player('Jonathan Isaac',       'PF', 'ORL', 27, 72, 64, 56, 78, 78, 66, 72,  17.1, 3, 65),
  player('Kentavious Caldwell-Pope','SG','ORL',31, 75, 75, 60, 74, 70, 70, 62,  14.0, 2),
  player('Anthony Black',        'PG', 'ORL', 21, 70, 66, 68, 65, 72, 64, 78,   5.0, 3),
  player('Caleb Houstan',        'SF', 'ORL', 22, 67, 68, 55, 60, 66, 62, 68,   3.2, 3),
  player('Tristan da Silva',     'SF', 'ORL', 24, 68, 67, 58, 62, 68, 64, 70,   4.1, 3),
  player('Goga Bitadze',         'C',  'ORL', 25, 67, 63, 52, 66, 68, 62, 64,   5.0, 2),

  // ── PHILADELPHIA 76ERS ────────────────────────────────────────────────────
  player('Joel Embiid',          'C',  'PHI', 30, 94, 90, 72, 82, 80, 88, 88,  51.4, 4, 70),
  player('Paul George',          'SF', 'PHI', 34, 88, 88, 74, 78, 78, 82, 76,  51.8, 3),
  player('Tyrese Maxey',         'PG', 'PHI', 24, 87, 88, 80, 66, 82, 76, 88,  35.9, 4),
  player('Kelly Oubre Jr.',      'SF', 'PHI', 29, 74, 72, 56, 68, 76, 62, 66,  12.9, 2),
  player('Andre Drummond',       'C',  'PHI', 31, 70, 62, 48, 66, 74, 60, 58,   3.5, 1),
  player('Eric Gordon',          'SG', 'PHI', 36, 70, 74, 58, 58, 62, 67, 54,  12.8, 1),
  player('KJ Martin',            'PF', 'PHI', 24, 70, 66, 54, 66, 78, 58, 68,   4.8, 2),
  player('Guerschon Yabusele',   'PF', 'PHI', 29, 70, 66, 58, 64, 68, 65, 60,   4.6, 2),
  player('Jared McCain',         'PG', 'PHI', 20, 71, 72, 68, 56, 70, 62, 80,   4.5, 4),
  player('Caleb Martin',         'SF', 'PHI', 29, 70, 65, 58, 68, 72, 65, 62,  14.0, 2),
  player('Paul Reed',            'C',  'PHI', 25, 67, 62, 50, 65, 72, 59, 65,   3.0, 2),
  player('Jeff Dowtin Jr.',      'PG', 'PHI', 26, 63, 62, 62, 56, 62, 60, 58,   2.0, 2),
  player('Terquavion Smith',     'PG', 'PHI', 22, 66, 68, 58, 56, 66, 60, 72,   2.5, 3),

  // ── PHOENIX SUNS ──────────────────────────────────────────────────────────
  player('Kevin Durant',         'SF', 'PHX', 36, 94, 95, 74, 72, 78, 90, 80,  51.2, 2),
  player('Devin Booker',         'SG', 'PHX', 28, 90, 93, 78, 62, 78, 84, 88,  36.0, 3),
  player('Bradley Beal',         'SG', 'PHX', 31, 80, 83, 72, 60, 72, 74, 68,  46.7, 2, 65),
  player('Grayson Allen',        'SG', 'PHX', 29, 73, 76, 60, 64, 68, 68, 65,  12.2, 2),
  player('Jusuf Nurkic',         'C',  'PHX', 30, 76, 68, 60, 72, 68, 72, 62,  17.5, 2),
  player('Ryan Dunn',            'SF', 'PHX', 22, 70, 66, 58, 72, 78, 60, 78,   5.6, 4),
  player('Damion Lee',           'SG', 'PHX', 31, 67, 68, 56, 60, 62, 63, 54,   3.0, 1),
  player('David Roddy',          'SF', 'PHX', 23, 67, 65, 56, 63, 67, 62, 68,   2.5, 2),
  player('Drew Eubanks',         'C',  'PHX', 27, 67, 62, 50, 65, 66, 60, 60,   3.0, 2),
  player('Josh Okogie',          'SG', 'PHX', 26, 66, 62, 55, 67, 73, 58, 58,   5.0, 2),
  player('Bol Bol',              'C',  'PHX', 25, 68, 66, 55, 63, 68, 60, 65,   2.5, 1),
  player('Monte Morris',         'PG', 'PHX', 28, 68, 65, 68, 58, 62, 66, 60,   6.5, 2),
  player('Keita Bates-Diop',     'SF', 'PHX', 28, 65, 63, 55, 63, 66, 60, 58,   3.0, 1),

  // ── PORTLAND TRAIL BLAZERS ────────────────────────────────────────────────
  player('Anfernee Simons',      'SG', 'POR', 26, 82, 86, 74, 60, 76, 68, 80,  23.5, 3),
  player('Scoot Henderson',      'PG', 'POR', 21, 76, 72, 78, 62, 84, 66, 86,  11.0, 3),
  player('Shaedon Sharpe',       'SG', 'POR', 21, 78, 80, 62, 62, 84, 64, 88,   9.7, 3),
  player('Jerami Grant',         'PF', 'POR', 30, 77, 74, 58, 72, 76, 68, 68,  21.0, 2),
  player('Deandre Ayton',        'C',  'POR', 26, 79, 72, 58, 74, 78, 68, 74,  32.7, 2),
  player('Toumani Camara',       'SF', 'POR', 24, 72, 66, 60, 70, 76, 64, 72,   4.5, 3),
  player('Jabari Walker',        'PF', 'POR', 22, 68, 64, 56, 65, 70, 60, 70,   2.5, 3),
  player('Robert Williams III',  'C',  'POR', 27, 72, 62, 52, 76, 80, 62, 70,  13.6, 1, 60),
  player('Deni Avdija',          'SF', 'POR', 23, 76, 70, 66, 70, 74, 68, 78,  12.1, 3),
  player('Matisse Thybulle',     'SG', 'POR', 27, 68, 58, 55, 80, 78, 58, 60,   5.8, 2),
  player('Donovan Clingan',      'C',  'POR', 20, 70, 62, 52, 72, 74, 62, 80,   6.4, 4),
  player('Malcolm Brogdon',      'PG', 'POR', 32, 74, 72, 70, 64, 66, 74, 62,  18.3, 1),
  player('Dalano Banton',        'PG', 'POR', 24, 65, 62, 63, 60, 68, 60, 64,   2.5, 2),

  // ── SACRAMENTO KINGS ──────────────────────────────────────────────────────
  player('De\'Aaron Fox',        'PG', 'SAC', 27, 88, 84, 86, 68, 92, 76, 86,  30.7, 4),
  player('Domantas Sabonis',     'C',  'SAC', 28, 87, 80, 82, 68, 72, 84, 82,  18.5, 3),
  player('Keegan Murray',        'SF', 'SAC', 24, 78, 78, 60, 66, 74, 70, 80,  16.0, 3),
  player('Harrison Barnes',      'SF', 'SAC', 32, 74, 72, 58, 66, 68, 70, 62,  11.4, 2),
  player('Malik Monk',           'SG', 'SAC', 27, 76, 78, 68, 60, 68, 68, 68,  19.0, 3),
  player('Trey Lyles',           'PF', 'SAC', 29, 68, 66, 55, 62, 64, 65, 58,   8.3, 2),
  player('Keon Ellis',           'SG', 'SAC', 24, 67, 65, 56, 66, 68, 60, 68,   2.5, 3),
  player('Colby Jones',          'SF', 'SAC', 22, 68, 64, 62, 62, 68, 62, 70,   3.5, 3),
  player('Chris Duarte',         'SG', 'SAC', 27, 64, 64, 55, 60, 65, 60, 58,   3.5, 1),
  player('Mason Jones',          'SG', 'SAC', 26, 63, 64, 56, 56, 62, 58, 58,   2.0, 2),
  player('Sasha Vezenkov',       'SF', 'SAC', 27, 66, 66, 55, 58, 62, 64, 60,   3.0, 1),
  player('Alex Len',             'C',  'SAC', 31, 65, 62, 48, 63, 64, 60, 52,   2.5, 1),
  player('Jordan Ford',          'PG', 'SAC', 26, 62, 64, 58, 55, 62, 58, 56,   1.5, 2),

  // ── SAN ANTONIO SPURS ─────────────────────────────────────────────────────
  player('Victor Wembanyama',    'C',  'SAS', 21, 90, 84, 70, 90, 86, 84, 99,  12.2, 4),
  player('Devin Vassell',        'SG', 'SAS', 24, 79, 76, 68, 68, 74, 72, 80,  21.2, 3),
  player('Keldon Johnson',       'SF', 'SAS', 25, 74, 72, 60, 67, 76, 64, 70,  11.5, 2),
  player('Jeremy Sochan',        'PF', 'SAS', 22, 74, 68, 64, 72, 78, 66, 80,  10.4, 3),
  player('Tre Jones',            'PG', 'SAS', 25, 71, 63, 72, 65, 66, 68, 66,   6.1, 3),
  player('Stephon Castle',       'PG', 'SAS', 20, 72, 68, 68, 64, 72, 64, 82,   8.0, 4),
  player('Chris Paul',           'PG', 'SAS', 39, 74, 68, 84, 60, 56, 90, 52,   4.0, 1),
  player('Blake Wesley',         'SG', 'SAS', 22, 67, 65, 62, 58, 72, 57, 70,   3.5, 3),
  player('Charles Bassey',       'C',  'SAS', 24, 67, 62, 50, 67, 72, 58, 66,   2.5, 2),
  player('Malaki Branham',       'SG', 'SAS', 22, 68, 68, 58, 58, 68, 60, 70,   3.5, 3),
  player('Sandro Mamukelashvili','PF', 'SAS', 26, 66, 63, 56, 62, 62, 63, 60,   2.5, 2),
  player('Julian Champagnie',    'SF', 'SAS', 23, 67, 67, 55, 62, 68, 60, 66,   3.5, 3),
  player('Zach Collins',         'C',  'SAS', 27, 68, 64, 56, 65, 65, 65, 62,   7.5, 2),

  // ── TORONTO RAPTORS ───────────────────────────────────────────────────────
  player('Scottie Barnes',       'SF', 'TOR', 23, 85, 78, 78, 74, 86, 78, 91,  30.6, 4),
  player('Immanuel Quickley',    'PG', 'TOR', 25, 80, 78, 78, 62, 72, 72, 80,  17.8, 3),
  player('RJ Barrett',           'SF', 'TOR', 24, 80, 78, 68, 65, 76, 68, 80,  22.4, 3),
  player('Jakob Poeltl',         'C',  'TOR', 29, 77, 66, 58, 76, 72, 72, 68,  22.8, 3),
  player('Davion Mitchell',      'PG', 'TOR', 25, 70, 66, 67, 66, 70, 62, 64,   6.0, 2),
  player('Gradey Dick',          'SG', 'TOR', 21, 72, 74, 58, 60, 68, 64, 78,   5.0, 3),
  player('Ochai Agbaji',         'SG', 'TOR', 24, 70, 68, 56, 64, 70, 62, 68,   4.3, 2),
  player('Chris Boucher',        'PF', 'TOR', 31, 67, 64, 52, 65, 68, 62, 54,   4.2, 2),
  player('Kelly Olynyk',         'C',  'TOR', 33, 68, 65, 60, 60, 60, 68, 54,   5.5, 1),
  player('Bruce Brown',          'SF', 'TOR', 28, 70, 64, 62, 67, 72, 64, 60,  10.4, 2),
  player('Jamal Shead',          'PG', 'TOR', 23, 67, 63, 68, 62, 65, 65, 70,   2.0, 3),
  player('Jonathon Mogbo',       'PF', 'TOR', 22, 66, 63, 54, 64, 70, 58, 70,   3.1, 3),
  player('Davion Mitchell',      'PG', 'TOR', 26, 68, 64, 66, 64, 66, 64, 62,   6.5, 2),

  // ── UTAH JAZZ ─────────────────────────────────────────────────────────────
  player('Lauri Markkanen',      'PF', 'UTA', 27, 83, 84, 62, 66, 72, 74, 80,  21.4, 3),
  player('Walker Kessler',       'C',  'UTA', 23, 74, 62, 52, 80, 74, 66, 82,   8.0, 3),
  player('Collin Sexton',        'PG', 'UTA', 26, 76, 78, 68, 58, 74, 66, 72,  18.5, 2),
  player('Jordan Clarkson',      'PG', 'UTA', 32, 74, 78, 65, 54, 65, 66, 58,  14.3, 1),
  player('John Collins',         'PF', 'UTA', 27, 74, 72, 55, 64, 76, 62, 68,  19.5, 2),
  player('Taylor Hendricks',     'PF', 'UTA', 21, 70, 67, 55, 67, 74, 62, 78,   7.5, 3, 70),
  player('Keyonte George',       'PG', 'UTA', 21, 72, 73, 68, 56, 70, 62, 78,   7.2, 3),
  player('Cody Williams',        'SF', 'UTA', 20, 68, 66, 60, 60, 72, 60, 80,   7.8, 4),
  player('Isaiah Collier',       'PG', 'UTA', 20, 67, 63, 68, 56, 68, 60, 78,   6.0, 4),
  player('Kyle Filipowski',      'C',  'UTA', 20, 69, 66, 58, 64, 68, 66, 78,   6.5, 4),
  player('Brice Sensabaugh',     'SF', 'UTA', 21, 67, 68, 53, 58, 66, 60, 72,   4.9, 3),
  player('Kris Dunn',            'PG', 'UTA', 30, 66, 60, 63, 68, 68, 63, 54,   4.0, 1),
  player('Svi Mykhailiuk',       'SG', 'UTA', 27, 64, 65, 55, 56, 60, 62, 55,   2.0, 1),

  // ── WASHINGTON WIZARDS ────────────────────────────────────────────────────
  player('Jordan Poole',         'PG', 'WAS', 25, 78, 80, 70, 52, 72, 64, 74,  27.5, 3),
  player('Alexandre Sarr',       'C',  'WAS', 20, 74, 68, 58, 74, 78, 64, 92,   9.2, 4),
  player('Kyle Kuzma',           'PF', 'WAS', 29, 74, 72, 60, 62, 68, 64, 64,  13.0, 1),
  player('Bilal Coulibaly',      'SF', 'WAS', 21, 72, 66, 62, 70, 78, 62, 80,   5.3, 3),
  player('Jonas Valanciunas',    'C',  'WAS', 32, 74, 70, 55, 68, 64, 70, 58,  16.2, 1),
  player('Corey Kispert',        'SF', 'WAS', 25, 70, 72, 55, 60, 65, 65, 66,   6.3, 3),
  player('Carlton Carrington',   'PG', 'WAS', 21, 68, 65, 65, 58, 68, 60, 74,   4.6, 4),
  player('Tyus Jones',           'PG', 'WAS', 29, 72, 62, 74, 60, 62, 72, 60,   8.5, 2),
  player('Marvin Bagley III',    'PF', 'WAS', 26, 68, 66, 50, 62, 68, 58, 60,   3.5, 1),
  player('Bilal Coulibaly',      'SF', 'WAS', 21, 70, 65, 58, 68, 74, 60, 76,   5.5, 3),
  player('Richaun Holmes',       'C',  'WAS', 31, 67, 63, 50, 65, 68, 62, 54,   5.0, 1),
  player('Patrick Baldwin Jr.',  'SF', 'WAS', 23, 65, 64, 56, 58, 65, 60, 66,   3.0, 3),
  player('Anthony Gill',         'SF', 'WAS', 31, 62, 60, 52, 60, 63, 59, 50,   2.0, 1),
];

// Build lookup maps
const NBA_PLAYERS_BY_ID = {};
const NBA_PLAYERS_BY_TEAM = {};

NBA_PLAYERS_RAW.forEach(p => {
  NBA_PLAYERS_BY_ID[p.id] = p;
  if (!NBA_PLAYERS_BY_TEAM[p.team]) NBA_PLAYERS_BY_TEAM[p.team] = [];
  NBA_PLAYERS_BY_TEAM[p.team].push(p);
});

// Deep copy for game initialization (preserves original data)
function getInitialRosters() {
  return NBA_PLAYERS_RAW.map(p => ({
    ...p,
    stats: { ppg: 0, rpg: 0, apg: 0, gamesPlayed: 0 }
  }));
}

// Compute season averages based on OVR (rough simulation)
function estimateStats(player) {
  const ovr = player.ovr;
  const ppg = Math.round((player.scoring * 0.28 + ovr * 0.12) * 10) / 10;
  const rpg = Math.round(((player.pos === 'C' || player.pos === 'PF' ? 1.4 : 0.7) * (ovr / 15)) * 10) / 10;
  const apg = Math.round((player.playmaking * 0.06 * (player.pos === 'PG' ? 1.8 : 1.0)) * 10) / 10;
  return { ppg, rpg, apg };
}
