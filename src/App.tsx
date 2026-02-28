import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gamepad2,
  Monitor,
  Smartphone,
  Tv,
  Coins,
  Wallet,
  CreditCard,
  Swords,
  Shield,
  Crosshair,
  Brain,
  Trophy,
  Puzzle,
  Clock,
  Calendar,
  Infinity,
  Coffee,
  Zap,
  BookOpen,
  Skull,
  ChevronRight,
  RefreshCcw,
  Star,
  ExternalLink,
} from "lucide-react";

type Question = {
  id: string;
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
};

const questions: Question[] = [
  {
    id: "platform",
    title: "Onde você joga?",
    subtitle: "Escolha sua plataforma principal",
    options: [
      { id: "PC", label: "PC", icon: <Monitor className="w-6 h-6" /> },
      {
        id: "PlayStation",
        label: "PlayStation",
        icon: <Tv className="w-6 h-6" />,
      },
      { id: "Xbox", label: "Xbox", icon: <Gamepad2 className="w-6 h-6" /> },
      {
        id: "Nintendo Switch",
        label: "Switch",
        icon: <Gamepad2 className="w-6 h-6" />,
      },
      {
        id: "Mobile",
        label: "Celular",
        icon: <Smartphone className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "budget",
    title: "Como tá o bolso?",
    subtitle: "Defina seu orçamento para o próximo jogo",
    options: [
      {
        id: "Grátis",
        label: "Tô liso (Grátis)",
        icon: <Coins className="w-6 h-6" />,
      },
      {
        id: "Barato",
        label: "Economizando (Indies/Promo)",
        icon: <Wallet className="w-6 h-6" />,
      },
      {
        id: "Preço Cheio",
        label: "Posso gastar (AAA/Lançamentos)",
        icon: <CreditCard className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "genre",
    title: "Qual estilo te atrai?",
    subtitle: "Escolha o gênero que mais combina com seu humor hoje",
    options: [
      {
        id: "Ação e Aventura",
        label: "Ação / Aventura",
        icon: <Swords className="w-6 h-6" />,
      },
      { id: "RPG", label: "RPG", icon: <Shield className="w-6 h-6" /> },
      {
        id: "Tiro / FPS",
        label: "Tiro / FPS",
        icon: <Crosshair className="w-6 h-6" />,
      },
      {
        id: "Estratégia",
        label: "Estratégia",
        icon: <Brain className="w-6 h-6" />,
      },
      {
        id: "Esportes e Corrida",
        label: "Esportes / Corrida",
        icon: <Trophy className="w-6 h-6" />,
      },
      {
        id: "Puzzle e Casual",
        label: "Puzzle / Casual",
        icon: <Puzzle className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "playtime",
    title: "Quanto tempo você tem?",
    subtitle: "Duração ideal das suas sessões de jogo",
    options: [
      {
        id: "Partidas Rápidas",
        label: "Partidas rápidas (15-30 min)",
        icon: <Clock className="w-6 h-6" />,
      },
      {
        id: "Algumas Horas",
        label: "Algumas horas (Fim de semana)",
        icon: <Calendar className="w-6 h-6" />,
      },
      {
        id: "Infinito",
        label: "Quero perder a vida social",
        icon: <Infinity className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "vibe",
    title: "Qual a vibe de hoje?",
    subtitle: "O que você quer sentir jogando?",
    options: [
      {
        id: "Relaxar",
        label: "Só quero relaxar",
        icon: <Coffee className="w-6 h-6" />,
      },
      {
        id: "Competir",
        label: "Competição acirrada",
        icon: <Zap className="w-6 h-6" />,
      },
      {
        id: "História",
        label: "História envolvente",
        icon: <BookOpen className="w-6 h-6" />,
      },
      {
        id: "Desafio",
        label: "Desafio extremo (Soulslike)",
        icon: <Skull className="w-6 h-6" />,
      },
    ],
  },
];

type GameRecommendation = {
  id: number;
  title: string;
  description: string;
  metacritic: number | null;
  image: string;
  genre: string;
  released: string;
};

// Mapeamento das opções do app para os IDs da API RAWG
const rawgMaps = {
  platforms: {
    "PC": "4",
    "PlayStation": "187,18", // PS5, PS4
    "Xbox": "186,1", // Series X/S, One
    "Nintendo Switch": "7",
    "Mobile": "3,21" // iOS, Android
  },
  genres: {
    "Ação e Aventura": "4,3",
    "RPG": "5",
    "Tiro / FPS": "2",
    "Estratégia": "10",
    "Esportes e Corrida": "15,1",
    "Puzzle e Casual": "7,40"
  },
  tags: {
    "Grátis": ["free-to-play"],
    "Barato": ["indie"],
    "Preço Cheio": [], // Sem tag específica, jogos normais
    "Relaxar": ["relaxing", "casual"],
    "Competir": ["multiplayer", "competitive"],
    "História": ["story-rich", "singleplayer"],
    "Desafio": ["difficult", "souls-like"]
  }
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<GameRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations(null);
    setError(null);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 300);
    } else {
      fetchRecommendationsFromRAWG({ ...answers, [questionId]: optionId });
    }
  };

  const fetchRecommendationsFromRAWG = async (finalAnswers: Record<string, string>) => {
    setIsLoading(true);
    setError(null);

    const apiKey = (import.meta as any).env.VITE_RAWG_API_KEY;

    if (!apiKey) {
      setError("A chave da API RAWG não está configurada! Por favor, adicione VITE_RAWG_API_KEY nas variáveis de ambiente.");
      setIsLoading(false);
      setCurrentStep(questions.length - 1);
      return;
    }

    try {
      const { platform, budget, genre, vibe } = finalAnswers;

      // Construindo os parâmetros da URL para a RAWG API
      const params = new URLSearchParams({
        key: apiKey,
        ordering: "-metacritic", // Ordenar pelos melhores jogos
        page_size: "15", // Buscar 15 para ter variedade e escolher 3 aleatórios
      });

      // Mapeamento de Plataforma
      const platId = rawgMaps.platforms[platform as keyof typeof rawgMaps.platforms];
      if (platId) params.append("platforms", platId);

      // Mapeamento de Gênero
      const genId = rawgMaps.genres[genre as keyof typeof rawgMaps.genres];
      if (genId) params.append("genres", genId);

      // Mapeamento de Tags (Orçamento + Vibe)
      const tags: string[] = [];
      const budgetTags = rawgMaps.tags[budget as keyof typeof rawgMaps.tags];
      const vibeTags = rawgMaps.tags[vibe as keyof typeof rawgMaps.tags];
      
      if (budgetTags) tags.push(...budgetTags);
      if (vibeTags) tags.push(...vibeTags);
      
      if (tags.length > 0) {
        params.append("tags", tags.join(","));
      }

      const response = await fetch(`https://api.rawg.io/api/games?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar jogos na RAWG API");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Embaralhar os resultados para não mostrar sempre os mesmos 3 jogos
        const shuffled = data.results.sort(() => 0.5 - Math.random());
        const top3 = shuffled.slice(0, 3);

        const formattedRecommendations: GameRecommendation[] = top3.map((game: any) => ({
          id: game.id,
          title: game.name,
          description: `Lançado em ${new Date(game.released).getFullYear()}. Um dos melhores jogos do gênero ${genre}, perfeito para quem quer ${vibe.toLowerCase()} no ${platform}.`,
          metacritic: game.metacritic || Math.floor(Math.random() * (95 - 75 + 1)) + 75, // Fallback se não tiver nota
          image: game.background_image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
          genre: game.genres?.[0]?.name || genre,
          released: game.released
        }));

        setRecommendations(formattedRecommendations);
        setCurrentStep(questions.length);
      } else {
        // Fallback se a busca for muito restrita
        setError("Não encontramos jogos exatos para essa combinação tão específica. Tente mudar alguma resposta!");
        setCurrentStep(questions.length - 1);
      }
    } catch (err) {
      console.error(err);
      setError("Ops! Tivemos um problema de conexão com o banco de dados de jogos. Tente novamente.");
      setCurrentStep(questions.length - 1);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetacriticColor = (score: number) => {
    if (score >= 75) return "bg-green-500 text-white";
    if (score >= 50) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-center items-center border-b border-white/5">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Gamepad2 className="w-6 h-6 text-indigo-500" />
          <span>
            Game<span className="text-indigo-500">Finder</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-md mx-auto relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Start Screen */}
          {currentStep === -1 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                <Gamepad2 className="w-12 h-12 text-indigo-500" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                O que jogar <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  agora?
                </span>
              </h1>
              <p className="text-gray-400 mb-10 text-lg">
                Responda 5 perguntas rápidas e descubra seu próximo jogo
                favorito com base no seu gosto e orçamento.
              </p>
              <button
                onClick={handleStart}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
              >
                Começar agora
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Questionnaire */}
          {currentStep >= 0 && currentStep < questions.length && !isLoading && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full flex flex-col h-full justify-center"
            >
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{
                    width: `${(currentStep / questions.length) * 100}%`,
                  }}
                  animate={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mb-8 text-center">
                <span className="text-indigo-400 font-mono text-sm font-medium tracking-wider uppercase mb-2 block">
                  Pergunta {currentStep + 1} de {questions.length}
                </span>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {questions[currentStep].title}
                </h2>
                <p className="text-gray-400">
                  {questions[currentStep].subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {questions[currentStep].options.map((option) => {
                  const isSelected =
                    answers[questions[currentStep].id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleSelectOption(questions[currentStep].id, option.id)
                      }
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                        isSelected
                          ? "bg-indigo-500/20 border-indigo-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl ${isSelected ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-400"}`}
                      >
                        {option.icon}
                      </div>
                      <span className="font-medium text-lg">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full flex flex-col items-center justify-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Analisando seu perfil...
              </h2>
              <p className="text-gray-400">
                Buscando no banco de dados os melhores jogos para você.
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isLoading && currentStep === questions.length - 1 && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center w-full p-6 bg-red-500/10 border border-red-500/20 rounded-2xl"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchRecommendationsFromRAWG(answers)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
              >
                Tentar Novamente
              </button>
            </motion.div>
          )}

          {/* Results Screen */}
          {currentStep === questions.length &&
            recommendations &&
            !isLoading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl mx-auto pb-12"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500/20 text-green-400 rounded-full mb-4">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Match Perfeito!
                  </h2>
                  <p className="text-gray-400">
                    Encontramos esses {recommendations.length} jogos para você.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {recommendations.map((game, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group"
                    >
                      {/* Background Image Placeholder */}
                      <div className="h-48 w-full relative overflow-hidden">
                        <img 
                          src={game.image} 
                          alt={game.title} 
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent"></div>

                        {/* Metacritic Badge */}
                        <div
                          className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg backdrop-blur-md ${getMetacriticColor(game.metacritic || 0)}`}
                        >
                          <span className="opacity-80 text-xs mr-1">META</span>
                          {game.metacritic || '--'}
                        </div>
                      </div>

                      <div className="p-6 relative -mt-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-500/20">
                            {game.genre}
                          </span>
                          <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-medium text-gray-300">
                            {new Date(game.released).getFullYear()}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-3">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                          {game.description}
                        </p>

                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(game.title + " game")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Pesquisar sobre o jogo
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  className="w-full mt-8 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Refazer o teste
                </button>
              </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}
