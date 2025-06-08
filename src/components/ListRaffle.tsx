
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { List, RotateCcw, Copy, Upload } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

const ListRaffle = () => {
  const [itemsList, setItemsList] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [avoidRepeats, setAvoidRepeats] = useState(true);
  const [isRaffling, setIsRaffling] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>("");
  const [history, setHistory] = useState<{ items: string[]; results: string[]; timestamp: Date }[]>([]);
  const [hideSensitiveData, setHideSensitiveData] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6']
    });
  };

  const getItems = () => {
    return itemsList
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const maskSensitiveData = (data: string) => {
    if (!hideSensitiveData) return data;

    const originalChars = data.split('');
    const maskableChars: { char: string; index: number }[] = [];
    const nonMaskableChars: { char: string; index: number }[] = [];

    for (let i = 0; i < originalChars.length; i++) {
      const char = originalChars[i];
      if (/[a-zA-Z0-9]/.test(char)) {
        maskableChars.push({ char, index: i });
      } else {
        nonMaskableChars.push({ char, index: i });
      }
    }

    const len = maskableChars.length;
    let maskedMaskableData = '';

    if (len < 7) {
      if (len <= 4) {
        maskedMaskableData = 'X'.repeat(len);
      } else {
        const maskedPartLen = len - 4;
        maskedMaskableData = maskableChars.slice(0, 2).map(c => c.char).join('') +
                             'X'.repeat(maskedPartLen) +
                             maskableChars.slice(len - 2).map(c => c.char).join('');
      }
    } else if (len < 10) {
      const maskedPartLen = len - 5;
      maskedMaskableData = maskableChars.slice(0, 3).map(c => c.char).join('') +
                           'X'.repeat(maskedPartLen) +
                           maskableChars.slice(len - 2).map(c => c.char).join('');
    } else {
      const maskedPartLen = len - 7;
      maskedMaskableData = maskableChars.slice(0, 5).map(c => c.char).join('') +
                           'X'.repeat(maskedPartLen) +
                           maskableChars.slice(len - 2).map(c => c.char).join('');
    }

    const resultChars: string[] = Array(originalChars.length).fill('');
    let maskedIndex = 0;

    for (let i = 0; i < originalChars.length; i++) {
      const char = originalChars[i];
      if (/[a-zA-Z0-9]/.test(char)) {
        resultChars[i] = maskedMaskableData[maskedIndex];
        maskedIndex++;
      } else {
        resultChars[i] = char;
      }
    }

    return resultChars.join('');
  };

  const performRaffle = async () => {
    const items = getItems();
    const qty = parseInt(quantity);

    if (items.length === 0) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, adicione pelo menos um item na lista.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(qty) || qty < 1) {
      toast({
        title: "Ops! 🤔",
        description: "Por favor, informe quantos itens sortear (mínimo 1).",
        variant: "destructive"
      });
      return;
    }

    if (avoidRepeats && qty > items.length) {
      toast({
        title: "Ops! 🤔",
        description: "Não há itens suficientes na lista para evitar repetições.",
        variant: "destructive"
      });
      return;
    }

    setIsRaffling(true);
    setResults([]);
    setShowModal(true);

    // Animação de suspense com nomes girando
    const animationItems = [...items];
    for (let i = 0; i < 20; i++) {
      const randomItem = animationItems[Math.floor(Math.random() * animationItems.length)];
      const maskedItem = maskSensitiveData(randomItem);
      setCurrentAnimation(maskedItem);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    let raffleResults: string[] = [];
    let availableItems = [...items];

    for (let i = 0; i < qty; i++) {
      if (avoidRepeats) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        raffleResults.push(availableItems[randomIndex]);
        availableItems.splice(randomIndex, 1);
      } else {
        const randomIndex = Math.floor(Math.random() * items.length);
        raffleResults.push(items[randomIndex]);
      }
    }

    setResults(raffleResults);
    setHistory(prev => [...prev, { items: [...items], results: raffleResults, timestamp: new Date() }]);
    setCurrentAnimation("");
    setIsRaffling(false);
    triggerConfetti();
    
    toast({
      title: "🎉 Resultado revelado!",
      description: `Sorteado(s): ${raffleResults.join(', ')}`
    });
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join('\n'));
    toast({
      title: "📋 Copiado!",
      description: "Resultado copiado para a área de transferência."
    });
  };

  const resetRaffle = () => {
    setResults([]);
    setIsRaffling(false);
    setCurrentAnimation("");
    setShowModal(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').map(line => line.split(',')[0].trim()).filter(Boolean);
          setItemsList(lines.join('\n'));
        } else {
          setItemsList(content);
        }
        toast({
          title: "📁 Arquivo carregado!",
          description: `${file.name} foi importado com sucesso.`
        });
        setFileName(file.name);
        setHideSensitiveData(true);
      };
      reader.readAsText(file);

      // Limpa o valor do input para permitir o carregamento do mesmo arquivo novamente
      event.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setItemsList("");
    setFileName(null);
    toast({
      title: "🗑️ Arquivo removido!",
      description: "A lista de itens foi limpa e o campo de texto está disponível novamente."
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-green-800 mb-2">Sorteio de Lista</h2>
        <p className="text-lg text-gray-600">Cole a lista abaixo e boa sorte! 🍀</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="p-6 mb-8 lg:mb-0 lg:flex-1">
          <h3 className="text-2xl font-bold mb-6 text-center">📝 Lista de Itens</h3>
          
          <div className="space-y-6">
            {fileName ? (
              <div className="border-2 border-dashed border-green-400 rounded-lg p-4 text-center bg-green-50">
                <p className="text-lg font-semibold text-green-700 mb-2">Arquivo Carregado:</p>
                <p className="text-md text-gray-800">{fileName}</p>
                <Button
                  onClick={handleRemoveFile}
                  variant="outline"
                  className="mt-4 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Remover Arquivo
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="items">Itens (um por linha)</Label>
                  <Textarea
                    id="items"
                    placeholder={`João Silva\nMaria Santos\nPedro Oliveira\nOu cole sua lista aqui...`}
                    value={itemsList}
                    onChange={(e) => setItemsList(e.target.value)}
                    className="min-h-[150px] text-base"
                    disabled={!!fileName}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Total de itens: {getItems().length}
                  </p>
                  <div className="flex items-center p-2 text-yellow-800 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800" role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="ml-3 text-sm font-medium">
                      Evite inserir dados sensíveis (CPF, telefone, etc.) diretamente. Para isso, use a opção de carregar arquivo.
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Clique para carregar arquivo (.txt, .csv)
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="quantity">Quantos itens sortear?</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="avoid-repeats"
                checked={avoidRepeats}
                onCheckedChange={(checked) => setAvoidRepeats(checked as boolean)}
              />
              <Label htmlFor="avoid-repeats" className="text-sm font-medium">
                Evitar repetições
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-sensitive-data"
                checked={hideSensitiveData}
                onCheckedChange={(checked) => setHideSensitiveData(checked as boolean)}
              />
              <Label htmlFor="hide-sensitive-data" className="text-sm font-medium">
                Ocultar dados sensíveis
              </Label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recomendado para listas com dados sensíveis (CPF, telefone, etc.) ao carregar um arquivo.
            </p>

            <Button
              onClick={performRaffle}
               disabled={isRaffling || getItems().length === 0}
              className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
            >
              {isRaffling ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Sorteando...
                </>
              ) : (
                <>
                  <List className="w-6 h-6 mr-2" />
                  Sortear Agora!
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Histórico */}
        <Card className="p-6 lg:flex-1">
          <h3 className="text-xl font-bold mb-4">📚 Histórico (Sessão Atual)</h3>
          {history.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.slice(-10).reverse().map((entry, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-600">
                      Lista com {entry.items.length} item(s)
                    </span>
                    <span className="text-xs text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-bold text-green-600">
                    Resultado: {entry.results.map(maskSensitiveData).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum sorteio realizado ainda.</p>
          )}
        </Card>
      </div>

      {/* Modal de Resultado */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-800">
              🎯 Resultado do Sorteio
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRaffling ? "Girando a roleta..." : "Parabéns! Aqui está o resultado:"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-6">
            {isRaffling ? (
              <div>
                <div className="text-2xl font-bold text-green-600 animate-bounce mb-4 h-8">
                  {currentAnimation}
                </div>
                <p className="text-lg text-gray-600 animate-pulse">
                  Girando a roleta... 🎰
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="animate-flip">
                <div className="space-y-3 mb-6">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-lg animate-bounce-slow"
                    >
                      🏆 {maskSensitiveData(item)}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={copyResults}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                  
                  <Button
                    onClick={resetRaffle}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Novo Sorteio
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListRaffle;
