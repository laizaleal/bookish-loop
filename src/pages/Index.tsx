// src/pages/Index.tsx
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Leaf, BookOpen, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { useFeaturedBooks } from "@/hooks/useFeaturedBooks";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { authEvents } from "@/utils/authEvents";

import heroImage from "@/assets/fundo-hero.png";

const Index = () => {
  const { featuredBooks, loading, error } = useFeaturedBooks();
  const { handleAnchorClick } = useAnchorNavigation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Estado para forçar re-render
  const [renderKey, setRenderKey] = useState(0);

  // Escutar eventos de autenticação
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(() => {
      console.log('🔐 Evento de autenticação recebido, forçando re-render');
      setRenderKey(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  console.log('🎯 Estado atual:', { 
    featuredBooks, 
    loading, 
    error, 
    isAuthenticated, 
    user,
    authLoading,
    renderKey
  });

  const handleComoFuncionaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleAnchorClick('#como-funciona');
  };

  // Se ainda está carregando a autenticação, mostra um loading sutil
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" key={renderKey}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-background/40 to-transparent z-10" />
        <img
          src={heroImage}
          alt="Livros vintage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Dê nova vida aos
              <span className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight"> livros</span>
            </h1>
            <p className="text-xl text-muted-foreground text-white mb-8">
              Encontre obras incríveis em ótimo estado e contribua para um futuro mais sustentável através da economia circular.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <button onClick={handleComoFuncionaClick}>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-card/50 backdrop-blur-sm">
                  Como Funciona
                </Button>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Por que escolher a ReBook?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mais do que uma loja, somos uma comunidade apaixonada por literatura e sustentabilidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sustentável",
                description: "Reduza o desperdício e promova a economia circular",
              },
              {
                icon: BookOpen,
                title: "Qualidade",
                description: "Todos os livros são cuidadosamente selecionados",
              },
              {
                icon: Users,
                title: "Comunidade",
                description: "Conecte-se com outros amantes da leitura",
              },
              {
                icon: TrendingUp,
                title: "Preços Justos",
                description: "Economia de até 60% em relação aos novos",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-xl shadow-soft hover:shadow-hover transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Como Funciona?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprar livros usados nunca foi tão fácil e seguro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                title: "Encontre seu Livro",
                description: "Navegue pelo nosso catálogo com milhares de títulos organizados por categoria, autor e editora.",
              },
              {
                step: "2",
                title: "Adicione ao Carrinho",
                description: "Escolha os livros desejados, verifique o estado de conservação e finalize sua compra com segurança.",
              },
              {
                step: "3",
                title: "Receba em Casa",
                description: "Seus livros são embalados com cuidado e enviados rapidamente para o conforto da sua casa.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative text-center p-8 bg-card rounded-xl shadow-soft hover:shadow-hover transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <h3 className="font-serif font-semibold text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 animate-fade-in">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Destaques da Semana
              </h2>
              <p className="text-muted-foreground">
                Obras selecionadas especialmente para você
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="hidden sm:flex">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Erro ao carregar livros: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando livros em destaque...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
                {featuredBooks.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>

              {featuredBooks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum livro em destaque disponível no momento.</p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/catalog">
              <Button variant="outline" className="w-full">
                Ver Todos os Livros
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - ATUALIZADA */}
      {!isAuthenticated ? (
        <section className="py-20 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Pronto para começar sua jornada literária sustentável?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Crie sua conta e ganhe 10% de desconto na primeira compra
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8">
                  Criar Conta Grátis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Bem-vindo de volta, {user?.name || 'leitor'}!
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Continue explorando nossa coleção de livros incríveis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalog">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                    Continuar Comprando
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Meu Perfil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;