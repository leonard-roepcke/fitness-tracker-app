import {View, Text} from 'react-native'
import { useTheme} from '../hooks/useTheme.ts'
export default function WorkoutEndScreen({route}:any){
  const colors = useTheme();
  const styles = {
    container:{
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    text:{
      color: colors.text,
  },
  }
  return(
    <View style={styles.container}>
      <Text style={styles.text}>
        WorkoutEnd
      </Text>
    </View>
  );
}
