export interface Game {
  _id: string
  about_the_game: string
  achievements: number
  average_playtime_2weeks: number
  average_playtime_forever: number
  categories: string[]
  developers: string[]
  dlc_count: number
  estimated_owners: string
  full_audio_languages: string[]
  genres: string[]
  header_image: string
  linux: boolean
  mac: boolean
  median_playtime_2weeks: number
  median_playtime_forever: number
  metacritic_score: number
  metacritic_url: string
  movies: string[]
  name: string
  negative: number
  packages: Package[]
  peak_ccu: number
  positive: number
  price: number
  publishers: string[]
  recommendations: number
  release_date: string
  required_age: number
  reviews: string
  score_rank: string
  screenshots: string[]
  short_description: string
  support_email: string
  support_url: string
  supported_languages: string[]
  tags: Record<string, number>
  user_score: number
  website: string
  windows: boolean
  comments?: Comment[]
}

export interface Package {
  description: string
  subs: Sub[]
  title: string
}

export interface Sub {
  description: string
  price: number
  text: string
}

export interface User {
  sub: string
  likes: Record<string, true>
}

export interface Comment {
  _id: string
  username: string
  comment: string
  date: string
  likes: string[]
}

export const GAME_FIELDS = [
  'achievements',
  'average_playtime_2weeks',
  'average_playtime_forever',
  'categories',
  'dlc_count',
  'linux',
  'mac',
  'median_playtime_2weeks',
  'median_playtime_forever',
  'metacritic_score',
  'name',
  'negative',
  'peak_ccu',
  'positive',
  'price',
  'recommendations',
  'required_age',
  'score_rank',
  'user_score',
  'windows'
]
