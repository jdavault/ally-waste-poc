import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { Route, RouteStop, RouteStopStatus } from '@ally-waste/shared-types';
import { ChevronRight, Home, CheckCircle2, AlertCircle, XCircle, MapPin } from 'lucide-react-native';

export default function RouteDetailScreen({ route, navigation }: any) {
  const { routeId } = route.params;

  const { data: routeData, isLoading } = useQuery<{ route: Route, stops: RouteStop[] }>({
    queryKey: ['routes', routeId, 'stops'],
    queryFn: async () => {
      const route = await apiFetch<Route>(`/routes/${routeId}`);
      const stops = await apiFetch<RouteStop[]>(`/routes/${routeId}/stops`);
      return { route, stops };
    },
  });

  const stops = routeData?.stops || [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7EB141" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Stop Hierarchy</Text>
          <Text style={styles.count}>{stops.length} Total</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.subtitle}>Sequence optimized for logistics</Text>
        </View>
      </View>

      <FlatList
        data={stops.sort((a, b) => a.sequence - b.sequence)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.stopCard}
            onPress={() => navigation.navigate('StopDetail', { stopId: item.id })}
            activeOpacity={0.7}
          >
            <View style={styles.stopSeq}>
              <Text style={styles.seqText}>#{item.sequence}</Text>
            </View>
            
            <View style={styles.stopInfo}>
              <View style={styles.row}>
                <Home size={16} color="#64748B" />
                <Text style={styles.unitText}>Unit {item.unitId.substring(0, 4).toUpperCase()}</Text>
              </View>
              <View style={[styles.row, { marginTop: 4 }]}>
                <MapPin size={12} color="#94A3B8" />
                <Text style={styles.bldText}>Building Bld-{item.buildingId.substring(0, 4)}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              {item.status === RouteStopStatus.COMPLETED && <CheckCircle2 size={20} color="#10B981" />}
              {item.status === RouteStopStatus.ISSUE && <AlertCircle size={20} color="#F59E0B" />}
              {item.status === RouteStopStatus.MISSED && <XCircle size={20} color="#EF4444" />}
              {item.status === RouteStopStatus.PENDING && <ChevronRight size={20} color="#CBD5E1" />}
            </View>
          </TouchableOpacity>
        )}
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
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#101A30',
  },
  count: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  progressInfo: {
    marginTop: 5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  list: {
    padding: 15,
  },
  stopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  stopSeq: {
    width: 40,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  seqText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#94A3B8',
  },
  stopInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101A30',
  },
  bldText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  statusContainer: {
    width: 30,
    alignItems: 'center',
  }
});
