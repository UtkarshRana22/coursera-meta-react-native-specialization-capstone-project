import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
    KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import colors from '../../../constants/colors';
import useAuthStore from '../../../store/authStore';

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'-]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function OnboardingFlow() {
    const db = useSQLiteContext();
    const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const isValid = NAME_REGEX.test(name.trim()) && EMAIL_REGEX.test(email.trim());

    const onNext = async () => {
        if (!isValid || saving) return;
        setSaving(true);
        try {
            await db.runAsync('DELETE FROM USER');
            await db.runAsync(
                'INSERT INTO USER (name, email, phone, address, postal_code, image) VALUES (?,?,?,?,?,?)',
                [name.trim(), email.trim(), '', '', '', '']
            );
            await completeOnboarding();
        } catch (e: any) {
            Alert.alert('Error', 'Something went wrong - ' + e.message);
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Welcome to Little Lemon</Text>
                        <Text style={styles.heroSub}>Let's get to know you</Text>
                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="John"
                            autoCorrect={false}
                            textContentType="givenName"
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                        />
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.btn, !isValid && styles.btnDisabled]}
                            disabled={!isValid || saving}
                            onPress={onNext}
                            accessibilityState={{ disabled: !isValid }}
                        >
                            <Text style={styles.btnTxt}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.secondaryGrey },
    header: { backgroundColor: 'white', paddingVertical: 10 },
    logo: { height: 60, width: '100%', resizeMode: 'contain' },
    hero: { backgroundColor: colors.primary, paddingVertical: 50, alignItems: 'center' },
    heroTitle: { color: colors.secondary, fontSize: 28, fontWeight: 'bold' },
    heroSub: { color: colors.secondaryGrey, fontSize: 18, marginTop: 8 },
    form: { padding: 24, flex: 1 },
    label: { fontSize: 18, color: colors.primary, marginTop: 16, marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: colors.primary, borderRadius: 8,
        backgroundColor: 'white', padding: 12, fontSize: 16
    },
    footer: { padding: 24, alignItems: 'flex-end' },
    btn: {
        backgroundColor: colors.secondary, borderRadius: 8,
        paddingVertical: 12, paddingHorizontal: 36
    },
    btnDisabled: { opacity: 0.4 },
    btnTxt: { fontSize: 18, fontWeight: 'bold', color: colors.secondaryDark }
});

export default OnboardingFlow;
