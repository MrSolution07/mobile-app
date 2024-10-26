import React,{useState, useEffect} from 'react';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet,Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import CustomTabIcon from './CustomTabIcon'; 
import Home from './HomeScreen';
import Wallet from './Wallet';
import Gemini from './Gemini';
import Explore from './Explore';
import { useThemeColors } from '../Context/Theme/useThemeColors';

const Tab = createBottomTabNavigator();



export default function Tabs() {

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const colors = useThemeColors();
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            backgroundColor: colors.tabbackground,
            display: isKeyboardVisible ? 'none' : 'flex',
          },
          tabBarIcon: ({ focused }) => <CustomTabIcon focused={focused} name={getIconName(route.name)} />,
          tabBarBackground:() =>{
            <BlurView intensity={80}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderTopLeftRadius:20,
              borderTopRightRadius:20,
              overflow:"hidden",
              // backgroundColor:"transparent"
            
            }}

            />
          }
        })}
      >
        <Tab.Screen
            name="Home"
            component={Home}
            options={{title:""}}
          />
          <Tab.Screen
            name="Explore"
            component={Explore}
            options={{title:""}}
          />
          <Tab.Screen
            name="Wallet"
            component={Wallet}
            options={{title: ""}}
          />
         
           <Tab.Screen
            name="Gemini"
            component={Gemini}
            options={{title:""}}
            
          />
        
      </Tab.Navigator>
  );
}

const getIconName = (routeName) => {
  switch (routeName) {
    case 'Home':
      return 'home'; 
    case 'Explore':
      return 'compass';
      case 'Wallet':
      return 'wallet'; 
      case 'Gemini':
        return 'chat';
    default:
      return 'home';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', 
    paddingBottom: 5,
    paddingTop: 5, 
  },
  tabBarStyle: {
    height: 60,
    borderRadius: 12,
    backgroundColor: 'black',
    opacity: 0.9,
    elevation: 5,
    alignSelf: 'center',
    marginBottom: 10, 
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10,
    left: '9.5%', 
    position: 'absolute',
  },
});
