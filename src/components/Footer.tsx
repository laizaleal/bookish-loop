import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const handleDevelopmentAlert = (pageName: string) => {
    toast.info(`${pageName} em desenvolvimento`);
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">ReBook</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Promovendo a sustentabilidade através da circulação de livros usados de qualidade.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleDevelopmentAlert("Facebook")}
                className="p-2 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDevelopmentAlert("Instagram")}
                className="p-2 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDevelopmentAlert("Twitter")}
                className="p-2 bg-secondary rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Sobre Nós")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Como Funciona")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Sustentabilidade")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Sustentabilidade
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Perguntas Frequentes")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Perguntas Frequentes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Frete e Entrega")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Frete e Entrega
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Trocas e Devoluções")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Trocas e Devoluções
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleDevelopmentAlert("Contato")}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Rua dos Livros, 123<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contato@rebook.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ReBook. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <button 
              onClick={() => handleDevelopmentAlert("Política de Privacidade")}
              className="hover:text-primary transition-colors"
            >
              Política de Privacidade
            </button>
            <span>•</span>
            <button 
              onClick={() => handleDevelopmentAlert("Termos de Uso")}
              className="hover:text-primary transition-colors"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;