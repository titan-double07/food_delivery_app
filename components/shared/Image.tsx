// utils/nativewind.ts
import { cssInterop } from "nativewind";
import { Image as RNImage } from "react-native";

// patch Image so it accepts className
cssInterop(RNImage, {
  className: "style", // tells NativeWind to map className -> style
});

export { RNImage as Image };

