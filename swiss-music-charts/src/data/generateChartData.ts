export interface Song {
  id: number;
  title: string;
  artist: string;
  year: number;
  peakPosition: number;
  weeksOnChart: number;
  genre: Genre;
  genreIndex: number;
}

export type Genre =
  | "Pop"
  | "Rock"
  | "Electronic"
  | "Hip-Hop"
  | "R&B"
  | "Jazz"
  | "Classical"
  | "Folk"
  | "Metal"
  | "Reggae";

export const GENRES: Genre[] = [
  "Pop",
  "Rock",
  "Electronic",
  "Hip-Hop",
  "R&B",
  "Jazz",
  "Classical",
  "Folk",
  "Metal",
  "Reggae",
];

export const GENRE_COLORS: Record<Genre, string> = {
  Pop: "#ff6b9d",
  Rock: "#c084fc",
  Electronic: "#22d3ee",
  "Hip-Hop": "#fbbf24",
  "R&B": "#f97316",
  Jazz: "#a78bfa",
  Classical: "#e2e8f0",
  Folk: "#86efac",
  Metal: "#ef4444",
  Reggae: "#34d399",
};

export const GENRE_COLORS_VEC3: Record<Genre, [number, number, number]> = {
  Pop: [1.0, 0.42, 0.62],
  Rock: [0.75, 0.52, 0.99],
  Electronic: [0.13, 0.83, 0.93],
  "Hip-Hop": [0.98, 0.75, 0.14],
  "R&B": [0.98, 0.45, 0.09],
  Jazz: [0.65, 0.55, 0.98],
  Classical: [0.89, 0.91, 0.94],
  Folk: [0.53, 0.94, 0.67],
  Metal: [0.94, 0.27, 0.27],
  Reggae: [0.2, 0.83, 0.6],
};

// Seeded pseudo-random number generator
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const swissArtists: Record<Genre, string[]> = {
  Pop: [
    "DJ BoBo", "Luca Hänni", "Stefanie Heinzmann", "Baschi", "Francine Jordi",
    "Patrick Nuo", "Lunik", "Pegasus", "Seven", "Stress",
    "Beatrice Egli", "Anna Rossinelli", "Lys Assia", "Paola Felix", "Gölä",
    "Bligg", "Nemo", "Ritschi", "Marc Sway", "Sina",
    "Müslüm", "Dabu Fantastic", "Lo & Leduc", "Kunz", "Trauffer",
  ],
  Rock: [
    "Gotthard", "Krokus", "The Young Gods", "Yello", "Züri West",
    "Patent Ochsner", "Eluveitie", "Samael", "Lacrimosa", "Coroner",
    "Celtic Frost", "Shakra", "Lunatica", "Emerald", "China",
    "Killer", "Crystal Ball", "Burning Witches", "Piranha", "Crazy Cavan",
  ],
  Electronic: [
    "Yello", "DJ Antoine", "EDX", "Nora En Pure", "Luciano",
    "Andrea Oliva", "Adriatique", "Digitalism CH", "Stephan Bodzin", "Mind Against",
    "Pigon", "Soulphiction", "Neelix CH", "Deetron", "Len Faki CH",
    "Boris Brejcha CH", "Hosh", "Butch", "Kollektiv Turmstrasse CH", "Rodriguez Jr CH",
  ],
  "Hip-Hop": [
    "Stress", "Bligg", "Lo & Leduc", "Nemo", "Mimiks",
    "Chlykansen", "Greis", "Mundart", "Gimma", "Sektion Kunterbunt",
    "Brandhärd", "Wurzel 5", "PVP", "Xen", "Fetchenhauer",
    "Dodo", "Big Zis", "Steff la Cheffe", "KT Gorique", "Manillio",
  ],
  "R&B": [
    "Seven", "Marc Sway", "Caroline Chevin", "Adriano Ferreri", "Jessy Moravec",
    "Joy Denalane CH", "Naomi Lareine", "Cachita", "Janine Meier", "Tamara Cantieni",
    "Nicole Bernegger", "Mia Aegerter", "Tanja Dankner", "Fabienne Louves", "Aisha",
  ],
  Jazz: [
    "Andreas Vollenweider", "George Gruntz", "Irène Schweizer", "Bruno Spoerri", "Franco Ambrosetti",
    "Pierre Favre", "Daniel Humair", "Nik Bärtsch", "Colin Vallon", "Michael Wollny CH",
    "Thierry Lang", "Plaistow", "Hildegard Lernt Fliegen", "Schnellertolansen", "Hyperactive Kid",
  ],
  Classical: [
    "Heinz Holliger", "Andres Segovia CH", "Martha Argerich CH", "Christian Zacharias", "Aurèle Nicolet",
    "Thomas Demenga", "Patricia Kopatchinskaja", "Sol Gabetta", "Albrecht Mayer CH", "Emmanuel Pahud",
    "Hélène Grimaud CH", "Renaud Capuçon CH", "Gautier Capuçon CH", "Andreas Ottensamer CH", "Vilde Frang CH",
  ],
  Folk: [
    "Trauffer", "Gölä", "Oesch's die Dritten", "Stiller Has", "Züri West",
    "Toni Vescoli", "Polo Hofer", "Mani Matter", "Franz Hohler", "Hanery Amman",
    "Span", "Christine Lauterburg", "Erika Stucky", "Nadja Stoller", "Steff la Cheffe Folk",
  ],
  Metal: [
    "Celtic Frost", "Coroner", "Samael", "Eluveitie", "Krokus",
    "Lacrimosa", "Burning Witches", "Bölzer", "Zatokrev", "Schammasch",
    "Darkspace", "Zeal & Ardor", "Nostromo", "Kruger", "Mumakil",
  ],
  Reggae: [
    "Toni Childs CH", "Phenomden", "Mellow Mark CH", "Dodo Reggae", "Filewile",
    "Coco Bongo CH", "Rootwords", "King Pepe", "Stereo Luchs", "Tommy Vercetti CH",
    "Chezidek CH", "Dub Spencer & Trance Hill", "Dubokaj", "Raggabund CH", "Junior Natural CH",
  ],
};

const songPrefixes = [
  "Love", "Night", "Summer", "Dream", "Fire", "Heart", "Star", "Moon",
  "Sun", "Rain", "Dance", "Magic", "Golden", "Silver", "Blue", "Red",
  "Wild", "Sweet", "Dark", "Bright", "Electric", "Neon", "Crystal", "Shadow",
  "Midnight", "Dawn", "Twilight", "Ocean", "Mountain", "Thunder",
];

const songSuffixes = [
  "Song", "Beat", "Rhythm", "Melody", "Groove", "Vibes", "Feeling",
  "Night", "Light", "Sky", "Wave", "Storm", "Rain", "Road", "Story",
  "Kiss", "Touch", "Eyes", "Soul", "Spirit", "Paradise", "Boulevard",
  "River", "Wind", "Fire", "Dream", "Life", "World", "Echo", "Signal",
];

// Genre popularity distribution per decade
const genrePopularity: Record<string, Record<Genre, number>> = {
  "1970s": { Pop: 30, Rock: 35, Electronic: 3, "Hip-Hop": 0, "R&B": 5, Jazz: 8, Classical: 8, Folk: 8, Metal: 2, Reggae: 1 },
  "1980s": { Pop: 35, Rock: 25, Electronic: 10, "Hip-Hop": 3, "R&B": 7, Jazz: 5, Classical: 5, Folk: 5, Metal: 4, Reggae: 1 },
  "1990s": { Pop: 30, Rock: 20, Electronic: 15, "Hip-Hop": 10, "R&B": 8, Jazz: 3, Classical: 3, Folk: 4, Metal: 5, Reggae: 2 },
  "2000s": { Pop: 28, Rock: 15, Electronic: 18, "Hip-Hop": 15, "R&B": 10, Jazz: 2, Classical: 2, Folk: 3, Metal: 4, Reggae: 3 },
  "2010s": { Pop: 30, Rock: 10, Electronic: 20, "Hip-Hop": 18, "R&B": 10, Jazz: 2, Classical: 1, Folk: 3, Metal: 3, Reggae: 3 },
  "2020s": { Pop: 28, Rock: 8, Electronic: 22, "Hip-Hop": 20, "R&B": 10, Jazz: 2, Classical: 1, Folk: 3, Metal: 3, Reggae: 3 },
};

function getDecade(year: number): string {
  if (year < 1980) return "1970s";
  if (year < 1990) return "1980s";
  if (year < 2000) return "1990s";
  if (year < 2010) return "2000s";
  if (year < 2020) return "2010s";
  return "2020s";
}

export function generateChartData(): Song[] {
  const rand = seededRandom(42);
  const songs: Song[] = [];
  let id = 0;

  for (let year = 1974; year <= 2024; year++) {
    const decade = getDecade(year);
    const popularity = genrePopularity[decade];
    const songsPerYear = 40 + Math.floor(rand() * 60); // 40-100 songs per year

    for (let s = 0; s < songsPerYear; s++) {
      // Weighted genre selection
      const total = Object.values(popularity).reduce((a, b) => a + b, 0);
      let r = rand() * total;
      let selectedGenre: Genre = "Pop";
      for (const genre of GENRES) {
        r -= popularity[genre];
        if (r <= 0) {
          selectedGenre = genre;
          break;
        }
      }

      const artists = swissArtists[selectedGenre];
      const artist = artists[Math.floor(rand() * artists.length)];
      const prefix = songPrefixes[Math.floor(rand() * songPrefixes.length)];
      const suffix = songSuffixes[Math.floor(rand() * songSuffixes.length)];
      const title = rand() > 0.3 ? `${prefix} ${suffix}` : prefix;

      songs.push({
        id: id++,
        title,
        artist,
        year,
        peakPosition: 1 + Math.floor(rand() * 100),
        weeksOnChart: 1 + Math.floor(rand() * rand() * 52),
        genre: selectedGenre,
        genreIndex: GENRES.indexOf(selectedGenre),
      });
    }
  }

  return songs;
}

export function getDecadeStats(songs: Song[], decade: number) {
  const decadeSongs = songs.filter(
    (s) => s.year >= decade && s.year < decade + 10
  );
  const genreCounts: Record<string, number> = {};
  for (const g of GENRES) {
    genreCounts[g] = decadeSongs.filter((s) => s.genre === g).length;
  }
  const topGenre = Object.entries(genreCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const avgWeeks =
    decadeSongs.reduce((a, s) => a + s.weeksOnChart, 0) / decadeSongs.length;
  const topSongs = [...decadeSongs]
    .sort((a, b) => a.peakPosition - b.peakPosition)
    .slice(0, 5);

  return {
    totalSongs: decadeSongs.length,
    genreCounts,
    topGenre: topGenre ? topGenre[0] : "Pop",
    avgWeeks: Math.round(avgWeeks * 10) / 10,
    topSongs,
  };
}
