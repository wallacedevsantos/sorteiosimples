
import { useState } from "react";
import { Dice1, List, Home, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NumberRaffle from "@/components/NumberRaffle";
import ListRaffle from "@/components/ListRaffle";

type RaffleMode = "home" | "number" | "list";

const Index = () => {
  const [mode, setMode] = useState<RaffleMode>("home");

  const renderHome = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-4xl w-full">
        <div className="animate-bounce-slow mb-8">
          <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-fast">
          Sorteio Show
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 font-medium">
          🎉 Vamos descobrir quem teve sorte? 🎉
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card 
            className="p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl"
            onClick={() => setMode("number")}
          >
            <div className="text-center">
              <Dice1 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-wiggle" />
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Sortear Números</h3>
              <p className="text-blue-600 font-medium">Escolha um intervalo e descubra o número da sorte!</p>
            </div>
          </Card>
          
          <Card 
            className="p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl"
            onClick={() => setMode("list")}
          >
            <div className="text-center">
              <List className="w-16 h-16 mx-auto mb-4 text-green-600 animate-wiggle" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Sortear Lista</h3>
              <p className="text-green-600 font-medium">Cole nomes ou itens e descubra o(s) sorteado(s)!</p>
            </div>
          </Card>
        </div>
        
        <div className="mt-12">
          <div className="inline-flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full shadow-lg">
            <span className="text-gray-600 font-medium">✨ Simples, rápido e divertido! ✨</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="bg-white/90 shadow-lg sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setMode("home")}
          className="flex items-center gap-2 text-lg font-bold hover:scale-105 transition-transform"
        >
          <Home className="w-6 h-6" />
          Sorteio Show
        </Button>
        
        <div className="flex gap-2">
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
      <div className="container mx-auto px-4 py-8">
        {mode === "number" && <NumberRaffle />}
        {mode === "list" && <ListRaffle />}
      </div>
    </div>
  );
};

export default Index;
