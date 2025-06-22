import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Lightbulb, Search, Clock, Star, Play, Bookmark, Heart } from 'lucide-react-native';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  materials: string[];
  rating: number;
  likes: number;
  category: string;
  isBookmarked: boolean;
}

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Turn Plastic Bottles into Planters',
    description: 'Transform used plastic bottles into beautiful hanging planters for your garden.',
    image: 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    duration: '15 mins',
    materials: ['Plastic bottles', 'Paint', 'Rope', 'Scissors'],
    rating: 4.8,
    likes: 234,
    category: 'Garden',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'Old T-Shirt Tote Bags',
    description: 'Convert old t-shirts into reusable tote bags without any sewing required.',
    image: 'https://images.pexels.com/photos/7262800/pexels-photo-7262800.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    duration: '10 mins',
    materials: ['Old t-shirts', 'Scissors'],
    rating: 4.6,
    likes: 189,
    category: 'Fashion',
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Mason Jar Desk Organizer',
    description: 'Create a stylish desk organizer using mason jars and wooden base.',
    image: 'https://images.pexels.com/photos/6068955/pexels-photo-6068955.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Medium',
    duration: '45 mins',
    materials: ['Mason jars', 'Wood plank', 'Screws', 'Paint'],
    rating: 4.9,
    likes: 342,
    category: 'Organization',
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Wine Cork Coasters',
    description: 'Make elegant coasters from wine corks - perfect for protecting furniture.',
    image: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Medium',
    duration: '30 mins',
    materials: ['Wine corks', 'Glue', 'Sandpaper'],
    rating: 4.4,
    likes: 156,
    category: 'Home Decor',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'Cardboard Castle for Kids',
    description: 'Build an amazing castle from cardboard boxes that kids will love.',
    image: 'https://images.pexels.com/photos/8613320/pexels-photo-8613320.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Hard',
    duration: '2 hours',
    materials: ['Cardboard boxes', 'Paint', 'Tape', 'Cutter'],
    rating: 4.7,
    likes: 278,
    category: 'Kids',
    isBookmarked: true,
  },
];

export default function DIYScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);

  const categories = ['All', 'Garden', 'Fashion', 'Organization', 'Home Decor', 'Kids'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10B981';
      case 'Medium':
        return '#F59E0B';
      case 'Hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const toggleBookmark = (tutorialId: string) => {
    setTutorials(prevTutorials =>
      prevTutorials.map(tutorial =>
        tutorial.id === tutorialId
          ? { ...tutorial, isBookmarked: !tutorial.isBookmarked }
          : tutorial
      )
    );
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Lightbulb size={32} color="#F59E0B" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>DIY Tutorials</Text>
            <Text style={styles.headerSubtitle}>Creative reuse ideas</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tutorials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.tutorialsList} showsVerticalScrollIndicator={false}>
        {filteredTutorials.map((tutorial) => (
          <View key={tutorial.id} style={styles.tutorialCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: tutorial.image }} style={styles.tutorialImage} />
              <TouchableOpacity style={styles.playButton}>
                <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(tutorial.id)}
              >
                <Bookmark
                  size={20}
                  color={tutorial.isBookmarked ? '#F59E0B' : '#FFFFFF'}
                  fill={tutorial.isBookmarked ? '#F59E0B' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.tutorialContent}>
              <View style={styles.tutorialHeader}>
                <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                <View style={styles.tutorialMeta}>
                  <View
                    style={[
                      styles.difficultyTag,
                      { backgroundColor: `${getDifficultyColor(tutorial.difficulty)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(tutorial.difficulty) },
                      ]}
                    >
                      {tutorial.difficulty}
                    </Text>
                  </View>
                  <View style={styles.duration}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.durationText}>{tutorial.duration}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.tutorialDescription}>{tutorial.description}</Text>

              <View style={styles.materialsSection}>
                <Text style={styles.materialsTitle}>Materials needed:</Text>
                <View style={styles.materialTags}>
                  {tutorial.materials.slice(0, 3).map((material, index) => (
                    <View key={index} style={styles.materialTag}>
                      <Text style={styles.materialTagText}>{material}</Text>
                    </View>
                  ))}
                  {tutorial.materials.length > 3 && (
                    <View style={styles.materialTag}>
                      <Text style={styles.materialTagText}>
                        +{tutorial.materials.length - 3} more
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.tutorialFooter}>
                <View style={styles.rating}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{tutorial.rating}</Text>
                </View>
                <View style={styles.likes}>
                  <Heart size={16} color="#EF4444" />
                  <Text style={styles.likesText}>{tutorial.likes}</Text>
                </View>
                <Text style={styles.category}>{tutorial.category}</Text>
              </View>
            </View>
          </View>
        ))}
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  tutorialsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tutorialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  tutorialImage: {
    width: '100%',
    height: 200,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorialContent: {
    padding: 20,
  },
  tutorialHeader: {
    marginBottom: 12,
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  tutorialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  tutorialDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  materialsSection: {
    marginBottom: 16,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  materialTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  materialTagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tutorialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  category: {
    fontSize: 14,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '500',
  },
});