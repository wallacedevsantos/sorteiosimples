
import { useState } from "react";
import confetti from "canvas-confetti";
import { Dice1, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const NumberRaffle = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());

  const generateNumbers = () => {
    if (min > max) {
      alert("O número mínimo deve ser menor que o máximo!");
      return;
    }

    const range = max - min + 1;
    if (avoidDuplicates && quantity > range) {
      alert("Quantidade solicitada é maior que o intervalo disponível!");
      return;
    }

    setIsAnimating(true);
    setShowResults(true);

    // Simula animação de sorteio
    setTimeout(() => {
      const newResults: number[] = [];
      const availableNumbers = avoidDuplicates 
        ? Array.from({length: range}, (_, i) => min + i).filter(n => !usedNumbers.has(n))
        : Array.from({length: range}, (_, i) => min + i);

      for (let i = 0; i < quantity; i++) {
        if (avoidDuplicates && availableNumbers.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers[randomIndex];
        newResults.push(selectedNumber);
        
        if (avoidDuplicates) {
          availableNumbers.splice(randomIndex, 1);
        }
      }

      setResults(newResults);
      
      if (avoidDuplicates) {
        setUsedNumbers(prev => new Set([...prev, ...newResults]));
      }
      
      setIsAnimating(false);

      // Confetes!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2000);
  };

  const resetRaffle = () => {
    setResults([]);
    setUsedNumbers(new Set());
    setShowResults(false);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(", "));
    alert("Resultado copiado!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="text-center mb-8">
          <Dice1 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-wiggle" />
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Sorteio de Números</h2>
          <p className="text-blue-600">Configure os parâmetros e boa sorte!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label htmlFor="min" className="text-blue-700 font-medium">Número Mínimo</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="mt-2 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="max" className="text-blue-700 font-medium">Número Máximo</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-2 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="text-blue-700 font-medium">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-8">
          <Checkbox
            id="avoid-duplicates"
            checked={avoidDuplicates}
            onCheckedChange={(checked) => setAvoidDuplicates(checked as boolean)}
          />
          <Label htmlFor="avoid-duplicates" className="text-blue-700">
            Evitar repetições
          </Label>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={generateNumbers}
            disabled={isAnimating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-bold"
          >
            {isAnimating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Sorteando...
              </>
            ) : (
              <>
                <Dice1 className="w-5 h-5 mr-2" />
                Sortear Agora!
              </>
            )}
          </Button>

          {results.length > 0 && (
            <Button
              onClick={resetRaffle}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
          )}
        </div>
      </Card>

      {/* Modal de Resultado */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-blue-800">
              🎉 Resultado do Sorteio! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            {isAnimating ? (
              <div className="space-y-4">
                <div className="text-6xl font-black animate-number-roll text-blue-600">
                  {Math.floor(Math.random() * (max - min + 1)) + min}
                </div>
                <p className="text-lg text-gray-600">Sorteando...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-blue-600 mb-4 animate-flip">
                    {results.join(" • ")}
                  </div>
                  <p className="text-lg text-gray-600 mb-6">
                    {quantity === 1 ? "Número sorteado:" : "Números sorteados:"}
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={copyResults}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  
                  <Button
                    onClick={() => setShowResults(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NumberRaffle;
