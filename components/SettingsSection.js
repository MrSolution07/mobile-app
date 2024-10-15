import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingsOption from './SettingsOptions';

const SettingsSection = ({ title, options }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {options.map((option, index) => (
        <SettingsOption
          key={index}
          icon={option.icon}
          label={option.label}
          onPress={option.onPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#075eec',
    marginBottom: 10,
  },
});

export default SettingsSection;
