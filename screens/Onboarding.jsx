import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slide from '../components/Slide'; 
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

// Colors
const COLORS = { primary: '#282534', white: '#fff' };

// Data for each slide
const slides = [
  {
    id: '1',
    image: require('../assets/images/firstslide.png'),
    title: `South Africa's first`,
    highlight: 'NFT Marketplace',
    subtitle: 'Skip',
  },
  {
    id: '2',
    image: require('../assets/images/secondslide.png'),
    title: `Manage, Sell and Buy `,
    highlight: 'digital assets',
    subtitle: 'Skip',
  },
  {
    id: '3',
    image: require('../assets/images/thirdslide.png'),
    highlight: 'Monetize',
    title: `your art, music and collectibles`,
  },
];

const Onboarding = ({ navigation }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const borderColorAnimation = React.useRef(new Animated.Value(0)).current;

  // Function to play border color animation
  const playBorderColorAnimation = () => {
    borderColorAnimation.setValue(0); 
    Animated.timing(borderColorAnimation, {
      toValue: 1,
      duration: 1300, 
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  // Effect for slide change
  React.useEffect(() => {
    if (currentSlideIndex === slides.length - 1) {
      playBorderColorAnimation(); 
    }
  }, [currentSlideIndex]); // Run effect on slide index change

  const borderColor = borderColorAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['purple','#075eec','black'],
  });

  React.useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const currentIndex = Math.round(value / width);
      setCurrentSlideIndex(currentIndex);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [scrollX]);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const goToSlide = (index) => {
    const offset = index * width;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(index);
  };

  const Footer = () => {
    return (
      <View style={{ height: height * 0.15, justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          {slides.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Pressable key={index} onPress={() => goToSlide(index)}>
                <Animated.View
                  style={[
                    styles.indicator,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: currentSlideIndex === index ? '#075eec' : 'grey',
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex === slides.length - 1 ? (
            <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View
                style={[
                  styles.getStartedButtonBorder,
                  { borderColor: borderColor }, // Animated border color
                ]}
              >
                <Pressable
                  style={styles.getStartedButton}
                  onPress={() => navigation.replace('Registration')}
                >
                  <Text style={tw`text-white text-center text-sm`}>Get Started</Text>
                </Pressable>
              </Animated.View>
            </View>
          ) : (
            <View style={tw`items-end justify-end`}>
              <Pressable onPress={skip}>
                <Text style={tw`text-black text-sm`}>Skip</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="light-content" translucent />
      <Text style={styles.Header}>MetawaySA</Text>
      <Animated.FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.80 }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        bounces={false}
        data={slides}
        pagingEnabled
        renderItem={({ item, index }) => <Slide item={item} scrollX={scrollX} index={index} />}
        keyExtractor={item => item.id}
        decelerationRate="normal"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  indicator: {
    height: 4,
    width: 15,
    borderRadius: 15,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    bottom: 35,
  },
  Header: {
    fontSize: 18,
    color: '#075eec',
    textAlign: 'center',
    top: 15,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
    width: width * 0.8,
  },
  highlight: {
    color: '#075eec',
  },
  getStartedButtonBorder: {
    width: '60%',
    height: '80%',
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black',
  },
  getStartedButton: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Onboarding;
