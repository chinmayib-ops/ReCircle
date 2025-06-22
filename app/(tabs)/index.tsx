import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { Heart, X, Recycle, Gift } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;

interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  distance: string;
  ecoPoints: number;
}

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Vintage Wooden Chair',
    description: 'Beautiful vintage chair, needs minor repairs. Perfect for upcycling!',
    image: 'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Furniture',
    condition: 'Good',
    distance: '0.5 km away',
    ecoPoints: 50,
  },
  {
    id: '2',
    title: 'Children\'s Books Collection',
    description: 'Set of 20 children\'s books in excellent condition. Great for donation!',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    condition: 'Excellent',
    distance: '1.2 km away',
    ecoPoints: 30,
  },
  {
    id: '3',
    title: 'Electric Guitar',
    description: 'Unused electric guitar, few scratches but works perfectly.',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Music',
    condition: 'Good',
    distance: '2.1 km away',
    ecoPoints: 80,
  },
];

export default function Index() {
  const [showHome, setShowHome] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPoints, setUserPoints] = useState(450);
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        forceSwipe('right');
      } else if (gesture.dx < -120) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? width : -width;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setUserPoints(prev => prev + mockItems[currentIndex].ecoPoints);
    }

    setCurrentIndex(prev => (prev + 1) % mockItems.length);
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-width * 1.5, 0, width * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCard = (item: Item, index: number) => {
    if (index < currentIndex) return null;

    const cardView = (
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.pointsBadge}>
            <Recycle size={16} color="#10B981" />
            <Text style={styles.pointsText}>{item.ecoPoints} pts</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.condition}>{item.condition}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
    );

    if (index === currentIndex) {
      return (
        <Animated.View
          key={item.id}
          style={[styles.card, getCardStyle()]}
          {...panResponder.panHandlers}
        >
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          {cardView}
        </Animated.View>
      );
    }

    return (
      <View key={item.id} style={[styles.card, { opacity: 0.8, transform: [{ scale: 0.95 }] }]}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        {cardView}
      </View>
    );
  };

  if (!showHome) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>
            Reduce. Reuse. <Text style={styles.green}>ReCircle</Text>.
          </Text>
          <Text style={styles.subtitle}>
            Join the circular revolution and make sustainability a lifestyle.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowHome(true)}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Eco Warrior! 🌱</Text>
          <Text style={styles.subtitle}>Find items to reuse & donate</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{userPoints}</Text>
          <Text style={styles.pointsLabel}>Eco Points</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        {mockItems.map((item, index) => renderCard(item, index)).reverse()}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={() => forceSwipe('left')}
        >
          <X size={32} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.donateButton]}
          onPress={() => forceSwipe('right')}
        >
          <Gift size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <Heart size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe right to donate • Swipe left to skip
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
  },
  innerContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  green: {
    color: '#2ecc71',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsContainer: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  points: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#065F46',
    marginTop: 2,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
  },
  cardImage: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  cardDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
  condition: {
    fontSize: 14,
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: '#7C2D12',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  donateButton: {
    backgroundColor: '#10B981',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  likeButton: {
    backgroundColor: '#EF4444',
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
