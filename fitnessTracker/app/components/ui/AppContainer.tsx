import { useAppContext } from "@/app/hooks/useAppContext";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Bar from "../Bar";
import { CreateBox } from '../CreateBox';

function AppContainer({ children, heading = "", isBar = "", backbutton = false, headerRight = null }: any) {
  const { colors, layouts, nav } = useAppContext();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: layouts.padding,
      paddingTop: insets.top + 8,
      backgroundColor: colors.background,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: layouts.marginVertical,
    },
    headerSide: {
      width: 48,
      justifyContent: 'center',
    },
    headerSideRight: {
      alignItems: 'flex-end',
    },
    header: {
      flex: 1,
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 36,
      color: colors.primaryDark,
      textAlign: 'center',
    },
    headerUnderline: {
      height: 4,
      width: 48,
      backgroundColor: colors.primary,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: layouts.marginVertical,
    },
    scrollContent: {
      paddingBottom: 100,
    },
  });

  const back = () => {
    nav.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {heading !== "" && (
          <>
            <View style={styles.headerRow}>
              <View style={styles.headerSide}>
                {backbutton && (
                  <CreateBox onPress={back} iconName='arrow-back' variant='borderless' />
                )}
              </View>
              <Text style={styles.header} numberOfLines={2}>{heading}</Text>
              <View style={[styles.headerSide, styles.headerSideRight]}>
                {headerRight}
              </View>
            </View>
            <View style={styles.headerUnderline} />
          </>
        )}

        {children}
      </ScrollView>

      {isBar && <Bar />}
    </View>
  );
}
export default AppContainer;
