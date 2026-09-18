import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: 'Catálogo Premium',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('History')} style={{ padding: 8 }}>
                <FontAwesome name="history" size={24} color={colors.accent} />
              </TouchableOpacity>
            )
          })} 
        />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Vistos Recentemente' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}