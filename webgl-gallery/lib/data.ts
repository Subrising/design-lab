export interface Artwork {
  slug: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description: string;
  image: string;
  thumb: string;
  accent: string;
}

export const artworks: Artwork[] = [
  {
    slug: 'coastal-fog',
    title: 'Coastal Fog',
    artist: 'Elena Vasquez',
    year: '2024',
    medium: 'Digital Photography',
    description:
      'Morning fog dissolving over the Pacific coastline, captured in the precise hour when light and vapor become indistinguishable from one another. Shot over three consecutive dawns.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    accent: '#4a7b9d',
  },
  {
    slug: 'urban-geometry',
    title: 'Urban Geometry',
    artist: 'Marcus Chen',
    year: '2024',
    medium: 'Architectural Photography',
    description:
      'The hidden lattice of modern cities — façades become abstract canvases where shadow and light compose a language beyond architecture.',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80',
    accent: '#2d3a4a',
  },
  {
    slug: 'botanical-series-iii',
    title: 'Botanical Series III',
    artist: 'Amara Osei',
    year: '2023',
    medium: 'Macro Photography',
    description:
      'Extreme close-up studies of plant specimens that transform the ordinary into alien terrain. Part of an ongoing series examining scale as a dimension of perception.',
    image:
      'https://images.unsplash.com/photo-1490750967868-88df5691cc16?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1490750967868-88df5691cc16?w=900&q=80',
    accent: '#3d6b4f',
  },
  {
    slug: 'neon-reverie',
    title: 'Neon Reverie',
    artist: 'Yuki Tanaka',
    year: '2024',
    medium: 'Night Photography',
    description:
      'Wet city streets at midnight — neon reflections stretched across rain-slicked asphalt, transformed into rivers of pure chromatic light.',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80',
    accent: '#6b2d82',
  },
  {
    slug: 'desert-frequencies',
    title: 'Desert Frequencies',
    artist: 'Laila Nassar',
    year: '2023',
    medium: 'Aerial Photography',
    description:
      'Sand dune formations photographed from 800 meters reveal the desert as a breathing entity with its own rhythm and mathematics.',
    image:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80',
    accent: '#c4823a',
  },
  {
    slug: 'submerged',
    title: 'Submerged',
    artist: 'Kai Nakamura',
    year: '2024',
    medium: 'Underwater Photography',
    description:
      'The liminal space between surface and depth — where light refracts into spectrum and particle, creating a visual language unavailable above water.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=90',
    thumb:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80',
    accent: '#1a5f7a',
  },
];
