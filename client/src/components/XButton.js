import React from "react";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Keyboard, Butto, TouchableOpacity } from "react-native";

function XButton(props){
  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => setIsHover(true)
  const onMouseLeave = () => setIsHover(false)

  const styles = StyleSheet.create({
    // ...
    textContainer: {
      flexDirection: "row",
      height: "100%"
    },
    appButtonContainer: {
      elevation: 8,
      backgroundColor: isHover ? "#969696" : "#b5b5b5",
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 12,
      positionLeft: "20px",
      width: "32px",
      height: "29px",
      display: "flex",
      marginTop: "5px",
      marginLeft: "15px"
    },
    appButtonText: {
      fontSize: 12,
      color: "#000000",
      fontWeight: "bolder",
      alignSelf: "center",
      textTransform: "uppercase",
    },
    appButtonPlus: {
      fontSize: 16,
      color: "#000000",
      fontWeight: "bolder",
      alignSelf: "center",
      textTransform: "uppercase",
      marginLeft: "2px",
      marginBottom: "3px"
    }
  });


  const CollabButton = ({onPress, title}) => {
    return(
      <TouchableOpacity
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.appButtonContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.appButtonText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }


// styles

  return (
    <CollabButton onPress={props.onPress} title="X" />
  );

}

export default XButton;