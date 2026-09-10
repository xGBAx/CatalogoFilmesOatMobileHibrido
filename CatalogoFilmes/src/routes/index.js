import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Catálogo de Filmes' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}