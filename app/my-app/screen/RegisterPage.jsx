import { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image } from "react-native";
import { REGISTER } from "../query";
import { useMutation } from "@apollo/client";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [RegisterMutation, { loading, error, data }] = useMutation(REGISTER, {
    onCompleted: (response) => {
      setEmail("");
      setUsername("");
      setName("");
      setPassword("");
      navigation.navigate("Login");
    },
  });

  async function handleRegister() {
    try {
      await RegisterMutation({
        variables: {
          fields: {
            email: email,      
            name: name,
            username: username.toLowerCase(),
            password: password,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/facebook.png")} style={styles.logo} />
      
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        onChangeText={setName}   
        value={name}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Username"  
        onChangeText={setUsername} 
        value={username}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email"  
        onChangeText={setEmail} 
        value={email}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry={true}  
        onChangeText={setPassword} 
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
      
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText}>Have an account? Login</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    margin: 10,
    padding: 10,
    width: "80%",
    borderRadius: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 100, // Jarak logo dari form
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 200,
    opacity: 0.5,
  },
});

export default RegisterScreen;
