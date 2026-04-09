import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Worker } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { User, ChevronRight } from 'lucide-react-native';

export default function LoginScreen() {
  const { setWorker } = useAuthStore();
  
  const { data: workers, isLoading } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => apiFetch<Worker[]>('/workers'),
  });

  const handleSelect = (worker: Worker) => {
    setWorker(worker.id, worker.name);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7EB141" />
        <Text style={styles.loadingText}>Loading operators...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandAlly}>Ally <Text style={styles.brandWaste}>Waste</Text></Text>
        <Text style={styles.subtitle}>Select your operator profile to begin</Text>
      </View>

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <User color="#101A30" size={24} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>{item.vehicleType || 'Standard Truck'}</Text>
              </View>
              <ChevronRight color="#CBD5E1" size={20} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No operators found. Check your API connection.</Text>
          </View>
        }
      />
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
    padding: 20,
  },
  header: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#101A30',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  brandAlly: {
    fontSize: 32,
    fontWeight: '900',
    color: '#7EB141',
  },
  brandWaste: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F1F3F5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#101A30',
  },
  details: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  }
});
