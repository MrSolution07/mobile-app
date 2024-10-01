import React from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

// Component to render each slide
const Slide = ({ item, scrollX, index }) => {
  // const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  // const scale = scrollX.interpolate({
  //   inputRange,
  //   outputRange: [0.8, 1, 0.8],
  //   extrapolate: 'clamp',
  // });

  return (
    <View style={[tw`items-center px-4`, { width }]}>
      <Animated.Image
        source={item?.image}
        style={{
          height: height * 0.5,
          width: '100%',
          resizeMode: 'contain',
          // transform: [{ scale }],
        }}
      />
      <View style={tw`items-center top-5`}>
        <Text style={styles.title}>
          {item.id === '3' ? (
            <>
              <Text style={styles.highlight}>{item.highlight} </Text>
              {item.title}
            </>
          ) : (
            <>
              {item.title}
              {item.highlight && <Text style={styles.highlight}> {item.highlight}</Text>}
            </>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
    fontFamily:'MavenPro_400Regular',
    width: width * 0.8,
  },
  highlight: {
    color: '#075eec',
    fontFamily:'VarelaRound_400Regular',
  },
});

export default Slide;
