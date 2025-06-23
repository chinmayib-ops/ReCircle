import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import {
  Camera,
  FlipHorizontal,
  Scan,
  CircleCheck as CheckCircle,
  Circle as XCircle,
  Lightbulb,
  Upload,
  ImageIcon,
} from 'lucide-react-native';

interface DetectionResult {
  item: string;
  recyclable: boolean;
  reusable: boolean;
  confidence: number;
  suggestions: string[];
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<DetectionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const takePictureAndDetect = async () => {
    if (!cameraRef.current) return;

    setIsScanning(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });

      setSelectedImage(photo.uri);

      const backendResult = await sendToBackend(photo.uri);

      if (backendResult) {
        setDetectionResult(backendResult);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture or process image.');
      console.error('Camera capture error:', error);
    }

    setIsScanning(false);
  };

  const sendToBackend = async (uri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const fileUri = fileInfo.uri;
    const formData = new FormData();

    formData.append('file', {
      uri: fileUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await axios.post(
        'http://localhost:8000/detect/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to get detection result.');
      return null;
    }
  };

  // Mock detection results for demo
  const mockDetections: { [key: string]: DetectionResult } = {
    bottle: {
      item: 'Plastic Bottle',
      recyclable: true,
      reusable: true,
      confidence: 0.95,
      suggestions: [
        'Recycle at nearest plastic collection center',
        'Reuse as plant watering container',
        'Create a bird feeder',
        'Use for storage organization',
      ],
    },
    chair: {
      item: 'Wooden Chair',
      recyclable: false,
      reusable: true,
      confidence: 0.88,
      suggestions: [
        'Donate to local charity',
        'Upcycle with new paint',
        'Convert to plant stand',
        'Repurpose as decorative piece',
      ],
    },
    book: {
      item: 'Books',
      recyclable: true,
      reusable: true,
      confidence: 0.92,
      suggestions: [
        'Donate to library or school',
        'Share with book exchange',
        'Create art projects with pages',
        'Recycle if damaged beyond repair',
      ],
    },
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={80} color="#10B981" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need camera access to scan and identify items for recycling and
            reuse suggestions.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const simulateDetection = () => {
    setIsScanning(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const items = Object.keys(mockDetections);
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setDetectionResult(mockDetections[randomItem]);
      setIsScanning(false);
    }, 2000);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to select images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        setIsScanning(true);

        const backendResult = await sendToBackend(imageUri);

        if (backendResult) {
          setDetectionResult(backendResult);
        }

        setIsScanning(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick or process image.');
      console.error('Image picker error:', error);
      setIsScanning(false);
    }
  };

  const resetDetection = () => {
    setDetectionResult(null);
    setSelectedImage(null);
  };

  if (detectionResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Detection Result</Text>
              <TouchableOpacity
                onPress={resetDetection}
                style={styles.closeButton}
              >
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
                <Text style={styles.imageLabel}>Analyzed Image</Text>
              </View>
            )}

            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{detectionResult.item}</Text>
              <Text style={styles.confidence}>
                Confidence: {Math.round(detectionResult.confidence * 100)}%
              </Text>

              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  {detectionResult.recyclable ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: detectionResult.recyclable
                          ? '#10B981'
                          : '#EF4444',
                      },
                    ]}
                  >
                    {detectionResult.recyclable
                      ? 'Recyclable'
                      : 'Not Recyclable'}
                  </Text>
                </View>

                <View style={styles.statusItem}>
                  {detectionResult.reusable ? (
                    <CheckCircle size={20} color="#3B82F6" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: detectionResult.reusable ? '#3B82F6' : '#EF4444',
                      },
                    ]}
                  >
                    {detectionResult.reusable ? 'Reusable' : 'Not Reusable'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.suggestionsCard}>
              <View style={styles.suggestionsHeader}>
                <Lightbulb size={24} color="#F59E0B" />
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
              </View>

              {detectionResult.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <View style={styles.suggestionBullet} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  Find Nearby Centers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={resetDetection}
              >
                <Text style={styles.secondaryButtonText}>
                  Scan Another Item
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Object Scanner</Text>
        <Text style={styles.headerSubtitle}>
          Point camera at item to scan or upload image
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            {isScanning && (
              <View style={styles.scanningOverlay}>
                <View style={styles.scanningIndicator}>
                  <Scan size={40} color="#10B981" />
                  <Text style={styles.scanningText}>Analyzing...</Text>
                </View>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <FlipHorizontal size={24} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
          onPress={takePictureAndDetect}
          disabled={isScanning}
        >
          {isScanning ? (
            <Text style={styles.scanButtonText}>Scanning...</Text>
          ) : (
            <>
              <Scan size={28} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>Scan Item</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={pickImage}
          disabled={isScanning}
        >
          <Upload size={24} color={isScanning ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            isScanning && styles.uploadButtonDisabled,
          ]}
          onPress={pickImage}
          disabled={isScanning}
        >
          <ImageIcon size={20} color="#10B981" />
          <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Position item within the frame and tap scan, or upload an image from
          your gallery
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#F9FAFB',
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#10B981',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
  },
  scanningText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  uploadButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  uploadButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructions: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  imagePreview: {
    marginHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  imageLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  confidence: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  suggestionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginTop: 8,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
