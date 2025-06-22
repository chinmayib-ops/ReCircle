import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Trophy, Medal, Award, TrendingUp, Star, Gift, Target } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  itemsDonated: number;
  co2Saved: number;
  badges: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    points: 2450,
    rank: 1,
    itemsDonated: 127,
    co2Saved: 89.5,
    badges: ['Eco Warrior', 'Super Donor', 'Green Champion'],
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200',
    points: 2180,
    rank: 2,
    itemsDonated: 98,
    co2Saved: 72.3,
    badges: ['Super Donor', 'Recycling Pro'],
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
    points: 1950,
    rank: 3,
    itemsDonated: 86,
    co2Saved: 64.2,
    badges: ['Green Champion', 'Eco Friendly'],
  },
  {
    id: '4',
    name: 'Alex Kim',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
    points: 1720,
    rank: 4,
    itemsDonated: 74,
    co2Saved: 52.8,
    badges: ['Recycling Pro'],
  },
  {
    id: '5',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200',
    points: 450,
    rank: 42,
    itemsDonated: 18,
    co2Saved: 12.6,
    badges: ['Getting Started'],
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Donate your first 5 items',
    icon: 'gift',
    progress: 3,
    target: 5,
    completed: false,
  },
  {
    id: '2',
    title: 'Eco Warrior',
    description: 'Save 50kg of CO2 through donations',
    icon: 'star',
    progress: 12.6,
    target: 50,
    completed: false,
  },
  {
    id: '3',
    title: 'Super Donor',
    description: 'Donate 100 items',
    icon: 'trophy',
    progress: 18,
    target: 100,
    completed: false,
  },
];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const currentUser = mockUsers.find(user => user.name === 'You');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Award size={24} color="#CD7F32" />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankNumberText}>{rank}</Text>
          </View>
        );
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift size={24} color="#10B981" />;
      case 'star':
        return <Star size={24} color="#F59E0B" />;
      case 'trophy':
        return <Trophy size={24} color="#3B82F6" />;
      default:
        return <Target size={24} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <Text style={styles.headerSubtitle}>Track your impact & compete</Text>
      </View>

      {/* Current User Stats */}
      {currentUser && (
        <View style={styles.userStatsCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userRank}>Rank #{currentUser.rank}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.points}</Text>
              <Text style={styles.statLabel}>Eco Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.itemsDonated}</Text>
              <Text style={styles.statLabel}>Items Donated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.co2Saved}kg</Text>
              <Text style={styles.statLabel}>CO2 Saved</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'leaderboard' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Trophy size={20} color={activeTab === 'leaderboard' ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'leaderboard' && styles.tabButtonTextActive,
            ]}
          >
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'achievements' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('achievements')}
        >
          <Award size={20} color={activeTab === 'achievements' ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'achievements' && styles.tabButtonTextActive,
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'leaderboard' ? (
          <View style={styles.leaderboardContent}>
            {mockUsers.slice(0, 10).map((user) => (
              <View
                key={user.id}
                style={[
                  styles.userCard,
                  user.name === 'You' && styles.currentUserCard,
                ]}
              >
                <View style={styles.userCardLeft}>
                  <View style={styles.rankContainer}>
                    {getRankIcon(user.rank)}
                  </View>
                  <Image source={{ uri: user.avatar }} style={styles.avatarSmall} />
                  <View style={styles.userCardInfo}>
                    <Text style={styles.userCardName}>{user.name}</Text>
                    <View style={styles.badgeContainer}>
                      {user.badges.slice(0, 2).map((badge, index) => (
                        <View key={index} style={styles.badge}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.userCardRight}>
                  <Text style={styles.pointsText}>{user.points}</Text>
                  <Text style={styles.pointsLabel}>points</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.achievementsContent}>
            {mockAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementHeader}>
                  <View style={styles.achievementIcon}>
                    {getAchievementIcon(achievement.icon)}
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (achievement.progress / achievement.target) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress} / {achievement.target}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  userStatsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  userRank: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#10B981',
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  leaderboardContent: {
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  userCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userCardInfo: {
    flex: 1,
  },
  userCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
  },
  userCardRight: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContent: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});