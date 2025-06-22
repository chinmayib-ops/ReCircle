import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Recycle } from 'lucide-react-native';

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

interface SwipeCardProps {
  item: Item;
}

export default function SwipeCard({ item }: SwipeCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.pointsBadge}>
            <Recycle size={16} color="#10B981" />
            <Text style={styles.pointsText}>{item.ecoPoints} pts</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.meta}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.condition}>{item.condition}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
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
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  meta: {
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
});