// src/components/BookCard.tsx
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
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(); // JÁ ESTÁ CORRETO
  const { toast } = useToast();
  const [isBookFavorite, setIsBookFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o livro é favorito ao carregar o componente
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorite = await isFavorite(id);
        setIsBookFavorite(favorite);
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      }
    };

    checkFavoriteStatus();
  }, [id, isFavorite]);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addToCart(id, 1);
      toast({
        title: "Adicionado ao carrinho!",
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
      const newFavoriteStatus = await toggleFavorite(id);
      setIsBookFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? "Adicionado aos favoritos! 💖" : "Removido dos favoritos",
        description: newFavoriteStatus 
          ? `${title} foi adicionado aos seus favoritos.`
          : `${title} foi removido dos seus favoritos.`,
      });
    } catch (error) {
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
          className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-card/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground ${
            isBookFavorite ? "!opacity-100 !bg-red-500/20 !text-red-500" : ""
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
          className="bg-accent hover:bg-accent/90"
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