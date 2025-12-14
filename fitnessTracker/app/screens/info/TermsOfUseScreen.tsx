import AppContainer from "@/app/components/ui/AppContainer";
import { useAppContext } from "@/app/hooks/useAppContext"
import { Text } from "react-native";
export default function TermsOfUseScreen(){
  const { text , colors } = useAppContext();
  return(
    <AppContainer backbutton={true} heading={text.termsOfUseHeading}>
      <Text style={{color: colors.text}}>
        {text.termsOfUse}
      </Text>
    </AppContainer>
  )
}
