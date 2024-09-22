import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';
import { LoginContext } from '../context/LoginContext';

import * as SecureStore from "expo-secure-store"
import { LOGIN } from '../query';

const LoginScreen = ({navigation}) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [LoginMutation, { loading, error, data }] = useMutation(LOGIN, {
    onCompleted: async (res) => {
      console.log(res);
      let access_token = null;
      let userId = res.login.payload
     

      if (res && res.login && res.login.access_token) {
        access_token = res.login.access_token;
        
      }
      if (access_token) {
        await SecureStore.setItemAsync("access_token", access_token)
        await SecureStore.setItemAsync("userId",userId)
        setIsLoggedIn(true);
      } else {
        console.log("Login failed, no access token received");
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
    }
  });

  const handleLogin = async () => {
    if (!username || !password) {
      console.log("Username or password is required");
      return;
    }

    try {
      await LoginMutation({
        variables: {
          fields: {
            username: username.toLowerCase(),
            password,
          }
        }
      });
    } catch (err) {
      console.log('Error in login mutation:', err);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Image source={require('../assets/facebook.png')} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
        <StatusBar style="auto" />
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Don't have an account? Register</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
    padding: 10,
    width: '80%',
    borderRadius: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 200,
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  
});

export default LoginScreen;
