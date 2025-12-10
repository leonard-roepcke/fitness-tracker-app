import {View, Text} from 'react-native'
import { useTheme} from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
export default function WorkoutEndScreen({route}:any){
  const colors = useTheme();
  const styles = {
   text:{
      color: colors.text,
  },
  }
  return(
    <AppContainer>
      <Text style={styles.text}>
        WorkoutEnd
      </Text>
    </AppContainer>
  );
}
