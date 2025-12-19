import {View, Text} from 'react-native'
import { useTheme} from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
export default function WorkoutEndScreen({route}:any){
  const colors = useTheme();
  const { text } = useAppContext();
  const styles = {
   text:{
      color: colors.text,
  },
  }
  return(
    <AppContainer heading={text.workoutendHeading}>
      <Text style={styles.text}>
        WorkoutEnd
      </Text>
    </AppContainer>
  );
}
