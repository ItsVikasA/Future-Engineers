import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Trophy, Medal, Award, TrendingUp, Crown, Star } from 'lucide-react';

export default function Leaderboard() {
  // Mock leaderboard data
  const topContributors = [
    {
      rank: 1,
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      reputation: 2840,
      contributions: 45,
      downloads: 12500,
      badges: ['Top Contributor', 'Quality Content', 'Helper'],
      trend: 'up',
    },
    {
      rank: 2,
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      reputation: 2650,
      contributions: 38,
      downloads: 9800,
      badges: ['Top Contributor', 'Early Adopter'],
      trend: 'up',
    },
    {
      rank: 3,
      name: 'Emily Johnson',
      avatar: '/avatars/emily.jpg',
      reputation: 2420,
      contributions: 42,
      downloads: 8900,
      badges: ['Quality Content', 'Helper', 'Mentor'],
      trend: 'down',
    },
    {
      rank: 4,
      name: 'Michael Kim',
      avatar: '/avatars/michael.jpg',
      reputation: 2180,
      contributions: 31,
      downloads: 7600,
      badges: ['Helper', 'Consistent'],
      trend: 'up',
    },
    {
      rank: 5,
      name: 'Lisa Wang',
      avatar: '/avatars/lisa.jpg',
      reputation: 1950,
      contributions: 28,
      downloads: 6800,
      badges: ['Quality Content', 'Rising Star'],
      trend: 'up',
    },
  ];

  const badges = [
    {
      name: 'Top Contributor',
      description: 'Contributed 25+ approved documents',
      icon: '🏆',
      rarity: 'gold',
      holders: 12,
    },
    {
      name: 'Quality Content',
      description: 'Maintained 95%+ approval rate',
      icon: '⭐',
      rarity: 'gold',
      holders: 28,
    },
    {
      name: 'Helper',
      description: 'Received 100+ likes on contributions',
      icon: '🤝',
      rarity: 'silver',
      holders: 45,
    },
    {
      name: 'Early Adopter',
      description: 'Among the first 100 users',
      icon: '🚀',
      rarity: 'silver',
      holders: 67,
    },
    {
      name: 'Rising Star',
      description: 'Gained 500+ reputation this month',
      icon: '🌟',
      rarity: 'bronze',
      holders: 89,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-400" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'silver':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'bronze':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Leaderboard</h1>
          <p className="text-lg text-gray-400">
            Celebrate our top contributors and their amazing work in building our knowledge community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Top Contributors
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Rankings based on reputation points earned through quality contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContributors.map((contributor) => (
                    <div
                      key={contributor.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                        contributor.rank <= 3 
                          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {getRankIcon(contributor.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12 border-2 border-white/20">
                        <AvatarImage src={contributor.avatar} alt={contributor.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{contributor.name}</h3>
                          <div className="flex items-center gap-1">
                            <TrendingUp 
                              className={`h-4 w-4 ${
                                contributor.trend === 'up' ? 'text-green-500' : 'text-red-500'
                              }`} 
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {contributor.badges.slice(0, 2).map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {contributor.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contributor.badges.length - 2} more
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-blue-600">{contributor.reputation.toLocaleString()}</span>
                            <span className="block">Reputation</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">{contributor.contributions}</span>
                            <span className="block">Contributions</span>
                          </div>
                          <div>
                            <span className="font-medium text-purple-600">{contributor.downloads.toLocaleString()}</span>
                            <span className="block">Downloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button variant="outline">View Full Leaderboard</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Achievement Badges
                </CardTitle>
                <CardDescription>
                  Earn badges by contributing quality content and helping the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badges.map((badge) => (
                    <div key={badge.name} className="flex items-start gap-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{badge.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getBadgeColor(badge.rarity)}`}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
                        <p className="text-xs text-gray-500">{badge.holders} holders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* This Week's Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week&apos;s Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Contributors</span>
                    <span className="font-semibold text-green-600">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents Added</span>
                    <span className="font-semibold text-blue-600">87</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Downloads</span>
                    <span className="font-semibold text-purple-600">2,453</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Likes</span>
                    <span className="font-semibold text-red-600">892</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Earn Points */}
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Upload approved document</span>
                    <span className="text-sm font-medium text-green-600">+10 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Receive a like</span>
                    <span className="text-sm font-medium text-green-600">+1 pt</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Featured content</span>
                    <span className="text-sm font-medium text-green-600">+25 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">100+ downloads</span>
                    <span className="text-sm font-medium text-green-600">+5 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Helpful comment</span>
                    <span className="text-sm font-medium text-green-600">+2 pts</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" className="w-full">
                    Start Contributing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
