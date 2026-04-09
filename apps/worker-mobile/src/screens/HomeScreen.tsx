import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useOfflineStore } from '../store/offlineStore';
import { Route, RouteStatus } from '@ally-waste/shared-types';
import { MapPin, Route as RouteIcon, Clock, RefreshCcw, LogOut, ChevronRight } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const { workerId, workerName, clearWorker } = useAuthStore();
  const { outbox } = useOfflineStore();

  const { data: routeData, isLoading, refetch } = useQuery<{ route: Route, stops: any[] }>({
    queryKey: ['workers', workerId, 'today-route'],
    queryFn: () => apiFetch<{ route: Route, stops: any[] }>(`/workers/${workerId}/today-route`),
    enabled: !!workerId,
  });

  const route = routeData?.route;
  const stops = routeData?.stops || [];

  const completedStops = stops.filter((s: any) => s.status !== 'PENDING').length;
  const totalStops = stops.length;
  const progress = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

  const handleLogout = () => {
    clearWorker();
  };

  const handleStartRoute = async () => {
    if (!route) return;
    try {
      await apiFetch(`/routes/${route.id}/start`, { method: 'POST' });
      refetch();
    } catch (error) {
      console.error('Failed to start route', error);
    }
  };

  const handleSyncNow = () => {
    SyncService.syncOutbox();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View>
            <Text style={styles.welcome}>Good Morning,</Text>
            <Text style={styles.name}>{workerName}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        {/* Sync Status Card */}
        <TouchableOpacity 
          onPress={handleSyncNow}
          style={[styles.syncCard, outbox.length > 0 ? styles.syncPending : styles.syncClean]}
          activeOpacity={0.7}
        >
          <View style={styles.syncInfo}>
            <RefreshCcw color={outbox.length > 0 ? '#B45309' : '#059669'} size={20} />
            <Text style={[styles.syncText, outbox.length > 0 ? styles.syncTextPending : styles.syncTextClean]}>
              {outbox.length > 0 ? `${outbox.length} actions waiting to sync` : 'All data synchronized'}
            </Text>
          </View>
          <View style={styles.refreshBtn}>
            <RefreshCcw color="#64748B" size={16} />
          </View>
        </TouchableOpacity>

        {/* Today's Route Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Assignment</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color="#7EB141" style={{ marginTop: 20 }} />
        ) : route ? (
          <View style={styles.routeContainer}>
            <TouchableOpacity 
              style={styles.routeCard}
              onPress={() => navigation.navigate('RouteDetail', { routeId: route.id })}
              activeOpacity={0.9}
            >
              <View style={styles.routeHeader}>
                <View style={[styles.statusBadge, route.status === RouteStatus.COMPLETED ? styles.bgSuccess : styles.bgInfo]}>
                  <Text style={styles.statusText}>{route.status}</Text>
                </View>
                <Text style={styles.routeDate}>{new Date(route.serviceDate).toLocaleDateString()}</Text>
              </View>

              <View style={styles.routeMain}>
                <View style={styles.routeIconBox}>
                  <RouteIcon color="#7EB141" size={32} />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.propertyLabel}>Service Location</Text>
                  <Text style={styles.propertyName}>Property Asset {route.propertyId.substring(0, 8).toUpperCase()}</Text>
                  <View style={styles.stopCount}>
                    <MapPin color="#94A3B8" size={14} />
                    <Text style={styles.stopText}>{stops.length} Stops Scheduled</Text>
                  </View>
                </View>
                <ChevronRight color="#CBD5E1" size={24} />
              </View>

              <View style={styles.routeFooter}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>
            </TouchableOpacity>

            {route.status === RouteStatus.PENDING && (
              <TouchableOpacity 
                style={styles.startBtn} 
                onPress={handleStartRoute}
                activeOpacity={0.8}
              >
                <Text style={styles.startBtnText}>Start Service Route</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Clock color="#CBD5E1" size={48} />
            <Text style={styles.emptyTitle}>No Route Assigned</Text>
            <Text style={styles.emptySubtitle}>Check back later or contact dispatch if you believe this is an error.</Text>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#F59E0B' }]}>0</Text>
            <Text style={styles.statLabel}>Issues</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F5',
  },
  scroll: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  welcome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#101A30',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
  },
  syncPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  syncClean: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncText: {
    fontSize: 13,
    fontWeight: '700',
  },
  syncTextPending: {
    color: '#B45309',
  },
  syncTextClean: {
    color: '#059669',
  },
  refreshBtn: {
    padding: 5,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#101A30',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bgSuccess: { backgroundColor: '#D1FAE5' },
  bgInfo: { backgroundColor: '#DBEAFE' },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#101A30',
  },
  routeDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  routeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeIconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  propertyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#101A30',
    marginVertical: 2,
  },
  stopCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  routeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F3F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7EB141',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  routeContainer: {
    gap: 15,
  },
  startBtn: {
    backgroundColor: '#7EB141',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7EB141',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#101A30',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginTop: 2,
  }
});
