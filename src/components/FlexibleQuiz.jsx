import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, Volume2, Settings } from 'lucide-react';
import charactersData from '@/assets/characters.json';

const FlexibleQuiz = () => {
  const [inputType, setInputType] = useState('character'); // character, pinyin, audio, meaning
  const [outputType, setOutputType] = useState('meaning'); // character, pinyin, audio, meaning
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isTextInput, setIsTextInput] = useState(false);

  const modeLabels = {
    character: 'Character (汉字)',
    pinyin: 'Pinyin',
    audio: 'Audio',
    meaning: 'English Meaning'
  };

  const generateQuestion = () => {
    if (charactersData.length === 0) return;
    
    // Select random character
    const randomIndex = Math.floor(Math.random() * charactersData.length);
    const character = charactersData[randomIndex];
    
    // Determine if we need text input or multiple choice
    const needsTextInput = (outputType === 'character' || outputType === 'pinyin');
    setIsTextInput(needsTextInput);
    
    if (needsTextInput) {
      // For character/pinyin output, use text input
      setOptions([]);
    } else {
      // For meaning/audio output, use multiple choice
      const wrongOptions = [];
      while (wrongOptions.length < 3) {
        const randomChar = charactersData[Math.floor(Math.random() * charactersData.length)];
        const option = outputType === 'meaning' ? randomChar.meaning : randomChar.pinyin;
        const correctAnswer = outputType === 'meaning' ? character.meaning : character.pinyin;
        
        if (option !== correctAnswer && !wrongOptions.includes(option)) {
          wrongOptions.push(option);
        }
      }
      
      // Create options array with correct answer
      const correctAnswer = outputType === 'meaning' ? character.meaning : character.pinyin;
      const allOptions = [...wrongOptions, correctAnswer];
      
      // Shuffle options
      for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
      }
      
      setOptions(allOptions);
    }
    
    setCurrentCharacter(character);
    setSelectedAnswer(null);
    setUserAnswer('');
    setShowResult(false);
  };

  const getCorrectAnswer = () => {
    if (!currentCharacter) return '';
    
    switch (outputType) {
      case 'character':
        return currentCharacter.simplified;
      case 'pinyin':
        return currentCharacter.pinyin;
      case 'meaning':
        return currentCharacter.meaning;
      case 'audio':
        return currentCharacter.pinyin; // For audio, we compare pinyin
      default:
        return '';
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    checkAnswer(answer);
  };

  const handleTextSubmit = () => {
    if (userAnswer.trim()) {
      checkAnswer(userAnswer.trim());
    }
  };

  const checkAnswer = (answer) => {
    setShowResult(true);
    
    const correctAnswer = getCorrectAnswer();
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    if (isCorrect) {
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

  const playAudio = (text) => {
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const renderInput = () => {
    if (!currentCharacter) return null;

    switch (inputType) {
      case 'character':
        return (
          <div className="text-center">
            <div className="text-8xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Noto Sans CJK SC, serif'}}>
              {currentCharacter.simplified}
            </div>
            <div className="text-sm text-gray-500">
              Traditional: <span className="font-medium" style={{fontFamily: 'Noto Sans CJK TC, serif'}}>{currentCharacter.traditional}</span>
            </div>
          </div>
        );
      case 'pinyin':
        return (
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {currentCharacter.pinyin}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => playAudio(currentCharacter.pinyin)}
              className="mb-2"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Play Audio
            </Button>
          </div>
        );
      case 'audio':
        return (
          <div className="text-center">
            <div className="text-4xl mb-6">🔊</div>
            <Button 
              onClick={() => playAudio(currentCharacter.pinyin)}
              className="mb-4"
              size="lg"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Play Audio
            </Button>
            <p className="text-sm text-gray-500">Click to hear the pronunciation</p>
          </div>
        );
      case 'meaning':
        return (
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-4">
              {currentCharacter.meaning}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderOutput = () => {
    if (isTextInput) {
      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Enter the ${outputType}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={showResult}
              onKeyPress={(e) => e.key === 'Enter' && !showResult && handleTextSubmit()}
            />
            <Button 
              onClick={handleTextSubmit}
              disabled={!userAnswer.trim() || showResult}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, index) => {
            let buttonVariant = 'outline';
            let icon = null;
            const correctAnswer = getCorrectAnswer();
            
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
                  <span className="flex-1">
                    {outputType === 'audio' ? (
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        {option}
                      </div>
                    ) : (
                      option
                    )}
                  </span>
                  {icon}
                </div>
              </Button>
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [inputType, outputType]);

  if (!currentCharacter) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const accuracy = questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;
  const correctAnswer = getCorrectAnswer();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Flexible Character Quiz</h1>
        <Button 
          variant="outline" 
          onClick={() => setShowSettings(!showSettings)}
          className="mb-4"
        >
          <Settings className="w-4 h-4 mr-2" />
          Quiz Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Quiz Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">What should be shown to you? (Input)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(modeLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={inputType === key ? 'default' : 'outline'}
                    onClick={() => setInputType(key)}
                    className="text-sm"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">What should you provide? (Output)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(modeLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={outputType === key ? 'default' : 'outline'}
                    onClick={() => setOutputType(key)}
                    className="text-sm"
                    disabled={key === inputType} // Can't have same input and output
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-white p-3 rounded">
              <strong>Current Mode:</strong> {modeLabels[inputType]} → {modeLabels[outputType]}
            </div>
          </CardContent>
        </Card>
      )}

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
            {modeLabels[inputType]} → {modeLabels[outputType]}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Look at the {modeLabels[inputType].toLowerCase()} and provide the {modeLabels[outputType].toLowerCase()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Display */}
          {renderInput()}

          {/* Output Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Your Answer ({modeLabels[outputType]}):
            </h3>
            {renderOutput()}
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
                {isTextInput && (
                  <div className="mt-2 p-2 rounded bg-white">
                    <div className="text-sm">
                      <strong>Your answer:</strong> {userAnswer}
                    </div>
                    <div className="text-sm">
                      <strong>Correct answer:</strong> {correctAnswer}
                    </div>
                    <div className={`text-sm font-semibold ${
                      userAnswer.toLowerCase() === correctAnswer.toLowerCase() 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? '✓ Correct!' : '✗ Incorrect'}
                    </div>
                  </div>
                )}
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

export default FlexibleQuiz;

