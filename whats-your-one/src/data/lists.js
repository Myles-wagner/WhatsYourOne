// Sample images - replace with actual images or use placeholders
const placeholderBase = "https://via.placeholder.com/300x160?text=";

export const allLists = [
  {
    id: "movies",
    title: "Greatest Movies",
    description: "Find your favorite film from these critically acclaimed classics.",
    coverImage: `${placeholderBase}Movies`,
    items: [
      { id: 'movie1', name: 'The Shawshank Redemption', image: 'https://via.placeholder.com/150?text=Shawshank' },
      { id: 'movie2', name: 'The Godfather', image: 'https://via.placeholder.com/150?text=Godfather' },
      { id: 'movie3', name: 'The Dark Knight', image: 'https://via.placeholder.com/150?text=DarkKnight' },
      { id: 'movie4', name: 'Pulp Fiction', image: 'https://via.placeholder.com/150?text=PulpFiction' },
      { id: 'movie5', name: 'Fight Club', image: 'https://via.placeholder.com/150?text=FightClub' },
      { id: 'movie6', name: 'Inception', image: 'https://via.placeholder.com/150?text=Inception' },
      { id: 'movie7', name: 'The Matrix', image: 'https://via.placeholder.com/150?text=Matrix' },
      { id: 'movie8', name: 'Goodfellas', image: 'https://via.placeholder.com/150?text=Goodfellas' },
      { id: 'movie9', name: 'The Lord of the Rings', image: 'https://via.placeholder.com/150?text=LOTR' },
      { id: 'movie10', name: 'Star Wars', image: 'https://via.placeholder.com/150?text=StarWars' },
    ]
  },
  {
    id: "books",
    title: "Classic Literature",
    description: "Determine your all-time favorite literary masterpiece.",
    coverImage: `${placeholderBase}Books`,
    items: [
      { id: 'book1', name: 'Pride and Prejudice', image: 'https://via.placeholder.com/150?text=Pride' },
      { id: 'book2', name: '1984', image: 'https://via.placeholder.com/150?text=1984' },
      { id: 'book3', name: 'To Kill a Mockingbird', image: 'https://via.placeholder.com/150?text=Mockingbird' },
      { id: 'book4', name: 'The Great Gatsby', image: 'https://via.placeholder.com/150?text=Gatsby' },
      { id: 'book5', name: 'One Hundred Years of Solitude', image: 'https://via.placeholder.com/150?text=Solitude' },
      { id: 'book6', name: 'Brave New World', image: 'https://via.placeholder.com/150?text=BraveNewWorld' },
      { id: 'book7', name: 'Jane Eyre', image: 'https://via.placeholder.com/150?text=JaneEyre' },
      { id: 'book8', name: 'Crime and Punishment', image: 'https://via.placeholder.com/150?text=Crime' },
      { id: 'book9', name: 'The Catcher in the Rye', image: 'https://via.placeholder.com/150?text=Catcher' },
      { id: 'book10', name: 'The Hobbit', image: 'https://via.placeholder.com/150?text=Hobbit' },
    ]
  },
  {
    id: "games",
    title: "Video Games",
    description: "Choose your ultimate favorite from these iconic video games.",
    coverImage: `${placeholderBase}Games`,
    items: [
      { id: 'game1', name: 'The Legend of Zelda: Breath of the Wild', image: 'https://via.placeholder.com/150?text=Zelda' },
      { id: 'game2', name: 'The Witcher 3: Wild Hunt', image: 'https://via.placeholder.com/150?text=Witcher' },
      { id: 'game3', name: 'Red Dead Redemption 2', image: 'https://via.placeholder.com/150?text=RDR2' },
      { id: 'game4', name: 'God of War', image: 'https://via.placeholder.com/150?text=GodOfWar' },
      { id: 'game5', name: 'Grand Theft Auto V', image: 'https://via.placeholder.com/150?text=GTAV' },
      { id: 'game6', name: 'The Last of Us', image: 'https://via.placeholder.com/150?text=LastOfUs' },
      { id: 'game7', name: 'Minecraft', image: 'https://via.placeholder.com/150?text=Minecraft' },
      { id: 'game8', name: 'Super Mario Odyssey', image: 'https://via.placeholder.com/150?text=Mario' },
      { id: 'game9', name: 'Dark Souls', image: 'https://via.placeholder.com/150?text=DarkSouls' },
      { id: 'game10', name: 'Fortnite', image: 'https://via.placeholder.com/150?text=Fortnite' },
    ]
  },
  {
    id: "tvshows",
    title: "TV Shows",
    description: "Pick your favorite television series of all time.",
    coverImage: `${placeholderBase}TVShows`,
    items: [
      { id: 'tv1', name: 'Breaking Bad', image: 'https://via.placeholder.com/150?text=BreakingBad' },
      { id: 'tv2', name: 'Game of Thrones', image: 'https://via.placeholder.com/150?text=GOT' },
      { id: 'tv3', name: 'Friends', image: 'https://via.placeholder.com/150?text=Friends' },
      { id: 'tv4', name: 'The Office', image: 'https://via.placeholder.com/150?text=Office' },
      { id: 'tv5', name: 'Stranger Things', image: 'https://via.placeholder.com/150?text=Stranger' },
      { id: 'tv6', name: 'The Wire', image: 'https://via.placeholder.com/150?text=TheWire' },
      { id: 'tv7', name: 'The Sopranos', image: 'https://via.placeholder.com/150?text=Sopranos' },
      { id: 'tv8', name: 'Black Mirror', image: 'https://via.placeholder.com/150?text=BlackMirror' },
      { id: 'tv9', name: 'The Mandalorian', image: 'https://via.placeholder.com/150?text=Mandalorian' },
      { id: 'tv10', name: 'The Simpsons', image: 'https://via.placeholder.com/150?text=Simpsons' },
    ]
  },
  {
    id: "destinations",
    title: "Travel Destinations",
    description: "Discover your dream vacation spot from these popular destinations.",
    coverImage: `${placeholderBase}Travel`,
    items: [
      { id: 'dest1', name: 'Tokyo, Japan', image: 'https://via.placeholder.com/150?text=Tokyo' },
      { id: 'dest2', name: 'Paris, France', image: 'https://via.placeholder.com/150?text=Paris' },
      { id: 'dest3', name: 'New York City, USA', image: 'https://via.placeholder.com/150?text=NYC' },
      { id: 'dest4', name: 'Rome, Italy', image: 'https://via.placeholder.com/150?text=Rome' },
      { id: 'dest5', name: 'Bali, Indonesia', image: 'https://via.placeholder.com/150?text=Bali' },
      { id: 'dest6', name: 'Barcelona, Spain', image: 'https://via.placeholder.com/150?text=Barcelona' },
      { id: 'dest7', name: 'Sydney, Australia', image: 'https://via.placeholder.com/150?text=Sydney' },
      { id: 'dest8', name: 'Cape Town, South Africa', image: 'https://via.placeholder.com/150?text=CapeTown' },
      { id: 'dest9', name: 'Rio de Janeiro, Brazil', image: 'https://via.placeholder.com/150?text=Rio' },
      { id: 'dest10', name: 'London, UK', image: 'https://via.placeholder.com/150?text=London' },
    ]
  },
  {
    id: "foods",
    title: "Favorite Foods",
    description: "Determine your absolute favorite food from these delicious options.",
    coverImage: `${placeholderBase}Foods`,
    items: [
      { id: 'food1', name: 'Pizza', image: 'https://via.placeholder.com/150?text=Pizza' },
      { id: 'food2', name: 'Sushi', image: 'https://via.placeholder.com/150?text=Sushi' },
      { id: 'food3', name: 'Tacos', image: 'https://via.placeholder.com/150?text=Tacos' },
      { id: 'food4', name: 'Burger', image: 'https://via.placeholder.com/150?text=Burger' },
      { id: 'food5', name: 'Pasta', image: 'https://via.placeholder.com/150?text=Pasta' },
      { id: 'food6', name: 'Chocolate', image: 'https://via.placeholder.com/150?text=Chocolate' },
      { id: 'food7', name: 'Ice Cream', image: 'https://via.placeholder.com/150?text=IceCream' },
      { id: 'food8', name: 'Curry', image: 'https://via.placeholder.com/150?text=Curry' },
      { id: 'food9', name: 'Steak', image: 'https://via.placeholder.com/150?text=Steak' },
      { id: 'food10', name: 'Fried Chicken', image: 'https://via.placeholder.com/150?text=FriedChicken' },
    ]
  }
];

// Helper function to find a list by ID
export function getListById(id) {
  return allLists.find(list => list.id === id);
}