import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginContext } from "../context/LoginContext";
import LoginScreen from "../screen/LoginPage";
import RegisterScreen from "../screen/RegisterPage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyProfileScreen from "../screen/ProfilePage";
import HomeScreen from "../screen/HomePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchScreen from "../screen/SearchUserPage";
import DetaiScreen from "../screen/DeatailPage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const StackHolder = () => {
  const { isLoggedIn } = useContext(LoginContext);

  const TabNav = () => {
//     const [userId, setUserId] = useState(null);
// // console.log(userId);
//     const getId = async (key) => {
//       const value = await SecureStore.getItemAsync(key);
//       // console.log(value.payload);
//       if (value !== null) {
//         setUserId(value);
//       }
//     };

//     useEffect(() => {
//       getId("userId");
//     }, []);

    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} /> }} />
        <Tab.Screen name="Profile"  component={MyProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} /> }} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="HomeTab" component={TabNav} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Detail" component={DetaiScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackHolder;
