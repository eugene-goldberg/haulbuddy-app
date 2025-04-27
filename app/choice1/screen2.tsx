import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PhotoItem {
  id: string;
  uri: string;
}

export default function Choice1Screen2() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // In a real app, this would use the device camera or image picker
  const addPhoto = () => {
    // Generate a placeholder image URL with a unique ID
    const newId = Date.now().toString();
    const placeholderUri = `https://via.placeholder.com/150?text=Cargo+${newId}`;
    
    setPhotos([...photos, { id: newId, uri: placeholderUri }]);
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos of Your Cargo</Text>
      <Text style={styles.content}>
        Adding photos helps drivers prepare for your pickup. You can add multiple photos to show the size and type of cargo.
      </Text>
      
      <ScrollView 
        style={styles.photoGrid}
        contentContainerStyle={styles.photoGridContent}
      >
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#4a80f5" />
            <Text style={styles.emptyStateText}>No photos added yet</Text>
          </View>
        ) : (
          <View style={styles.photoList}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removePhoto(photo.id)}
                >
                  <Ionicons name="close-circle" size={28} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.addPhotoButton}
        onPress={addPhoto}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.addPhotoButtonText}>Add Photo</Text>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/choice1/screen3')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/choice1/screen1')}
        >
          <Text style={styles.secondaryButtonText}>Back to Previous Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6efff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    lineHeight: 24,
  },
  photoGrid: {
    width: '100%',
    marginBottom: 20,
    maxHeight: 300,
  },
  photoGridContent: {
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 30,
    marginVertical: 20,
  },
  emptyStateText: {
    color: '#777',
    marginTop: 10,
    fontSize: 16,
  },
  photoList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  photoContainer: {
    position: 'relative',
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 0,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  addPhotoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#4a80f5',
    paddingVertical: 12,
    borderRadius: 30, // Making it more rounded to match other screens
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a80f5',
  },
  secondaryButtonText: {
    color: '#4a80f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});