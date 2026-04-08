import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RouteStatus } from '@ally-waste/shared-types';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ally Waste Worker</Text>
      <Text style={styles.subtitle}>
        Route statuses: {Object.values(RouteStatus).join(', ')}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
