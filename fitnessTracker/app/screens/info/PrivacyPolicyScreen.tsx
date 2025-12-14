import AppContainer from "@/app/components/ui/AppContainer";
import { useAppContext } from "@/app/hooks/useAppContext"
import { Text } from "react-native";
export default function PrivacyPolicyScreen(){
  const { text } = useAppContext();
  return(
    <AppContainer backbutton={true} heading="Privacy Policy">
      <Text>
        {text.privacyPolicy}
      </Text>
    </AppContainer>
  )
}
