import { SafeAreaView, Text } from "react-native";
import { COLORS } from "../../constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.bgDark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "800" }}>
        Rider Profile
      </Text>
    </SafeAreaView>
  );
}
