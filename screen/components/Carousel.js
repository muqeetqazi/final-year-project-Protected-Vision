import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const CarouselComponent = ({ data }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  //const selectLanguage = useSelector((state) => state.language);
    const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / viewportWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current.scrollTo({ x: index * viewportWidth, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {data.map((item, index) => (
          <View style={styles.slide} key={index}>
             <Image source={item.image} style={styles.image} /> 
            <View style={styles.textContainer}>
            <Text style={styles.text}>{item.text}</Text> 

            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {data.map((_, dotIndex) => (
          <TouchableOpacity key={dotIndex} onPress={() => scrollToIndex(dotIndex)}>
            <View style={styles.dotContainer}>
              {currentIndex === dotIndex && <View style={styles.circle} />}
              <View style={[styles.dot, currentIndex === dotIndex ? styles.activeDot : null]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    top:5
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  slide: {
    width: viewportWidth,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: viewportWidth * 0.9,
    height: 182,
    borderRadius: 10,
    opacity: 100,
    marginHorizontal: viewportWidth * 0.05,
  },
  // textContainer: {
  //   position: 'absolute',
  //   width: viewportWidth * 0.9,
  //   height: 182,
  //   backgroundColor: 'rgba(58, 46, 73, 0.7)',
  //   justifyContent: 'center',
  //   textAlignVertical: 'center',
  //   paddingHorizontal:40,
  //   flexWrap: 'wrap',
  //   alignContent: 'center',
  //   alignItems: 'center',
  //   alignSelf: 'center',
  //   textAlign: 'center',
  //   verticalAlign: 'center',
  //   borderRadius: 10,
  // },
  // text: {
  //   color: 'white',
  //   fontSize: 16,
  //   textAlign: 'center',
  //   alignSelf: 'center',
  //   fontFamily:'Inter-Bold'
  // },
textContainer: {
    position: 'absolute',
    width: viewportWidth * 0.9,
    height: 182,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 12,
    height: 12,
  },
  
  textar: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight:'Inter-Bold'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  circle: {
    position: 'absolute',
    width: 16,
    height: 16, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
});

export default CarouselComponent;