import { Modal, SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import React, { useRef, useState } from "react";

const PopupMenu = (options) => {
    const [visible, setVisible] = useState(false)
    const scale = useRef(new Animated.Value(0)).current
    function resizeBox(to) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear,
        }).start(()=>to === 0 && setVisible(false))
    }
    
    return (
        <>
            <TouchableOpacity
                onPress={()=>resizeBox(1)}
                style={{marginRight: 10}}
            >
                <Entypo name="dots-three-vertical" size={22} color={options.color} />
            </TouchableOpacity>

            <Modal transparent visible={visible}>
                <SafeAreaView style={{flex: 1}} onTouchStart={()=> resizeBox(0)}>
                    <Animated.View style={[
                        styles.popup, 
                        {
                            padding: 10
                        },
                        // {
                        //     opacity: scale.interpolate({inputRange: [0,1], outputRange: [0,1]}),
                        // },
                        // {
                        //     transform: [{scale}],
                        // }
                        ]}>
                        {options.options.map((op, i)=> (
                            <TouchableOpacity style={[styles.option]} key={i} onPress={op.action}>
                                <Text style={styles.text}>{op.title}</Text>
                                {/* <Icon name="" size="" color="" /> */}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
        
    );
};

const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 0.2,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 15,
        right: 15,
        width: 220
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 16
    }
})

export default PopupMenu;