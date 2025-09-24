
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Trophy, Clock, Users, TrendingDown, Gavel } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface Auction {
  id: string;
  auctionNumber: string;
  title: string;
  category: string;
  type: 'Reverse Auction' | 'Forward Auction' | 'Dutch Auction' | 'Sealed Bid';
  status: 'Draft' | 'Published' | 'Live' | 'Closed' | 'Awarded' | 'Cancelled';
  startTime: string;
  endTime: string;
  estimatedValue: number;
  currency: string;
  participantsInvited: number;
  activeBidders: number;
  totalBids: number;
  currentLeader: string;
  currentBestBid: number;
  savingsRealized: number;
}

const BiddingAuctions: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('auctions');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Bidding and Auctions. Manage competitive bidding processes and reverse auctions for optimal pricing.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleAuctions: Auction[] = [
      {
        id: 'auc-001',
        auctionNumber: 'AUC-2025-001',
        title: 'IT Equipment Reverse Auction',
        category: 'Technology',
        type: 'Reverse Auction',
        status: 'Live',
        startTime: '2025-01-25T09:00:00',
        endTime: '2025-01-25T17:00:00',
        estimatedValue: 150000,
        currency: 'USD',
        participantsInvited: 8,
        activeBidders: 6,
        totalBids: 24,
        currentLeader: 'Dell Technologies',
        currentBestBid: 142500,
        savingsRealized: 7500
      },
      {
        id: 'auc-002',
        auctionNumber: 'AUC-2025-002',
        title: 'Office Furniture Sealed Bid',
        category: 'Furniture',
        type: 'Sealed Bid',
        status: 'Closed',
        startTime: '2025-01-20T08:00:00',
        endTime: '2025-01-22T18:00:00',
        estimatedValue: 85000,
        currency: 'USD',
        participantsInvited: 5,
        activeBidders: 5,
        totalBids: 5,
        currentLeader: 'Steelcase Inc.',
        currentBestBid: 78500,
        savingsRealized: 6500
      }
    ];
    setAuctions(sampleAuctions);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-blue-100 text-blue-800',
      'Live': 'bg-green-100 text-green-800',
      'Closed': 'bg-orange-100 text-orange-800',
      'Awarded': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'auctionNumber', header: 'Auction #', sortable: true, searchable: true },
    { key: 'title', header: 'Title', searchable: true },
    { key: 'type', header: 'Type', filterable: true, filterOptions: [
      { label: 'Reverse Auction', value: 'Reverse Auction' },
      { label: 'Forward Auction', value: 'Forward Auction' },
      { label: 'Dutch Auction', value: 'Dutch Auction' },
      { label: 'Sealed Bid', value: 'Sealed Bid' }
    ]},
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' },
        { label: 'Live', value: 'Live' },
        { label: 'Closed', value: 'Closed' },
        { label: 'Awarded', value: 'Awarded' },
        { label: 'Cancelled', value: 'Cancelled' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'activeBidders', 
      header: 'Bidders',
      render: (value: number, row: Auction) => `${value}/${row.participantsInvited}`
    },
    { 
      key: 'currentBestBid', 
      header: 'Best Bid',
      sortable: true,
      render: (value: number, row: Auction) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'savingsRealized', 
      header: 'Savings',
      sortable: true,
      render: (value: number, row: Auction) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'endTime', header: 'End Time', sortable: true, render: (value: string) => new Date(value).toLocaleString() }
  ];

  const actions: TableAction[] = [
    {
      label: 'Monitor',
      icon: <Clock className="h-4 w-4" />,
      onClick: (row: Auction) => {
        toast({
          title: 'Monitor Auction',
          description: `Opening live monitoring for ${row.auctionNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Award',
      icon: <Trophy className="h-4 w-4" />,
      onClick: (row: Auction) => {
        toast({
          title: 'Award Auction',
          description: `Processing award for ${row.auctionNumber}`,
        });
      },
      variant: 'ghost'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Bidding & Auctions"
          description="Manage competitive bidding and reverse auction processes"
          voiceIntroduction="Welcome to Bidding and Auctions for competitive sourcing."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{auctions.length}</div>
            <div className="text-sm text-muted-foreground">Total Auctions</div>
            <div className="text-sm text-blue-600">This quarter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {auctions.filter(a => a.status === 'Live').length}
            </div>
            <div className="text-sm text-muted-foreground">Live Auctions</div>
            <div className="text-sm text-green-600">Active now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {auctions.reduce((sum, a) => sum + a.activeBidders, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Active Bidders</div>
            <div className="text-sm text-purple-600">Participating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${auctions.reduce((sum, a) => sum + a.savingsRealized, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Savings</div>
            <div className="text-sm text-green-600">Realized</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="live">Live Events</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="auctions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Auction Management
                <Button onClick={() => toast({ title: 'Create Auction', description: 'Opening new auction setup' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Auction
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={auctions}
                actions={actions}
                searchPlaceholder="Search auctions..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auctions.filter(a => a.status === 'Live').map((auction) => (
                  <div key={auction.id} className="p-4 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center text-green-800">
                          <Gavel className="h-4 w-4 mr-2" />
                          {auction.title} - LIVE
                        </h4>
                        <p className="text-sm text-green-700">
                          {auction.auctionNumber} | Type: {auction.type}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-green-600">Current Leader:</span>
                            <div className="font-medium">{auction.currentLeader}</div>
                          </div>
                          <div>
                            <span className="text-green-600">Best Bid:</span>
                            <div className="font-medium">{auction.currency} {auction.currentBestBid.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-green-600">Active Bidders:</span>
                            <div className="font-medium">{auction.activeBidders}/{auction.participantsInvited}</div>
                          </div>
                          <div>
                            <span className="text-green-600">Total Bids:</span>
                            <div className="font-medium">{auction.totalBids}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Monitor
                        </Button>
                        <Button size="sm">
                          <Trophy className="h-4 w-4 mr-2" />
                          Award
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded">
                      <div className="flex justify-between text-sm">
                        <span>Savings vs Estimate:</span>
                        <span className="font-medium text-green-600">
                          {auction.currency} {auction.savingsRealized.toLocaleString()} 
                          ({Math.round((auction.savingsRealized / auction.estimatedValue) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auction Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auctions.filter(a => a.status === 'Closed' || a.status === 'Awarded').map((auction) => (
                  <div key={auction.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{auction.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {auction.auctionNumber} | Winner: {auction.currentLeader}
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Winning Bid:</span>
                            <div className="font-medium">{auction.currency} {auction.currentBestBid.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Value:</span>
                            <div className="font-medium">{auction.currency} {auction.estimatedValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Savings:</span>
                            <div className="font-medium text-green-600">
                              {auction.currency} {auction.savingsRealized.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(auction.status)}>
                          {auction.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Average Savings Rate</span>
                      <span className="font-bold text-green-600">
                        {Math.round((auctions.reduce((sum, a) => sum + (a.savingsRealized / a.estimatedValue), 0) / auctions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Average Participation Rate</span>
                      <span className="font-bold">
                        {Math.round((auctions.reduce((sum, a) => sum + (a.activeBidders / a.participantsInvited), 0) / auctions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Total Bids Received</span>
                      <span className="font-bold">{auctions.reduce((sum, a) => sum + a.totalBids, 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auction Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Reverse Auction', 'Forward Auction', 'Dutch Auction', 'Sealed Bid'].map((type) => {
                    const count = auctions.filter(a => a.type === type).length;
                    const percentage = auctions.length > 0 ? Math.round((count / auctions.length) * 100) : 0;
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{type}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiddingAuctions;
