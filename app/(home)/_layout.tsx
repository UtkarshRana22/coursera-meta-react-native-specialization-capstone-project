import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useAuthStore from '../../store/authStore';
import { useEffect, useState } from 'react';
import React from 'react';
import OnboardingFlow from './(modal)/onboarding-flow';
import { SQLiteProvider } from 'expo-sqlite';

export default function Layout() {

    const { loaded, isOnboarded, load } = useAuthStore();
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        load();
    }, []);

    if (!loaded) {
        return null;
    } else {
        return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <SQLiteProvider
                        databaseName={'little-lemon.db'}
                        onInit={async (db) => {
                            try {
                                await db.execAsync(
                                    `
                            PRAGMA journal_mode = WAL;
                            CREATE TABLE IF NOT EXISTS USER 
                            (
                            id INTEGER PRIMARY KEY NOT NULL, 
                            name TEXT NOT NULL, 
                            email TEXT NOT NULL,
                            phone TEXT NOT NULL,
                            address TEXT NOT NULL,
                            postal_code TEXT NOT NULL,
                            image TEXT NOT NULL
                            );
                            CREATE TABLE IF NOT EXISTS CATEGORIES 
                            (
                            id INTEGER PRIMARY KEY NOT NULL, 
                            name TEXT NOT NULL,
                            checked BOOLEAN NOT NULL
                            );
                            CREATE TABLE IF NOT EXISTS DISHES
                            (
                            id INTEGER PRIMARY KEY NOT NULL,
                            name TEXT NOT NULL,
                            description TEXT NOT NULL,
                            price FLOAT NOT NULL,
                            photo TEXT NOT NULL,
                            reference_name TEXT NOT NULL,
                            category_id INTEGER NOT NULL
                            );
                            `
                                );
                                setDbReady(true);

                            } catch (e) {
                                console.log('Database initialization error:', e);
                            }
                        }}
                        options={{ useNewConnection: true }}
                    >
                        {
                            dbReady ? (isOnboarded ? (
                                <Stack>
                                    <Stack.Screen name="index" initialParams={{ dbReady }} />
                                    <Stack.Screen name="(modal)/filter"
                                        options={{
                                            presentation: 'modal',
                                            headerTitle: 'Filter',
                                            headerShadowVisible: false,
                                            headerStyle: {
                                                backgroundColor: 'transparent'
                                            }
                                        }} />
                                    <Stack.Screen name='(modal)/cart'
                                        options={{
                                            presentation: 'fullScreenModal',
                                            headerTitle: 'Cart'
                                        }}
                                    />
                                    <Stack.Screen name="(modal)/location-search"
                                        options={{
                                            presentation: 'modal',
                                            headerTitle: 'Location Search'
                                        }}
                                    >
                                    </Stack.Screen>
                                    <Stack.Screen name="(modal)/details"
                                        options={{
                                            presentation: 'modal',
                                            headerTitle: 'Details'
                                        }}
                                    >
                                    </Stack.Screen>
                                    <Stack.Screen name="(modal)/account"
                                        initialParams={{ dbReady: dbReady }}
                                        options={{
                                            presentation: 'modal',
                                            headerTitle: 'Profile'
                                        }}
                                    >
                                    </Stack.Screen>
                                </Stack>
                            ) : (
                                <OnboardingFlow />
                            )) : null
                        }
                    </SQLiteProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        )
    }

}