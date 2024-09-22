import { ApolloProvider } from "@apollo/client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginProvider } from "./context/LoginContext";
import StackHolder from "./stack/stackHolder";
import client from "./config/apollo";

export default function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <LoginProvider>
            <StackHolder />
          </LoginProvider>
        </SafeAreaProvider>
      </ApolloProvider>
    </>
  );
}
 