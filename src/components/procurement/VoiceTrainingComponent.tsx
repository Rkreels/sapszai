
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { Volume2, Play, Square } from 'lucide-react';

interface VoiceTrainingProps {
  module: string;
  topic: string;
  examples?: string[];
  detailLevel?: 'basic' | 'intermediate' | 'advanced';
}

const VoiceTrainingComponent: React.FC<VoiceTrainingProps> = ({ 
  module, 
  topic, 
  examples = [], 
  detailLevel = 'intermediate' 
}) => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak, isSpeaking, stop, generateEducationalContent } = useVoiceAssistant();

  const getDetailedContent = () => {
    const baseContent = generateEducationalContent(module);
    
    const detailLevels = {
      basic: `${topic} Overview: ${baseContent.substring(0, 200)}...`,
      intermediate: `${topic} Deep Dive: ${baseContent}`,
      advanced: `${topic} Expert Level: ${baseContent} Additionally, this involves complex integration scenarios, advanced configuration options, and enterprise-scale considerations for optimal performance and compliance.`
    };

    return detailLevels[detailLevel];
  };

  const handleVoiceTraining = () => {
    if (isSpeaking) {
      stop();
    } else {
      const content = getDetailedContent();
      speak(content);
    }
  };

  const handleExampleTraining = (example: string) => {
    const exampleContent = `Here's a practical example for ${topic}: ${example}. This demonstrates real-world application and best practices in SAP S/4HANA.`;
    speak(exampleContent);
  };

  if (!isEnabled) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">Enable Voice Assistant to access training content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Voice Training: {topic}
          </span>
          <Badge variant="outline">{detailLevel}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex space-x-2">
          <Button 
            onClick={handleVoiceTraining}
            variant={isSpeaking ? "destructive" : "default"}
            size="sm"
          >
            {isSpeaking ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isSpeaking ? 'Stop Training' : 'Start Training'}
          </Button>
        </div>
        
        {examples.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Practice Examples:</p>
            <div className="grid grid-cols-1 gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start"
                  onClick={() => handleExampleTraining(example)}
                >
                  <Play className="h-3 w-3 mr-2" />
                  {example.substring(0, 50)}...
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceTrainingComponent;
