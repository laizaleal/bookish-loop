// src/hooks/useAnchorNavigation.ts
import { useNavigate, useLocation } from "react-router-dom";

export const useAnchorNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Remove o # do ID
    const id = sectionId.replace('#', '');
    const element = document.getElementById(id);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleAnchorClick = (sectionId: string) => {
    // Se já estamos na página inicial
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      // Se estamos em outra página, navega para a inicial e depois faz scroll
      navigate('/');
      // Usamos setTimeout para garantir que a página carregou antes do scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  return { handleAnchorClick };
};