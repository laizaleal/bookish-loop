import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

import book1 from "@/assets/book1.jpg";
import book2 from "@/assets/book2.jpg";
import book3 from "@/assets/book3.jpg";
import book4 from "@/assets/book4.jpg";
import book5 from "@/assets/book5.jpg";
import book6 from "@/assets/book6.jpg";

const books = [
  {
    id: "1",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    publisher: "Martins Fontes",
    price: 45.90,
    originalPrice: 89.90,
    condition: "Ótimo Estado",
    imageUrl: book1,
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
  },
];

const Catalog = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold mb-2">Catálogo de Livros</h1>
          <p className="text-muted-foreground">
            Explore nossa coleção de livros usados em excelente estado
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-up">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <div className="flex flex-wrap gap-4 items-center">
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="title">Título A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Condição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="excellent">Ótimo Estado</SelectItem>
                <SelectItem value="good">Bom Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {books.length} livros encontrados
          </span>
        </div>

        {/* Filters Sidebar - Mobile */}
        {showFilters && (
          <div className="sm:hidden mb-6 p-4 bg-card rounded-lg border border-border animate-slide-up">
            <h3 className="font-semibold mb-4">Faixa de Preço</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>R$ {priceRange[0]}</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
