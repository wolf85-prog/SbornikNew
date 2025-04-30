import { StyleSheet, View, Pressable, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
//import { Colors } from 'react-native/Libraries/NewAppScreen';
//import  { COLORS }  from '../../constants/colors.js';

type SettingsButtonProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  theme?: 'primary';
  onPress: () => void;
  isActive: boolean;
};

export default function SettingsButton({ label, theme, icon, onPress, isActive }: SettingsButtonProps) {
    // if (theme === 'primary') {
    //     return (
    //         <View
    //           style={[
    //             styles.buttonContainer,
    //             { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
    //           ]}>
    //           <Pressable
    //             style={[styles.button, { backgroundColor: '#fff' }]}
    //             onPress={() => alert('You pressed a button.')}>
    //             <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
    //             <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
    //           </Pressable>
    //         </View>
    //     );
    // }

    return (
      <TouchableOpacity style={styles.settingButton} onPress={onPress}>
        <View style={styles.titleWrapper}>
          {/* <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
            <Text style={styles.buttonLabel}>{label}</Text>
          </Pressable> */}
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color='#000' 
          />
          <Text style={styles.title}>{label}</Text>
        </View>
        <MaterialCommunityIcons 
          name={isActive ? "check-circle" : "checkbox-blank-circle-outline"} 
          size={20}
          color={isActive ? '#774388' : '#000'}
        />
      </TouchableOpacity>      
    );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20, 
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
});