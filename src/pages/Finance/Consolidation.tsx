
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Building2, Globe, Layers, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

const Consolidation: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Financial Consolidation. Consolidate financial data across entities and prepare group financial statements with currency translation.');
    }
  }, [isEnabled, speak]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Financial Consolidation"
          description="Consolidate financial data across entities and prepare group statements"
          voiceIntroduction="Welcome to Financial Consolidation for group reporting."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Financial Consolidation Process"
        examples={[
          "Setting up consolidation units and group hierarchy with ownership percentages and equity methods",
          "Processing currency translation and elimination entries for intercompany transactions",
          "Creating consolidated financial statements with minority interests and goodwill calculations"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Consolidation Units</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Currencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Layers className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Reporting Periods</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Data Completeness</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consolidation Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'CU-001', name: 'Parent Company US', ownership: '100%', method: 'Full Consolidation' },
                { id: 'CU-002', name: 'Subsidiary DE', ownership: '85%', method: 'Full Consolidation' },
                { id: 'CU-003', name: 'Associate UK', ownership: '35%', method: 'Equity Method' },
                { id: 'CU-004', name: 'Joint Venture FR', ownership: '50%', method: 'Proportional' }
              ].map((unit) => (
                <div key={unit.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{unit.name}</div>
                    <div className="text-sm text-muted-foreground">{unit.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{unit.ownership}</div>
                    <div className="text-sm text-muted-foreground">{unit.method}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Translation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { currency: 'EUR', rate: '1.0000', date: '2024-12-31', status: 'Current' },
                { currency: 'USD', rate: '1.0512', date: '2024-12-31', status: 'Current' },
                { currency: 'GBP', rate: '0.8342', date: '2024-12-31', status: 'Current' },
                { currency: 'JPY', rate: '156.25', date: '2024-12-31', status: 'Current' }
              ].map((rate) => (
                <div key={rate.currency} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{rate.currency}</div>
                    <div className="text-sm text-muted-foreground">{rate.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{rate.rate}</div>
                    <Badge className="text-xs">{rate.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elimination Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'Intercompany Sales', amount: '€2,450,000', entries: 45, status: 'Processed' },
                { type: 'Investment Elimination', amount: '€8,750,000', entries: 12, status: 'Processed' },
                { type: 'Dividend Elimination', amount: '€1,200,000', entries: 8, status: 'In Process' }
              ].map((elimination) => (
                <div key={elimination.type} className="p-4 border rounded">
                  <div className="text-sm text-muted-foreground">{elimination.type}</div>
                  <div className="text-lg font-semibold">{elimination.amount}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">{elimination.entries} entries</span>
                    <Badge variant={elimination.status === 'Processed' ? 'default' : 'secondary'}>
                      {elimination.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consolidated Financial Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Balance Sheet (Consolidated)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Assets</span>
                  <span className="font-medium">€125,400,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Liabilities</span>
                  <span className="font-medium">€68,200,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Shareholders' Equity</span>
                  <span className="font-medium">€52,800,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Minority Interest</span>
                  <span className="font-medium">€4,400,000</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Income Statement (Consolidated)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenue</span>
                  <span className="font-medium">€89,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Income</span>
                  <span className="font-medium">€12,800,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Income</span>
                  <span className="font-medium">€8,950,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Minority Interest Income</span>
                  <span className="font-medium">€450,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consolidation;
