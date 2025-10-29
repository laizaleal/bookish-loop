import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BarChart3, Package, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Admin = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: Package,
      label: "Gestão de Estoque",
      path: "/admin/inventory",
    },
    {
      icon: BarChart3,
      label: "Relatórios de Vendas",
      path: "/admin/reports",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Área Administrativa</h1>
            <p className="text-muted-foreground">
              Gerencie seu estoque e acompanhe as vendas
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2 animate-slide-up">
            <nav className="bg-card rounded-lg border border-border p-4 shadow-soft">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.path && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
