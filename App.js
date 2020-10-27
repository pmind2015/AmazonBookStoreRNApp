import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MyDrawerNavigation from "./src/navigation/MyDrawerNavigator";
import { UserStore } from "./src/contexts/UserContex";

function App() {
  return (
    <NavigationContainer>
      <UserStore>
        <MyDrawerNavigation />
      </UserStore>
    </NavigationContainer>
  );
}

export default App;
