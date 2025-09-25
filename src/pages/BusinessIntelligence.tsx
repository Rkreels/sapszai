
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import { toast } from '../components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

const BusinessIntelligence: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  const { isEnabled } = useVoiceAssistantContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak("Welcome to the Business Intelligence module. Here you can access analytics, reporting, and data visualization tools for informed decision making.");
      }
    };
    
    checkVoiceAssistant();
  }, [speak, isEnabled]);

  const handleTileClick = (path: string, title: string) => {
    if (isEnabled) {
      speak(`Opening ${title}`);
    }
    toast({
      title: "Navigation",
      description: `Opening ${title}...`,
    });
    navigate(`/business-intelligence/${path}`);
  };

  // Sample data for charts
  const financialData = [
    { month: 'Jan', revenue: 400000, expenses: 240000, profit: 160000 },
    { month: 'Feb', revenue: 300000, expenses: 139800, profit: 160200 },
    { month: 'Mar', revenue: 980000, expenses: 400000, profit: 580000 },
    { month: 'Apr', revenue: 390800, expenses: 278000, profit: 112800 },
    { month: 'May', revenue: 480000, expenses: 189000, profit: 291000 },
    { month: 'Jun', revenue: 380000, expenses: 239000, profit: 141000 },
  ];

  const salesData = [
    { product: 'Product A', sales: 4000, target: 3800 },
    { product: 'Product B', sales: 3000, target: 3200 },
    { product: 'Product C', sales: 2000, target: 2800 },
    { product: 'Product D', sales: 2780, target: 2500 },
    { product: 'Product E', sales: 1890, target: 2000 },
  ];

  const pieData = [
    { name: 'Finance', value: 35, color: '#8884d8' },
    { name: 'Sales', value: 25, color: '#82ca9d' },
    { name: 'Manufacturing', value: 20, color: '#ffc658' },
    { name: 'HR', value: 12, color: '#ff7300' },
    { name: 'Other', value: 8, color: '#00ff00' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold mb-6">Business Intelligence & Analytics</h1>

      {/* Executive Dashboard with Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departmental Budget Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <SAPSection 
        title="Executive Analytics" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="High-level dashboards and KPIs for executive decision making."
      >
        <SAPTile 
          title="Executive Dashboard"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Comprehensive overview of business performance."
          icon={<span className="text-xl">📈</span>}
          onClick={() => handleTileClick('executive-dashboard', 'Executive Dashboard')}
        />
        <SAPTile 
          title="KPI Monitoring"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Track key performance indicators across the organization."
          icon={<span className="text-xl">🎯</span>}
          onClick={() => handleTileClick('kpi-monitoring', 'KPI Monitoring')}
        />
        <SAPTile 
          title="Balanced Scorecard"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Strategic performance management framework."
          icon={<span className="text-xl">⚖️</span>}
          onClick={() => handleTileClick('balanced-scorecard', 'Balanced Scorecard')}
        />
      </SAPSection>

      {/* Sales Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance vs Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Units']} />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Actual Sales" />
              <Bar dataKey="target" fill="#82ca9d" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <SAPSection 
        title="Operational Analytics" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Detailed analytics for specific business functions."
      >
        <SAPTile 
          title="Financial Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Comprehensive financial performance analysis."
          icon={<span className="text-xl">💰</span>}
          onClick={() => handleTileClick('financial-analytics', 'Financial Analytics')}
        />
        <SAPTile 
          title="Sales Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Sales performance and customer analytics."
          icon={<span className="text-xl">📊</span>}
          onClick={() => handleTileClick('sales-analytics', 'Sales Analytics')}
        />
        <SAPTile 
          title="Manufacturing Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Production efficiency and quality analytics."
          icon={<span className="text-xl">🏭</span>}
          onClick={() => handleTileClick('manufacturing-analytics', 'Manufacturing Analytics')}
        />
      </SAPSection>

      <SAPSection 
        title="Advanced Analytics" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Predictive and real-time analytics capabilities."
      >
        <SAPTile 
          title="Predictive Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Machine learning and predictive modeling."
          icon={<span className="text-xl">🔮</span>}
          onClick={() => handleTileClick('predictive-analytics', 'Predictive Analytics')}
        />
        <SAPTile 
          title="Real-time Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Live data processing and instant insights."
          icon={<span className="text-xl">⚡</span>}
          onClick={() => handleTileClick('realtime-analytics', 'Real-time Analytics')}
        />
        <SAPTile 
          title="Data Mining"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Discover patterns and insights in large datasets."
          icon={<span className="text-xl">⛏️</span>}
          onClick={() => handleTileClick('data-mining', 'Data Mining')}
        />
      </SAPSection>

      <SAPSection 
        title="Reporting & Visualization" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Create and manage reports and data visualizations."
      >
        <SAPTile 
          title="Report Builder"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create custom reports and analytics."
          icon={<span className="text-xl">📋</span>}
          onClick={() => handleTileClick('report-builder', 'Report Builder')}
        />
        <SAPTile 
          title="Data Visualization"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Interactive charts and visual analytics."
          icon={<span className="text-xl">📊</span>}
          onClick={() => handleTileClick('data-visualization', 'Data Visualization')}
        />
        <SAPTile 
          title="Mobile Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access analytics on mobile devices."
          icon={<span className="text-xl">📱</span>}
          onClick={() => handleTileClick('mobile-analytics', 'Mobile Analytics')}
        />
      </SAPSection>
    </div>
  );
};

export default BusinessIntelligence;
