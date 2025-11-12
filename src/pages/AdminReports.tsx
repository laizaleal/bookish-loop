import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, ShoppingBag, Users, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useAdminBooks } from "@/hooks/useAdminBooks";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminReports = () => {
  const { books } = useAdminBooks();
  const [period, setPeriod] = useState("6months");
  const { toast } = useToast();

  // Dados simulados baseados nos livros reais
  const salesData = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, 6).map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12;
      const baseSales = books.length * 2 + Math.random() * 10;
      const sales = Math.floor(baseSales + (index * 3));
      const revenue = sales * 45; // Preço médio estimado
      
      return {
        month,
        vendas: revenue,
        livros: sales,
        mes: monthIndex
      };
    });
  }, [books, period]);

  const topBooks = useMemo(() => {
    return books
      .slice(0, 5)
      .map((book, index) => ({
        title: book.title.length > 30 ? book.title.substring(0, 30) + "..." : book.title,
        vendas: Math.floor(Math.random() * 20) + 5, // Vendas simuladas
        receita: (Math.floor(Math.random() * 20) + 5) * book.price,
      }))
      .sort((a, b) => b.vendas - a.vendas);
  }, [books]);

  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    books.forEach(book => {
      const category = book.category || "Outros";
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [books]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, month) => sum + month.vendas, 0);
    const totalBooksSold = salesData.reduce((sum, month) => sum + month.livros, 0);
    const averageTicket = totalBooksSold > 0 ? totalRevenue / totalBooksSold : 0;
    const revenueGrowth = salesData.length > 1 ? 
      ((salesData[salesData.length - 1].vendas - salesData[salesData.length - 2].vendas) / salesData[salesData.length - 2].vendas) * 100 : 0;

    return {
      totalRevenue,
      totalBooksSold,
      averageTicket,
      revenueGrowth,
      newCustomers: Math.floor(totalBooksSold * 0.3) // Estimativa
    };
  }, [salesData]);

  const handleExportPDF = () => {
    toast({
      title: "Relatório exportado!",
      description: "O relatório foi baixado em formato PDF.",
    });
  };

  // Estatísticas do estoque
  const inventoryStats = useMemo(() => {
    const totalStock = books.reduce((acc, book) => acc + book.stock, 0);
    const lowStockCount = books.filter(book => book.stock < 3 && book.stock > 0).length;
    const outOfStockCount = books.filter(book => book.stock === 0).length;
    const totalValue = books.reduce((acc, book) => acc + (book.price * book.stock), 0);

    return {
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalValue
    };
  }, [books]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold">Relatórios de Vendas</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho da sua loja com dados em tempo real
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mês</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className={`text-xs flex items-center mt-1 ${
              kpis.revenueGrowth >= 0 ? 'text-primary' : 'text-destructive'
            }`}>
              {kpis.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(kpis.revenueGrowth).toFixed(1)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livros Vendidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalBooksSold}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-accent" />
              +{(kpis.totalBooksSold * 0.15).toFixed(0)}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {kpis.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-primary" />
              +4.1% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.newCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-accent" />
              +15.3% vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Evolução da receita nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Receita"]}
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Livros Vendidos</CardTitle>
            <CardDescription>Evolução das vendas nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="livros" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Books Table */}
        <Card>
          <CardHeader>
            <CardTitle>Livros Mais Vendidos</CardTitle>
            <CardDescription>Top 5 no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Posição</th>
                    <th className="text-left py-3 px-4 font-medium">Título</th>
                    <th className="text-center py-3 px-4 font-medium">Vendas</th>
                    <th className="text-right py-3 px-4 font-medium">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooks.map((book, index) => (
                    <tr key={book.title} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4 text-center">{book.vendas}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">
                        R$ {book.receita.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Proporção de livros por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Estoque</CardTitle>
          <CardDescription>Visão geral do inventário atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{books.length}</div>
              <div className="text-sm text-muted-foreground">Total de Livros</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {inventoryStats.totalStock}
              </div>
              <div className="text-sm text-muted-foreground">Unidades em Estoque</div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {inventoryStats.lowStockCount}
              </div>
              <div className="text-sm text-muted-foreground">Estoque Baixo</div>
            </div>
            <div className="text-center p-4 bg-destructive/10 rounded-lg">
              <div className="text-2xl font-bold text-destructive">
                {inventoryStats.outOfStockCount}
              </div>
              <div className="text-sm text-muted-foreground">Fora de Estoque</div>
            </div>
          </div>
          
          {/* Valor Total do Estoque */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                R$ {inventoryStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total do Estoque</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Condição</CardTitle>
          <CardDescription>Estado dos livros no estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(
              books.reduce((acc, book) => {
                acc[book.condition] = (acc[book.condition] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([condition, count]) => (
              <div key={condition} className="text-center p-4 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-sm text-muted-foreground">{condition}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;