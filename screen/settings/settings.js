import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, StatusBar, InteractionManager } from 'react-native';
import { BlueListItemHooks, BlueNavigationStyle, BlueHeaderDefaultSubHooks } from '../../BlueComponents';
import { useNavigation, useFocusEffect, useTheme } from '@react-navigation/native';
import loc from '../../loc';
import { Icon } from 'react-native-elements';
import * as NavigationService from '../../NavigationService';
import Biometric from '../../class/biometrics';
const BlueApp = require('../../BlueApp');

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  lockScreenButton: {
    marginHorizontal: 16,
  },
});

const Settings = () => {
  const { navigate, setOptions } = useNavigation();
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        Biometric.isBiometricUseCapableAndEnabled().then(isBiometricsEnabled => {
          BlueApp.storageIsEncrypted().then(isStorageEncrypted => {
            if (isStorageEncrypted || isBiometricsEnabled) {
              setOptions({
                headerRight: () => (
                  <TouchableOpacity style={styles.lockScreenButton} onPress={() => NavigationService.lockScreen()}>
                    <Icon name="lock" type="font-awesome5" color={colors.foregroundColor} />
                  </TouchableOpacity>
                ),
              });
            } else {
              setOptions({
                headerRight: null,
              });
            }
          });
        });
      });

      return () => task.cancel();
    }, [colors.foregroundColor, setOptions]),
  );

  return (
    <ScrollView style={styles.root}>
      <StatusBar barStyle="default" />
      <BlueHeaderDefaultSubHooks leftText={loc.settings.header} rightComponent={null} />
      <BlueListItemHooks title={loc.settings.general} component={TouchableOpacity} onPress={() => navigate('GeneralSettings')} chevron />
      <BlueListItemHooks title={loc.settings.currency} component={TouchableOpacity} onPress={() => navigate('Currency')} chevron />
      <BlueListItemHooks title={loc.settings.language} component={TouchableOpacity} onPress={() => navigate('Language')} chevron />
      <BlueListItemHooks
        title={loc.settings.encrypt_title}
        onPress={() => navigate('EncryptStorage')}
        component={TouchableOpacity}
        testID="SecurityButton"
        chevron
      />
      <BlueListItemHooks title={loc.settings.network} component={TouchableOpacity} onPress={() => navigate('NetworkSettings')} chevron />
      <BlueListItemHooks
        title={loc.settings.about}
        component={TouchableOpacity}
        onPress={() => navigate('About')}
        testID="AboutButton"
        chevron
      />
    </ScrollView>
  );
};

export default Settings;
Settings.navigationOptions = () => ({
  ...BlueNavigationStyle(),
  headerTitle: '',
});
