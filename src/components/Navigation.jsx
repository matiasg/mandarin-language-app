import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, PenTool, BarChart3, Home } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quiz', label: 'Quiz Mode', icon: BookOpen },
    { id: 'draw', label: 'Draw Mode', icon: PenTool },
    { id: 'copy-character', label: 'Copy Character', icon: PenTool },
    { id: 'draw-from-definition', label: 'Draw from Definition', icon: PenTool },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <Card className="p-4 mb-6">
      <nav className="flex flex-wrap justify-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'outline'}
              onClick={() => setCurrentView(item.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </Card>
  );
};

export default Navigation;

