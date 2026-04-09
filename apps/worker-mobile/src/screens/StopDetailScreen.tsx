import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, TextInput, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { apiFetch } from '../api/client';
import { useOfflineStore } from '../store/offlineStore';
import {
  Building,
  Property,
  RouteStop,
  getProximityResult,
} from '@ally-waste/shared-types';
import { CheckCircle2, XCircle, AlertTriangle, Camera, MapPin, ChevronLeft, House } from 'lucide-react-native';

export default function StopDetailScreen({ route, navigation }: any) {
  const { stopId } = route.params;
  const { addAction } = useOfflineStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  const { data: stop, isLoading } = useQuery<RouteStop>({
    queryKey: ['stops', stopId],
    queryFn: () => apiFetch<RouteStop>(`/route-stops/${stopId}`),
  });

  const { data: building } = useQuery<Building>({
    queryKey: ['buildings', stop?.buildingId],
    queryFn: () => apiFetch<Building>(`/buildings/${stop?.buildingId}`),
    enabled: !!stop?.buildingId,
  });

  const { data: property } = useQuery<Property>({
    queryKey: ['properties', building?.propertyId],
    queryFn: () => apiFetch<Property>(`/properties/${building?.propertyId}`),
    enabled: !!building?.propertyId,
  });

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCurrentPosition() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!active) {
          return;
        }

        setCurrentPosition({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.warn('Unable to load current position for proximity', error);
      }
    }

    loadCurrentPosition();

    return () => {
      active = false;
    };
  }, []);

  const proximity = getProximityResult(
    currentPosition,
    building ? { lat: building.lat, lng: building.lng } : null,
  );

  const handleAction = async (type: 'COMPLETE_STOP' | 'MISS_STOP' | 'REPORT_ISSUE') => {
    setIsProcessing(true);
    try {
      // 1. Capture Location
      let location = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        }
      } catch (e) {
        console.warn('Location capture failed', e);
      }

      // 2. Save to Offline Outbox
      addAction({
        type,
        stopId,
        timestamp: new Date().toISOString(),
        lat: location?.coords.latitude,
        lng: location?.coords.longitude,
        notes: notes || undefined,
        issueCode: type === 'REPORT_ISSUE' ? 'GENERAL_ISSUE' : undefined
      });

      // 4. Optimistic UI Update (optional but good)
      Alert.alert('Action Saved', 'Action has been queued and will sync automatically.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to process action');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator color="#7EB141" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <ChevronLeft color="#101A30" size={16} />
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.8}>
            <House color="#101A30" size={16} />
            <Text style={styles.navBtnText}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.unitLabel}>Unit Details</Text>
          <Text style={styles.unitNumber}>Unit {stop?.unitId.substring(0, 4).toUpperCase() || '####'}</Text>
          <Text style={styles.propertyName}>{property?.name || 'Loading service location...'}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#94A3B8" />
            <Text style={styles.locationText}>
              {building ? `${building.name} • ${property?.address ?? 'Loading address...'}` : 'Loading building details...'}
            </Text>
          </View>
          {building?.accessNotes ? (
            <Text style={styles.accessNotes}>{building.accessNotes}</Text>
          ) : null}
          <View style={styles.proximityCard}>
            <Text style={styles.proximityLabel}>Current proximity</Text>
            <Text style={styles.proximityValue}>
              {proximity
                ? `${proximity.label} • ${proximity.distanceMiles} mi`
                : 'Checking position...'}
            </Text>
            <Text style={styles.proximityHint}>
              Uses current device GPS compared to the target building location.
            </Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Select Action</Text>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.completeBtn]} 
            onPress={() => handleAction('COMPLETE_STOP')}
            disabled={isProcessing}
          >
            <CheckCircle2 color="#fff" size={24} />
            <Text style={styles.actionBtnText}>Mark Completed</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.missedBtn, { flex: 1 }]} 
              onPress={() => handleAction('MISS_STOP')}
              disabled={isProcessing}
            >
              <XCircle color="#fff" size={20} />
              <Text style={styles.actionBtnText}>Missed</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.issueBtn, { flex: 1 }]} 
              onPress={() => handleAction('REPORT_ISSUE')}
              disabled={isProcessing}
            >
              <AlertTriangle color="#fff" size={20} />
              <Text style={styles.actionBtnText}>Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Service Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Add any specific details or issue descriptions..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
          <TouchableOpacity style={styles.photoBtn}>
            <Camera color="#64748B" size={20} />
            <Text style={styles.photoBtnText}>Attach Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {isProcessing && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Capturing GPS...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 20,
  },
  navActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#101A30',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  unitLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  unitNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#101A30',
    marginVertical: 5,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101A30',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  accessNotes: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
  proximityCard: {
    marginTop: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  proximityLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  proximityValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '900',
    color: '#101A30',
  },
  proximityHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 18,
  },
  actionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#101A30',
    textTransform: 'uppercase',
    marginBottom: 15,
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 18,
    gap: 10,
    marginBottom: 12,
  },
  completeBtn: {
    backgroundColor: '#10B981',
  },
  missedBtn: {
    backgroundColor: '#EF4444',
  },
  issueBtn: {
    backgroundColor: '#F59E0B',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  notesSection: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: '#101A30',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 15,
    padding: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    borderRadius: 15,
  },
  photoBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 26, 48, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlayText: {
    color: '#fff',
    marginTop: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  }
});
