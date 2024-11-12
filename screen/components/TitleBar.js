import { StyleSheet, Text, View } from "react-native";

const TitleBar = ({ title }) => (
    <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    titleBar: {
        padding: 15,
        
    },
    title: {
        fontSize: 32,
        color: "#8f8f8f",
        fontWeight: "bold",
        
       
    },
});

export default TitleBar;