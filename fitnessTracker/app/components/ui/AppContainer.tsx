import { useAppContext } from "@/app/hooks/useAppContext";
import { StyleSheet, View , Text, ScrollView} from "react-native";
import Bar from "../Bar"; 
import { CreateBox } from '../CreateBox';

function AppContainer({children, heading="", isBar="", backbutton=false, scrolable=false}:any){
  const { colors, layouts, nav }=useAppContext();
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
    scrollContent: {
          paddingBottom: 40
    },



  })
   const back = () => {
      nav.goBack();
   };
   

  return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      { heading!=="" &&(
        <>
      {/* Header */}
      <Text style={styles.title}></Text>
      <Text style={styles.header}>{heading}</Text>
      <Text style={styles.title}></Text> 
        </>
          )
      }

      {children}
      { backbutton &&(<>
                        {/* Back Button */}
              <View style={{ position: 'absolute', left: 0 , top: 40}}>
                <CreateBox onPress={back} iconName='arrow-back' />
              </View>
        </>)}
      </ScrollView>

      {isBar && <Bar/>}
    </View>
  );
}
export default AppContainer;
