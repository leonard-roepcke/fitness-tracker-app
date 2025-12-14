import { useAppContext } from "@/app/hooks/useAppContext";
import { StyleSheet, View , Text} from "react-native";
import Bar from "../Bar"; 
import { CreateBox } from '../CreateBox';

function AppContainer({children, heading="", isBar="", backbutton=false}:any){
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


  })
   const back = () => {
      nav.goBack();
   };
   

  return(
    <View style={styles.container}>
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
              <View style={{ position: 'absolute', left: 0 , top: 0}}>
                <CreateBox onPress={back} iconName='arrow-back' />
              </View>
        </>)}
      {isBar && <Bar/>}
    </View>
  );
}
export default AppContainer;
