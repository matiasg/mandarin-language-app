import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import charactersData from '@/assets/characters.json';

const CharacterQuiz = () => {
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizType, setQuizType] = useState('meaning'); // 'meaning', 'pinyin'

  const generateQuestion = () => {
    if (charactersData.length === 0) return;
    
    // Select random character
    const randomIndex = Math.floor(Math.random() * charactersData.length);
    const character = charactersData[randomIndex];
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomChar = charactersData[Math.floor(Math.random() * charactersData.length)];
      const option = quizType === 'meaning' ? randomChar.meaning : randomChar.pinyin;
      if (option !== (quizType === 'meaning' ? character.meaning : character.pinyin) && 
          !wrongOptions.includes(option)) {
        wrongOptions.push(option);
      }
    }
    
    // Create options array with correct answer
    const correctAnswer = quizType === 'meaning' ? character.meaning : character.pinyin;
    const allOptions = [...wrongOptions, correctAnswer];
    
    // Shuffle options
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setCurrentCharacter(character);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const correctAnswer = quizType === 'meaning' ? currentCharacter.meaning : currentCharacter.pinyin;
    if (answer === correctAnswer) {
      setScore(score + 1);
    }
    setQuestionCount(questionCount + 1);
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
  };

  const switchQuizType = (type) => {
    setQuizType(type);
    setScore(0);
    setQuestionCount(0);
    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, [quizType]);

  if (!currentCharacter) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const correctAnswer = quizType === 'meaning' ? currentCharacter.meaning : currentCharacter.pinyin;
  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Character Recognition Quiz</h1>
        <div className="flex justify-center gap-4">
          <Button 
            variant={quizType === 'meaning' ? 'default' : 'outline'}
            onClick={() => switchQuizType('meaning')}
          >
            Character → Meaning
          </Button>
          <Button 
            variant={quizType === 'pinyin' ? 'default' : 'outline'}
            onClick={() => switchQuizType('pinyin')}
          >
            Character → Pinyin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{questionCount}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{questionCount}/100</span>
        </div>
        <Progress value={(questionCount / 100) * 100} className="h-2" />
      </div>

      {/* Main Quiz Card */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">
            What is the {quizType} of this character?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Display */}
          <div className="text-center">
            <div className="text-8xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Noto Sans CJK SC, serif'}}>
              {currentCharacter.simplified}
            </div>
            <div className="text-sm text-gray-500">
              Traditional: <span className="font-medium" style={{fontFamily: 'Noto Sans CJK TC, serif'}}>{currentCharacter.traditional}</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, index) => {
              let buttonVariant = 'outline';
              let icon = null;
              
              if (showResult && selectedAnswer === option) {
                if (option === correctAnswer) {
                  buttonVariant = 'default';
                  icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                } else {
                  buttonVariant = 'destructive';
                  icon = <XCircle className="w-4 h-4 text-red-500" />;
                }
              } else if (showResult && option === correctAnswer) {
                buttonVariant = 'default';
                icon = <CheckCircle className="w-4 h-4 text-green-500" />;
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="flex-1">{option}</span>
                    {icon}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Result and Next Button */}
          {showResult && (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600 mb-2">Complete Information:</div>
                <div className="space-y-1">
                  <div><strong>Character:</strong> <span style={{fontFamily: 'Noto Sans CJK SC, serif'}}>{currentCharacter.simplified}</span> ({currentCharacter.traditional})</div>
                  <div><strong>Pinyin:</strong> {currentCharacter.pinyin}</div>
                  <div><strong>Meaning:</strong> {currentCharacter.meaning}</div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button onClick={nextQuestion} className="px-8">
                  Next Question
                </Button>
                <Button variant="outline" onClick={resetQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Quiz
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterQuiz;

