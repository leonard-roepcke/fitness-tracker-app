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
    title: {
      fontSize: 10,
      fontWeight: '600',
      marginBottom: layouts.marginVertical,
      color: colors.text,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    headerSide: {
      width: 80,
      justifyContent: 'center',
    },
    headerSideRight: {
      alignItems: 'flex-end',
    },
    header: {
      flex: 1,
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 32,
      color: colors.primaryDark,
      textAlign: 'center',
    },
    headerUnderline: {
      height: 4,
      width: 48,
      backgroundColor: colors.primary,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 8,
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
            <Text style={styles.title}></Text>
            <View style={styles.headerRow}>
              <View style={styles.headerSide} />
              <Text style={styles.header}>{heading}</Text>
              <View style={[styles.headerSide, styles.headerSideRight]}>
                {headerRight}
              </View>
            </View>
            <View style={styles.headerUnderline} />
          </>
        )}

        {children}
        {backbutton && (
          <View style={{ position: 'absolute', left: 0, top: insets.top + 8 }}>
            <CreateBox onPress={back} iconName='arrow-back' />
          </View>
        )}
      </ScrollView>

      {isBar && <Bar />}
    </View>
  );
}
export default AppContainer;
