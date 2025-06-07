
import { useState } from "react";
import { Dice1, List, Home, Trophy, Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NumberRaffle from "@/components/NumberRaffle";
import ListRaffle from "@/components/ListRaffle";

type RaffleMode = "home" | "number" | "list";

const Index = () => {
  const [mode, setMode] = useState<RaffleMode>("home");

  const renderHome = () => (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sorteio Show
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>Feito com</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>por você</span>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Código</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-4xl w-full">
          <div className="animate-bounce-slow mb-12">
            <Trophy className="w-32 h-32 mx-auto text-yellow-500 mb-6" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-fast">
            Bem-vindo ao Show!
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-16 font-medium">
            🎉 Vamos descobrir quem teve sorte hoje? 🎉
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            <Card 
              className="p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl"
              onClick={() => setMode("number")}
            >
              <div className="text-center">
                <Dice1 className="w-20 h-20 mx-auto mb-6 text-blue-600 animate-wiggle" />
                <h3 className="text-2xl font-bold text-blue-800 mb-3">Sortear Números</h3>
                <p className="text-blue-600 font-medium">Escolha um intervalo e descubra o número da sorte!</p>
              </div>
            </Card>
            
            <Card 
              className="p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl"
              onClick={() => setMode("list")}
            >
              <div className="text-center">
                <List className="w-20 h-20 mx-auto mb-6 text-green-600 animate-wiggle" />
                <h3 className="text-2xl font-bold text-green-800 mb-3">Sortear Lista</h3>
                <p className="text-green-600 font-medium">Cole nomes ou itens e descubra o(s) sorteado(s)!</p>
              </div>
            </Card>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/80 px-8 py-4 rounded-full shadow-lg">
            <span className="text-gray-600 font-medium text-lg">✨ Simples, rápido e divertido! ✨</span>
          </div>
        </div>
      </main>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white/90 shadow-lg sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setMode("home")}
          className="flex items-center gap-2 text-lg font-bold hover:scale-105 transition-transform"
        >
          <Home className="w-6 h-6" />
          Sorteio Show
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant={mode === "number" ? "default" : "outline"}
            onClick={() => setMode("number")}
            className="flex items-center gap-2"
          >
            <Dice1 className="w-5 h-5" />
            Números
          </Button>
          <Button
            variant={mode === "list" ? "default" : "outline"}
            onClick={() => setMode("list")}
            className="flex items-center gap-2"
          >
            <List className="w-5 h-5" />
            Lista
          </Button>
        </div>
      </div>
    </div>
  );

  if (mode === "home") {
    return renderHome();
  }

  return (
    <div className="min-h-screen">
      {renderHeader()}
      <div className="container mx-auto px-4 py-12">
        {mode === "number" && <NumberRaffle />}
        {mode === "list" && <ListRaffle />}
      </div>
    </div>
  );
};

export default Index;
