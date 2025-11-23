// src/components/BookCard.tsx (ATUALIZADO)
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice?: number;
  condition: string;
  imageUrl: string;
}

const BookCard = ({
  id,
  title,
  author,
  publisher,
  price,
  originalPrice,
  condition,
  imageUrl,
}: BookCardProps) => {
  const { addToCart, getItemCount } = useCart();
  const { toggleFavorite, isFavorite, favoriteBooks } = useFavorites(); // 🔥 Adicionado favoriteBooks
  const { toast } = useToast();
  const [isBookFavorite, setIsBookFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Verifica se o livro é favorito - AGORA MAIS RÁPIDO
  useEffect(() => {
    // Primeiro verifica no estado local para resposta imediata
    const localFavorite = favoriteBooks.includes(id);
    setIsBookFavorite(localFavorite);
    
    // Depois confirma com a função async
    const confirmFavoriteStatus = async () => {
      try {
        const confirmedFavorite = await isFavorite(id);
        if (confirmedFavorite !== localFavorite) {
          setIsBookFavorite(confirmedFavorite);
        }
      } catch (error) {
        console.error('Erro ao confirmar favorito:', error);
      }
    };
    
    confirmFavoriteStatus();
  }, [id, isFavorite, favoriteBooks]); // 🔥 Adicionado favoriteBooks na dependência

  // Atualiza contador do carrinho
  useEffect(() => {
    setCartItemCount(getItemCount());
  }, [getItemCount]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(id, 1);
      
      // Atualiza contador local imediatamente para feedback visual
      setCartItemCount(prev => prev + 1);
      
      toast({
        title: "Adicionado ao carrinho! 🛒",
        description: `${title} foi adicionado ao seu carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar ao carrinho",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true);
      
      // Atualiza estado local IMEDIATAMENTE para feedback visual instantâneo
      const newFavoriteStatus = !isBookFavorite;
      setIsBookFavorite(newFavoriteStatus);
      
      // Depois faz a chamada async
      const confirmedStatus = await toggleFavorite(id);
      
      // Se houver discrepância, corrige
      if (confirmedStatus !== newFavoriteStatus) {
        setIsBookFavorite(confirmedStatus);
      }
      
      toast({
        title: confirmedStatus ? "Adicionado aos favoritos! 💖" : "Removido dos favoritos",
        description: confirmedStatus 
          ? `${title} foi adicionado aos seus favoritos.`
          : `${title} foi removido dos seus favoritos.`,
      });
    } catch (error) {
      // Reverte em caso de erro
      setIsBookFavorite(!isBookFavorite);
      toast({
        title: "Erro",
        description: "Erro ao atualizar favoritos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 border-border bg-card">
      <div className="relative overflow-hidden aspect-[3/4] bg-secondary">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="secondary"
          className={`absolute top-3 right-3 transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground ${
            isBookFavorite 
              ? "!opacity-100 !bg-red-500/20 !text-red-500" 
              : "opacity-0 group-hover:opacity-100"
          }`}
          onClick={handleToggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-4 w-4 ${isBookFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {condition}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-serif font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">{author}</p>
        <p className="text-xs text-muted-foreground">{publisher}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              R$ {price.toFixed(2)}
            </span>
          </div>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          size="icon" 
          className="bg-accent hover:bg-accent/90 relative"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;