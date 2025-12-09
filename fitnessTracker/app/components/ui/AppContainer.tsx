import { useAppContext } from "@/app/hooks/useAppContext";
import { StyleSheet, View } from "react-native";

function AppContainer({children}:any){
  const { colors }=useAppContext();
  const styles = StyleSheet.create({
    container: {
      flex:1,
      padding: 16,
      backgroundColor: colors.background,
    }
  })

  return(
    <View style={styles.container}>
      {children}
    </View>
  );
}
export default AppContainer;
