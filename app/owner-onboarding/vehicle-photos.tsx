import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { PhotoItem, validateVehiclePhotos } from '../../utils/validation';

export default function VehiclePhotosScreen() {
  const { user } = useAuth();
  const { vehiclePhotos, updateVehiclePhotos } = useOnboarding();
  const [photos, setPhotos] = useState<PhotoItem[]>(vehiclePhotos || []);

  const photoTypes = [
    { id: 'front', label: 'Front View', icon: 'car-front' },
    { id: 'back', label: 'Back View', icon: 'car-back' },
    { id: 'side', label: 'Side View', icon: 'car-side' },
    { id: 'cargo', label: 'Cargo Area', icon: 'car-traction-control' },
    { id: 'interior', label: 'Interior', icon: 'car-seat' },
  ];

  // In a real app, this would use a camera or image picker library
  const addPhoto = (type: string) => {
    // Generate a placeholder image URL with a unique ID
    const newId = `${type}-${Date.now().toString()}`;
    const placeholderUri = `https://via.placeholder.com/300?text=${type}`;
    
    // Check if a photo of this type already exists
    const existingIndex = photos.findIndex(photo => photo.type === type);
    
    if (existingIndex !== -1) {
      // Replace the existing photo
      const updatedPhotos = [...photos];
      updatedPhotos[existingIndex] = { id: newId, type, uri: placeholderUri };
      setPhotos(updatedPhotos);
    } else {
      // Add new photo
      setPhotos([...photos, { id: newId, type, uri: placeholderUri }]);
    }
  };

  // Update the onboarding context whenever photos change
  useEffect(() => {
    updateVehiclePhotos(photos);
  }, [photos]);

  const removePhoto = (id: string) => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove this photo?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            setPhotos(photos.filter(photo => photo.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  const getPhotoByType = (type: string) => {
    return photos.find(photo => photo.type === type);
  };

  const handleContinue = () => {
    // Validate that we have at least 3 photos
    const validationResult = validateVehiclePhotos(photos);
    if (!validationResult.isValid) {
      Alert.alert('More Photos Needed', validationResult.message);
      return;
    }
    
    router.push('/owner-onboarding/pricing');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Vehicle Photos</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 2 of 3</Text>
          </View>
        </View>

        <Text style={styles.sectionDescription}>
          Add clear photos of your vehicle to help customers make informed decisions.
        </Text>

        <View style={styles.photosContainer}>
          {photoTypes.map((photoType) => {
            const photo = getPhotoByType(photoType.id);
            return (
              <View key={photoType.id} style={styles.photoCard}>
                <Text style={styles.photoTypeLabel}>{photoType.label}</Text>
                
                {photo ? (
                  <View style={styles.uploadedPhotoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.uploadedPhoto} />
                    <TouchableOpacity 
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(photo.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff3b30" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.retakeButton}
                      onPress={() => addPhoto(photoType.id)}
                    >
                      <Text style={styles.retakeButtonText}>Retake</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.photoPlaceholder}
                    onPress={() => addPhoto(photoType.id)}
                  >
                    <FontAwesome5 name={photoType.icon as any} size={34} color="#aaa" />
                    <View style={styles.addIconContainer}>
                      <Ionicons name="add-circle" size={24} color="#4a80f5" />
                    </View>
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>
            <Ionicons name="bulb-outline" size={18} color="#4a80f5" /> Photography Tips
          </Text>
          <Text style={styles.tipText}>• Take photos in good lighting</Text>
          <Text style={styles.tipText}>• Make sure your vehicle is clean</Text>
          <Text style={styles.tipText}>• Capture the entire vehicle in frame</Text>
          <Text style={styles.tipText}>• Show the cargo area with doors open</Text>
          <Text style={styles.tipText}>• Interior shots should show seating and dash</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              photos.length < 3 && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={photos.length < 3}
          >
            <Text style={styles.continueButtonText}>
              {photos.length < 3 ? 'Add at least 3 photos to continue' : 'Continue'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backArrow: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  stepIndicator: {
    paddingHorizontal: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#4a80f5',
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  photosContainer: {
    marginBottom: 20,
  },
  photoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  photoPlaceholder: {
    height: 160,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  addPhotoText: {
    fontSize: 14,
    color: '#4a80f5',
    marginTop: 8,
  },
  uploadedPhotoContainer: {
    position: 'relative',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#e6f2ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#a0b3e0',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: '600',
  },
});