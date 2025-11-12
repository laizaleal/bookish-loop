// src/data/mockData.ts
import { Book } from '../types/book';

// 📚 Importando todas as imagens
import book1 from '../assets/book1.jpg';
import book2 from '../assets/book2.jpg';
import book3 from '../assets/book3.jpg';
import book4 from '../assets/book4.jpg';
import book5 from '../assets/book5.jpg';
import book6 from '../assets/book6.jpg';
import book7 from '../assets/book7.jpg';
import book8 from '../assets/book8.jpg';
import book9 from '../assets/book9.jpg';
import book10 from '../assets/book10.jpg';
import book11 from '../assets/book11.jpg';
import book12 from '../assets/book12.jpg';
import book13 from '../assets/book13.jpg';
import book14 from '../assets/book14.jpg';
import book15 from '../assets/book15.jpg';
import book16 from '../assets/book16.jpg';
import book17 from '../assets/book17.jpg';
import book18 from '../assets/book18.jpg';
import book19 from '../assets/book19.jpg';
import book20 from '../assets/book20.jpg';
import book21 from '../assets/book21.jpg';
import book22 from '../assets/book22.jpg';
import book23 from '../assets/book23.jpg';
import book24 from '../assets/book24.jpg';
import book25 from '../assets/book25.jpg';
import book26 from '../assets/book26.jpg';
import book27 from '../assets/book27.jpg';
import book28 from '../assets/book28.jpg';
import book29 from '../assets/book29.jpg';
import book30 from '../assets/book30.jpg';

// 🧠 Agora, todas as referências usam as variáveis importadas
export const books: Book[] = [
  {
    id: "1",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    publisher: "Martins Fontes",
    price: 45.90,
    originalPrice: 89.90,
    condition: "Ótimo Estado",
    imageUrl: book1,
    stock: 10,
    isbn: "978-8533613379",
    description: "A jornada épica pela Terra-média começa neste primeiro volume da trilogia.",
    category: "Fantasia"
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    publisher: "Companhia das Letras",
    price: 35.90,
    originalPrice: 59.90,
    condition: "Bom Estado",
    imageUrl: book2,
    stock: 8,
    isbn: "978-8535914849",
    description: "Um clássico distópico sobre vigilância e controle totalitário.",
    category: "Ficção Científica"
  },
  {
    id: "3",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    publisher: "Record",
    price: 42.90,
    originalPrice: 79.90,
    condition: "Ótimo Estado",
    imageUrl: book3,
    stock: 5,
    isbn: "978-8501014474",
    description: "A obra-prima do realismo mágico que conta a história da família Buendía.",
    category: "Literatura Clássica"
  },
  {
    id: "4",
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    publisher: "Intrínseca",
    price: 38.90,
    originalPrice: 64.90,
    condition: "Ótimo Estado",
    imageUrl: book4,
    stock: 7,
    isbn: "978-8580574443",
    description: "Uma emocionante história sobre uma menina que encontra refúgio nos livros durante a Segunda Guerra.",
    category: "Drama"
  },
  {
    id: "5",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    publisher: "Agir",
    price: 28.90,
    originalPrice: 49.90,
    condition: "Bom Estado",
    imageUrl: book5,
    stock: 12,
    isbn: "978-8522005232",
    description: "Uma fábula poética e filosófica que encanta leitores de todas as idades.",
    category: "Infantil"
  },
  {
    id: "6",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    publisher: "Penguin Companhia",
    price: 32.90,
    originalPrice: 54.90,
    condition: "Ótimo Estado",
    imageUrl: book6,
    stock: 6,
    isbn: "978-8563560430",
    description: "Uma das maiores obras da literatura brasileira, explorando ciúme e ambiguidade.",
    category: "Literatura Brasileira"
  },
  {
    id: "7",
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    publisher: "Rocco",
    price: 39.90,
    originalPrice: 69.90,
    condition: "Ótimo Estado",
    imageUrl: book7,
    stock: 9,
    isbn: "978-8532511010",
    description: "O início da jornada do jovem bruxo Harry Potter na Escola de Magia e Bruxaria de Hogwarts.",
    category: "Fantasia"
  },
  {
    id: "8",
    title: "O Apanhador no Campo de Centeio",
    author: "J.D. Salinger",
    publisher: "Editora do Autor",
    price: 34.90,
    originalPrice: 58.90,
    condition: "Bom Estado",
    imageUrl: book8,
    stock: 4,
    isbn: "978-8571641201",
    description: "Um clássico da literatura juvenil sobre rebeldia e identidade.",
    category: "Literatura Clássica"
  },
  {
    id: "9",
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    publisher: "Martin Claret",
    price: 31.90,
    originalPrice: 52.90,
    condition: "Ótimo Estado",
    imageUrl: book9,
    stock: 6,
    isbn: "978-8572326978",
    description: "Um romance sobre amor, classe social e preconceitos na Inglaterra do século XIX.",
    category: "Romance"
  },
  {
    id: "10",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    publisher: "HarperCollins Brasil",
    price: 44.90,
    originalPrice: 79.90,
    condition: "Ótimo Estado",
    imageUrl: book10,
    stock: 8,
    isbn: "978-8595084742",
    description: "Aventuras de Bilbo Bolseiro em uma jornada épica pela Terra-média.",
    category: "Fantasia"
  },
  {
    id: "11",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    publisher: "Companhia das Letras",
    price: 29.90,
    originalPrice: 49.90,
    condition: "Bom Estado",
    imageUrl: book11,
    stock: 11,
    isbn: "978-8535914849",
    description: "Uma fábula satírica sobre poder, corrupção e manipulação política.",
    category: "Fábula / Política"
  },
  {
    id: "12",
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    publisher: "Companhia das Letras",
    price: 59.90,
    originalPrice: 89.90,
    condition: "Novo",
    imageUrl: book12,
    stock: 10,
    isbn: "978-8535928198",
    description: "Uma fascinante análise sobre a evolução da espécie humana.",
    category: "História / Não-Ficção"
  },
  {
    id: "13",
    title: "O Código Da Vinci",
    author: "Dan Brown",
    publisher: "Arqueiro",
    price: 42.90,
    originalPrice: 74.90,
    condition: "Ótimo Estado",
    imageUrl: book13,
    stock: 5,
    isbn: "978-8599296578",
    description: "Um thriller de conspiração envolvendo arte, religião e segredos antigos.",
    category: "Suspense / Mistério"
  },
  {
    id: "14",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    publisher: "Arqueiro",
    price: 64.90,
    originalPrice: 99.90,
    condition: "Novo",
    imageUrl: book14,
    stock: 7,
    isbn: "978-8580414466",
    description: "A história de Kvothe, um herói lendário e músico prodigioso.",
    category: "Fantasia Épica"
  },
  {
    id: "15",
    title: "Drácula",
    author: "Bram Stoker",
    publisher: "Zahar",
    price: 36.90,
    originalPrice: 59.90,
    condition: "Bom Estado",
    imageUrl: book15,
    stock: 6,
    isbn: "978-8537810675",
    description: "O clássico do terror gótico que imortalizou o vampiro mais famoso da literatura.",
    category: "Terror / Gótico"
  },
  {
    id: "16",
    title: "A Guerra dos Tronos",
    author: "George R.R. Martin",
    publisher: "Leya",
    price: 69.90,
    originalPrice: 109.90,
    condition: "Ótimo Estado",
    imageUrl: book16,
    stock: 5,
    isbn: "978-8551000159",
    description: "O início da saga épica que inspirou a série Game of Thrones.",
    category: "Fantasia"
  },
  {
    id: "17",
    title: "O Alquimista",
    author: "Paulo Coelho",
    publisher: "Paralela",
    price: 33.90,
    originalPrice: 55.90,
    condition: "Bom Estado",
    imageUrl: book17,
    stock: 9,
    isbn: "978-8576653728",
    description: "Uma fábula sobre seguir seus sonhos e ouvir o coração.",
    category: "Ficção Espiritual"
  },
  {
    id: "18",
    title: "Sherlock Holmes: Um Estudo em Vermelho",
    author: "Arthur Conan Doyle",
    publisher: "Zahar",
    price: 29.90,
    originalPrice: 49.90,
    condition: "Ótimo Estado",
    imageUrl: book18,
    stock: 7,
    isbn: "978-8537810170",
    description: "O primeiro caso de Sherlock Holmes e Dr. Watson.",
    category: "Mistério / Policial"
  },
  {
    id: "19",
    title: "A Metamorfose",
    author: "Franz Kafka",
    publisher: "Antofágica",
    price: 26.90,
    originalPrice: 39.90,
    condition: "Ótimo Estado",
    imageUrl: book19,
    stock: 6,
    isbn: "978-6555980192",
    description: "Gregor Samsa acorda transformado em um inseto gigante, em uma das mais perturbadoras obras da literatura.",
    category: "Ficção Existencial"
  },
  {
    id: "20",
    title: "O Sol é para Todos",
    author: "Harper Lee",
    publisher: "José Olympio",
    price: 39.90,
    originalPrice: 64.90,
    condition: "Ótimo Estado",
    imageUrl: book20,
    stock: 4,
    isbn: "978-8503012928",
    description: "Um retrato emocionante sobre justiça e racismo no sul dos EUA.",
    category: "Drama Social"
  },
  {
    id: "21",
    title: "A Sutil Arte de Ligar o F*da-se",
    author: "Mark Manson",
    publisher: "Intrínseca",
    price: 42.90,
    originalPrice: 69.90,
    condition: "Novo",
    imageUrl: book21,
    stock: 12,
    isbn: "978-8551002344",
    description: "Um guia sincero e direto sobre como lidar melhor com os problemas da vida.",
    category: "Autoajuda / Desenvolvimento Pessoal"
  },
  {
    id: "22",
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    publisher: "Rocco",
    price: 49.90,
    originalPrice: 79.90,
    condition: "Ótimo Estado",
    imageUrl: book22,
    stock: 6,
    isbn: "978-8532521118",
    description: "Uma distopia sobre opressão e resistência feminina.",
    category: "Ficção Científica / Distopia"
  },
  {
    id: "23",
    title: "Moby Dick",
    author: "Herman Melville",
    publisher: "Zahar",
    price: 39.90,
    originalPrice: 69.90,
    condition: "Bom Estado",
    imageUrl: book23,
    stock: 3,
    isbn: "978-8537810040",
    description: "A busca obsessiva do capitão Ahab pela baleia branca.",
    category: "Aventura / Clássico"
  },
  {
    id: "24",
    title: "O Morro dos Ventos Uivantes",
    author: "Emily Brontë",
    publisher: "Martin Claret",
    price: 29.90,
    originalPrice: 52.90,
    condition: "Ótimo Estado",
    imageUrl: book24,
    stock: 5,
    isbn: "978-8572327425",
    description: "Uma história intensa de amor e vingança nos campos sombrios de Yorkshire.",
    category: "Romance Gótico"
  },
  {
    id: "25",
    title: "O Lobo da Estepe",
    author: "Hermann Hesse",
    publisher: "Record",
    price: 36.90,
    originalPrice: 59.90,
    condition: "Bom Estado",
    imageUrl: book25,
    stock: 4,
    isbn: "978-8501042644",
    description: "Um mergulho filosófico na dualidade da alma humana.",
    category: "Filosofia / Ficção"
  },
  {
    id: "26",
    title: "O Nome da Rosa",
    author: "Umberto Eco",
    publisher: "Record",
    price: 48.90,
    originalPrice: 84.90,
    condition: "Ótimo Estado",
    imageUrl: book26,
    stock: 4,
    isbn: "978-8501098603",
    description: "Um suspense histórico ambientado em um mosteiro medieval.",
    category: "Romance Histórico / Mistério"
  },
  {
    id: "27",
    title: "Mulherzinhas",
    author: "Louisa May Alcott",
    publisher: "Zahar",
    price: 32.90,
    originalPrice: 55.90,
    condition: "Bom Estado",
    imageUrl: book27,
    stock: 6,
    isbn: "978-8537818336",
    description: "A história comovente de quatro irmãs crescendo durante a Guerra Civil Americana.",
    category: "Clássico / Drama"
  },
  {
    id: "28",
    title: "O Iluminado",
    author: "Stephen King",
    publisher: "Suma",
    price: 58.90,
    originalPrice: 89.90,
    condition: "Novo",
    imageUrl: book28,
    stock: 5,
    isbn: "978-8556510783",
    description: "Um clássico do terror psicológico em um hotel isolado.",
    category: "Terror"
  },
  {
    id: "29",
    title: "O Conde de Monte Cristo",
    author: "Alexandre Dumas",
    publisher: "Zahar",
    price: 69.90,
    originalPrice: 99.90,
    condition: "Ótimo Estado",
    imageUrl: book29,
    stock: 4,
    isbn: "978-8537816066",
    description: "Uma história de traição, justiça e vingança inesquecível.",
    category: "Aventura / Clássico"
  },
  {
    id: "30",
    title: "O Velho e o Mar",
    author: "Ernest Hemingway",
    publisher: "Bertrand Brasil",
    price: 27.90,
    originalPrice: 49.90,
    condition: "Bom Estado",
    imageUrl: book30,
    stock: 8,
    isbn: "978-8528616166",
    description: "Um pescador luta contra um enorme peixe em uma narrativa sobre coragem e resistência.",
    category: "Clássico / Aventura"
  }
];
