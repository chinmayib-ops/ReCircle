import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MapPin, Navigation, Phone, Clock, Star, Search, Filter } from 'lucide-react-native';

interface Location {
  id: string;
  name: string;
  type: 'NGO' | 'Recycling Center' | 'Old Age Home' | 'School';
  address: string;
  distance: string;
  rating: number;
  phone: string;
  hours: string;
  acceptedItems: string[];
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Green Earth NGO',
    type: 'NGO',
    address: '123 Eco Street, Green District',
    distance: '0.8 km',
    rating: 4.8,
    phone: '+1 (555) 123-4567',
    hours: '9:00 AM - 6:00 PM',
    acceptedItems: ['Clothes', 'Books', 'Toys', 'Electronics'],
  },
  {
    id: '2',
    name: 'City Recycling Center',
    type: 'Recycling Center',
    address: '456 Recycle Ave, Downtown',
    distance: '1.2 km',
    rating: 4.5,
    phone: '+1 (555) 987-6543',
    hours: '8:00 AM - 5:00 PM',
    acceptedItems: ['Paper', 'Plastic', 'Metal', 'Glass'],
  },
  {
    id: '3',
    name: 'Sunset Senior Care',
    type: 'Old Age Home',
    address: '789 Care Lane, Peaceful Valley',
    distance: '2.1 km',
    rating: 4.9,
    phone: '+1 (555) 456-7890',
    hours: '10:00 AM - 4:00 PM',
    acceptedItems: ['Books', 'Games', 'Crafts', 'Clothes'],
  },
  {
    id: '4',
    name: 'Lincoln Elementary School',
    type: 'School',
    address: '321 Education Blvd, Academic Hills',
    distance: '1.7 km',
    rating: 4.6,
    phone: '+1 (555) 234-5678',
    hours: '8:00 AM - 3:00 PM',
    acceptedItems: ['Books', 'School Supplies', 'Sports Equipment'],
  },
];

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [locations] = useState<Location[]>(mockLocations);

  const filterOptions = ['All', 'NGO', 'Recycling Center', 'Old Age Home', 'School'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NGO':
        return '#10B981';
      case 'Recycling Center':
        return '#3B82F6';
      case 'Old Age Home':
        return '#F59E0B';
      case 'School':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || location.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleNavigate = (location: Location) => {
    // In a real app, this would open the device's map app
    console.log(`Navigate to ${location.name}`);
  };

  const handleCall = (phone: string) => {
    // In a real app, this would initiate a phone call
    console.log(`Call ${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Centers</Text>
        <Text style={styles.headerSubtitle}>Find donation & recycling locations</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
        {filteredLocations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <View style={styles.locationMeta}>
                  <View
                    style={[
                      styles.typeTag,
                      { backgroundColor: `${getTypeColor(location.type)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeTagText,
                        { color: getTypeColor(location.type) },
                      ]}
                    >
                      {location.type}
                    </Text>
                  </View>
                  <View style={styles.rating}>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{location.rating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.distance}>{location.distance}</Text>
            </View>

            <View style={styles.locationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.address}>{location.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.hours}>{location.hours}</Text>
              </View>
            </View>

            <View style={styles.acceptedItems}>
              <Text style={styles.acceptedItemsTitle}>Accepted Items:</Text>
              <View style={styles.itemTags}>
                {location.acceptedItems.map((item, index) => (
                  <View key={index} style={styles.itemTag}>
                    <Text style={styles.itemTagText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(location.phone)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigate(location)}
              >
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.navigateButtonText}>Navigate</Text>
              </TouchableOpacity>
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600',
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
  distance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  locationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  hours: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  acceptedItems: {
    marginBottom: 16,
  },
  acceptedItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemTagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  callButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  navigateButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});