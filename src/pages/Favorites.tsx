// src/pages/Favorites.tsx (SIMPLIFICADO)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { favoriteService } from "@/services/favoriteService";
import { Book } from "@/types/book";

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando favoritos...');
      
      const [books, count] = await Promise.all([
        favoriteService.getFavoriteBooks(),
        favoriteService.getFavoriteCount()
      ]);
      
      console.log('✅ Favoritos carregados:', books.length, 'livros');
      setFavoriteBooks(books);
      setFavoriteCount(count);
    } catch (error) {
      console.error('❌ Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Carregando favoritos...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (favoriteCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Heart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-4">Seus favoritos estão vazios</h1>
            <p className="text-muted-foreground mb-8">
              Adicione alguns livros incríveis aos seus favoritos!
            </p>
            <Link to="/catalog">
              <Button size="lg">Explorar Catálogo</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Meus Favoritos</h1>
            <p className="text-muted-foreground">
              {favoriteCount} {favoriteCount === 1 ? 'livro favoritado' : 'livros favoritados'}
            </p>
          </div>
          <Link to="/catalog">
            <Button variant="outline">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;