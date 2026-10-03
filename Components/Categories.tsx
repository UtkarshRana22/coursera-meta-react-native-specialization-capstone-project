import { Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import categoriesData from '../assets/data/data.json';
import colors from '../constants/colors';
import { useSQLiteContext } from 'expo-sqlite';
import useDbStore from '../store/dbStore';

interface Category {
    id: number,
    name: string,
    checked?: boolean
}

const Categories = (props) => {

    const { dbReady } = props;
    const db = useSQLiteContext();
    const [categories, setCategories] = useState(null);
    const { setCategoriesReady, setSelectedCategory, selectedCategory } = useDbStore();


    useEffect(() => {
        if (!dbReady) return;
        let isMounted = true;

        const getCategories = async () => {
            try {
                const result = await db.getAllAsync<Category>(`SELECT * FROM CATEGORIES`);
                if (isMounted && result && result.length > 0) {
                    setCategories(result);
                    setCategoriesReady(true);
                } else if (isMounted && result && result.length === 0) {
                    insertCategories();
                }
            } catch (e) {
                setCategoriesReady(false);
                console.log('CATEGORY DB ERROR -', e);
            } finally {
                console.log('CATEGORY DB SUCCESS');
            }
        }

        getCategories();

        return () => {
            isMounted = false;
        };

    }, [dbReady]);


    const insertCategories = async () => {
        try {

            const categoriesJSON = categoriesData;

            await db.execAsync('BEGIN TRANSACTION');

            const stmt = await db.prepareAsync(
                'INSERT INTO CATEGORIES (name, checked) VALUES (?,?)'
            );

            for (const category of categoriesJSON) {
                await stmt.executeAsync([category.name, category.checked]);
            }

            await db.execAsync('COMMIT');

            const result = await db.getAllAsync<Category>('SELECT * FROM CATEGORIES');
            if (result.length > 0) {
                setCategories(result);
                setCategoriesReady(true);
            }
        } catch (e) {
            setCategoriesReady(false);
            Alert.alert('Error', ' Something went wrong - ' + e.message);
        } finally {
            console.log('CATEGORY TABLE ENTRY SUCCESS');
        }
    }


    return (
        <ScrollView horizontal={true} style={styles.scrollViewContainer} showsHorizontalScrollIndicator={false}>
            {
                (categories && categories.length > 0) &&
                categories.map((category, index) => (
                    <TouchableOpacity key={index} style={(selectedCategory === category.id) ? styles.selectedCategoryBtn : styles.categoryBtn} onPress={() => {
                        setSelectedCategory(category.id)
                    }}>
                        <Text style={styles.categoryBtnTxt}>{category.name}</Text>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        maxHeight: 50,
        backgroundColor: 'white',
        alignContent: 'center',
        margin: 5
    },
    categoryBtn: {
        backgroundColor: colors.secondaryGrey,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        borderRadius: 15
    },
    selectedCategoryBtn: {
        backgroundColor: colors.secondary,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        borderRadius: 15
    },
    categoryBtnTxt: {
        fontSize: 16,
    }
});

export default Categories