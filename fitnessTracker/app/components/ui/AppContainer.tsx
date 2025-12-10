import { useAppContext } from "@/app/hooks/useAppContext";
import { StyleSheet, View , Text} from "react-native";

function AppContainer({children, heading=""}:any){
  const { colors, layouts }=useAppContext();
  const styles = StyleSheet.create({
    container: {
      flex:1,
      padding: 16,
      backgroundColor: colors.background,
    },
    
    title: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: layouts.marginVertical,
        color: colors.text,
        justifyContent: 'center',
        alignItems: 'center',

    },

    
    header: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 35,
        color: colors.text,
        textAlign: 'center',
    },


  })

  return(
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}></Text>
      <Text style={styles.header}>{heading}</Text>
      <Text style={styles.title}></Text> 
      {children}
    </View>
  );
}
export default AppContainer;
