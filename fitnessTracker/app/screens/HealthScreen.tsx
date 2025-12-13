import { ThemeContext } from '@/context/ThemeContext';
import { View , Text , StyleSheet} from "react-native";
import AppContainer from "../components/ui/AppContainer";
import { useContext } from "react";
import CStats from '../components/CStats';
import WStats from '../components/WStats';
import { useAppContext } from '../hooks/useAppContext';
import { LanguageContext } from '@/context/LanguageContext';
import { useLanguage} from '../hooks/useLanguage';
export default function HealthScreen(){
  const { isWTrackerEnabled, isCTrackerEnabled } = useContext(ThemeContext);
      const { colors, layouts, text} = useAppContext();
     const styles = StyleSheet.create({
       title: {
            fontSize: 10,
            fontWeight: '600',
            marginBottom: layouts.marginVertical,
            color: colors.text,
            justifyContent: 'center',
            alignItems: 'center',

        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        scrollView: {
            width: '100%',
        },
        header: {
            fontSize: 32,
            fontWeight: "bold",
            marginTop: 35,
            color: colors.text,
        },
        spacing: {
            height: layouts.marginVertical*12,
        }
    });


  
  return(
      <AppContainer isBar={true} heading={text.health}>
                 <Text style={styles.subtitle}></Text>
                {isWTrackerEnabled && <WStats />}
                {isCTrackerEnabled && <CStats />}
                <Text style={styles.subtitle}></Text>

    </AppContainer>
  )  
}
