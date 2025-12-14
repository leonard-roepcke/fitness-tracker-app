import AppContainer from "@/app/components/ui/AppContainer";
import { useAppContext } from "@/app/hooks/useAppContext"
import { Text } from "react-native";
export default function PrivacyPolicyScreen(){
  const { text , colors} = useAppContext();
  return(
    <AppContainer backbutton={true} heading={text.privacyPolicyHeading}>
      <Text style={{color: colors.text}}>
        {text.privacyPolicy}
      </Text>
    </AppContainer>
  )
}
