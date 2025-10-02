'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Target, Gem, Flame } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserStats {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  contributions?: number;
  downloads?: number;
  reputation?: number;
  badges?: string[];
}

export default function Leaderboard() {
  const [topContributors, setTopContributors] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for leaderboard data
    // Sort by contributions (number of approved documents)
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('contributions', 'desc'),
      limit(10)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          contributions: doc.data().contributions || 0,
          downloads: doc.data().downloads || 0,
          reputation: doc.data().reputation || 0,
          badges: doc.data().badges || []
        })) as UserStats[];

        setTopContributors(users);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching leaderboard data:', error);
        setTopContributors([]);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-blue-400" />;
    }
  };

  const getUserDisplayName = (user: UserStats) => {
    return user.displayName || user.email?.split('@')[0] || 'Anonymous User';
  };

  const getUserInitials = (user: UserStats) => {
    const name = getUserDisplayName(user);
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <Header />
      
      {/* Floating Decorative Elements - Enhanced with Many More Icons */}
      <div className="absolute top-24 right-20 opacity-10 animate-float pointer-events-none">
        <Trophy className="w-32 h-32 text-yellow-500" />
      </div>
      <div className="absolute top-1/3 left-16 opacity-10 animate-float-delayed pointer-events-none">
        <Crown className="w-28 h-28 text-orange-500" />
      </div>
      <div className="absolute bottom-32 right-24 opacity-10 animate-float pointer-events-none">
        <Target className="w-24 h-24 text-blue-500" />
      </div>
      <div className="absolute bottom-1/4 left-20 opacity-10 animate-float-delayed pointer-events-none">
        <Gem className="w-26 h-26 text-purple-500" />
      </div>
      <div className="absolute top-1/2 right-40 opacity-10 animate-float pointer-events-none">
        <Flame className="w-20 h-20 text-red-500" />
      </div>
      <div className="absolute bottom-40 left-10 opacity-10 animate-float-delayed pointer-events-none">
        <Star className="w-22 h-22 text-pink-500" />
      </div>
      <div className="absolute top-1/4 right-32 opacity-8 animate-float pointer-events-none">
        <Medal className="w-26 h-26 text-amber-500" />
      </div>
      <div className="absolute bottom-1/3 left-32 opacity-8 animate-float-delayed pointer-events-none">
        <Award className="w-24 h-24 text-emerald-500" />
      </div>
      <div className="absolute top-2/3 right-16 opacity-8 animate-float pointer-events-none">
        <TrendingUp className="w-22 h-22 text-cyan-500" />
      </div>
      <div className="absolute bottom-2/3 left-24 opacity-8 animate-float-delayed pointer-events-none">
        <Trophy className="w-20 h-20 text-indigo-500" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-8 animate-float pointer-events-none">
        <Crown className="w-24 h-24 text-violet-500" />
      </div>
      <div className="absolute bottom-1/2 right-1/4 opacity-8 animate-float-delayed pointer-events-none">
        <Star className="w-20 h-20 text-rose-500" />
      </div>
      <div className="absolute top-3/4 right-28 opacity-7 animate-float pointer-events-none">
        <Gem className="w-18 h-18 text-teal-500" />
      </div>
      <div className="absolute bottom-3/4 left-36 opacity-7 animate-float-delayed pointer-events-none">
        <Flame className="w-18 h-18 text-orange-400" />
      </div>
      <div className="absolute top-1/3 left-1/3 opacity-7 animate-float pointer-events-none">
        <Target className="w-16 h-16 text-lime-500" />
      </div>
      
      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate our top contributors and their amazing work in building our knowledge community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top 3 Podium - Olympic Style */}
            {!loading && topContributors.length >= 3 && (
              <div className="mb-8">
                <div className="flex items-end justify-center gap-2 sm:gap-4 px-2 sm:px-4">
                  {/* 2nd Place - Left, Shorter */}
                  <div className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[180px]">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-4 border-gray-400 mb-2 ring-4 ring-gray-400/20 relative z-10">
                      <AvatarImage src={topContributors[1].photoURL} alt={getUserDisplayName(topContributors[1])} />
                      <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-lg">
                        {getUserInitials(topContributors[1])}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-xl shadow-xl relative overflow-hidden h-40">
                      {/* Rank number on stand */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        <span className="text-xl sm:text-2xl font-black text-white">2</span>
                      </div>
                      {/* User info */}
                      <div className="absolute bottom-3 left-0 right-0 px-2 text-center">
                        <Medal className="w-6 h-6 text-white/90 mx-auto mb-1" />
                        <p className="font-bold text-white text-xs sm:text-sm leading-tight break-words">{getUserDisplayName(topContributors[1])}</p>
                        <p className="text-xl sm:text-2xl font-black text-white mt-1">{topContributors[1].contributions || 0}</p>
                        <p className="text-[10px] text-white/80">contributions</p>
                      </div>
                    </div>
                  </div>

                  {/* 1st Place - Center, Tallest */}
                  <div className="flex flex-col items-center flex-1 max-w-[160px] sm:max-w-[200px]">
                    <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-2 animate-bounce" />
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-yellow-500 mb-2 ring-4 ring-yellow-500/30 relative z-10">
                      <AvatarImage src={topContributors[0].photoURL} alt={getUserDisplayName(topContributors[0])} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white text-xl sm:text-2xl">
                        {getUserInitials(topContributors[0])}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full bg-gradient-to-b from-yellow-500 to-orange-500 rounded-t-xl shadow-2xl shadow-yellow-500/50 relative overflow-hidden h-50">
                      {/* Rank number on stand */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        <span className="text-2xl sm:text-3xl font-black text-white">1</span>
                      </div>
                      {/* User info */}
                      <div className="absolute bottom-3 left-0 right-0 px-2 text-center">
                        <Trophy className="w-8 h-8 text-white mx-auto mb-1" />
                        <p className="font-bold text-white text-sm sm:text-base leading-tight break-words">{getUserDisplayName(topContributors[0])}</p>
                        <p className="text-2xl sm:text-3xl font-black text-white mt-1">{topContributors[0].contributions || 0}</p>
                        <p className="text-[10px] text-white/90">contributions</p>
                      </div>
                    </div>
                  </div>

                  {/* 3rd Place - Right, Shortest */}
                  <div className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[180px]">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-4 border-amber-600 mb-2 ring-4 ring-amber-600/20 relative z-10">
                      <AvatarImage src={topContributors[2].photoURL} alt={getUserDisplayName(topContributors[2])} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-700 text-white text-lg">
                        {getUserInitials(topContributors[2])}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-xl shadow-xl relative overflow-hidden h-30">
                      {/* Rank number on stand */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        <span className="text-xl sm:text-2xl font-black text-white">3</span>
                      </div>
                      {/* User info */}
                      <div className="absolute bottom-3 left-0 right-0 px-2 text-center">
                        <Award className="w-6 h-6 text-white/90 mx-auto mb-1" />
                        <p className="font-bold text-white text-xs sm:text-sm leading-tight break-words">{getUserDisplayName(topContributors[2])}</p>
                        <p className="text-xl sm:text-2xl font-black text-white mt-1">{topContributors[2].contributions || 0}</p>
                        <p className="text-[10px] text-white/80">contributions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Rankings */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  All Contributors
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Rankings based on number of approved documents contributed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading leaderboard...</p>
                  </div>
                ) : topContributors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Contributors Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to contribute and claim your spot on the leaderboard!
                    </p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Start Contributing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topContributors.map((contributor, index) => {
                      const rank = index + 1;
                      const displayName = getUserDisplayName(contributor);
                      const initials = getUserInitials(contributor);
                      
                      return (
                        <div
                          key={contributor.uid}
                          className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                            rank <= 3 
                              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-md' 
                              : 'bg-card/50 border-border hover:border-primary/30 hover:shadow-md'
                          }`}
                        >
                          {/* Rank Number */}
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 font-bold text-foreground">
                            #{rank}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-border">
                            <AvatarImage src={contributor.photoURL} alt={displayName} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground break-words line-clamp-1">{displayName}</h3>
                              {rank <= 3 && (
                                <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <span className="font-bold text-green-500 block text-base sm:text-lg">{contributor.contributions || 0}</span>
                                <span className="text-muted-foreground text-xs">Contributions</span>
                              </div>
                              <div>
                                <span className="font-bold text-blue-500 block">{(contributor.reputation || 0).toLocaleString()}</span>
                                <span className="text-muted-foreground text-xs">Reputation</span>
                              </div>
                              <div>
                                <span className="font-bold text-purple-500 block">{(contributor.downloads || 0).toLocaleString()}</span>
                                <span className="text-muted-foreground text-xs">Downloads</span>
                              </div>
                            </div>
                          </div>

                          {/* Rank Icon */}
                          <div className="flex-shrink-0 hidden sm:block">
                            {getRankIcon(rank)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Badges */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Achievement Badges
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Earn badges by contributing quality content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badges.map((badge) => (
                    <div key={badge.name} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors">
                      <div className="text-3xl">{badge.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-sm text-foreground">{badge.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getBadgeColor(badge.rarity)}`}
                          >
                            {badge.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        <p className="text-xs text-primary font-medium">{badge.holders} holders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* This Week's Stats */}
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30">
              <CardHeader>
                <CardTitle className="text-foreground">This Week&apos;s Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <span className="text-sm text-foreground">New Contributors</span>
                    <span className="font-bold text-green-500">+23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                    <span className="text-sm text-foreground">Documents Added</span>
                    <span className="font-bold text-blue-500">87</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                    <span className="text-sm text-foreground">Total Downloads</span>
                    <span className="font-bold text-purple-500">2,453</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                    <span className="text-sm text-foreground">Community Likes</span>
                    <span className="font-bold text-red-500">892</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Earn Points */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-500/5 transition-colors">
                    <span className="text-sm text-foreground">Upload approved document</span>
                    <span className="text-sm font-bold text-green-500">+10 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-500/5 transition-colors">
                    <span className="text-sm text-foreground">Receive a like</span>
                    <span className="text-sm font-bold text-green-500">+1 pt</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-500/5 transition-colors">
                    <span className="text-sm text-foreground">Featured content</span>
                    <span className="text-sm font-bold text-green-500">+25 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-500/5 transition-colors">
                    <span className="text-sm text-foreground">100+ downloads</span>
                    <span className="text-sm font-bold text-green-500">+5 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-500/5 transition-colors">
                    <span className="text-sm text-foreground">Helpful comment</span>
                    <span className="text-sm font-bold text-green-500">+2 pts</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90">
                    Start Contributing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
