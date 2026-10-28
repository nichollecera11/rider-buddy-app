import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";

export default function ShopScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.darkBg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "800" }}>
        Parts Marketplace
      </Text>
    </SafeAreaView>
  );
}
