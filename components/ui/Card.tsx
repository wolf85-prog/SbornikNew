import { View, ViewStyle } from 'react-native';

interface CardProps extends React.PropsWithChildren {
    style?: ViewStyle;
  };

export default function Card({ children, style={} }: CardProps) {
    return (
        <View style={{
            //height: 80,
            padding: 15,
            borderRadius: 15,
            backgroundColor: "white",
            elevation: 8,
            shadowColor: "#000",
            shadowRadius: 8,
            shadowOffset: {height: 6, width: 0},
            shadowOpacity: 0.15,
            //marginTop: 15,
            // height: 80,
            ...style,
            }}
        >
            {children}
        </View>
    )
}