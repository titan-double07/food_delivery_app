import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import useDeliveryStore, { DeliveryAddress } from "@/store/delivery.store";
import { cn } from "@/lib/utils";
import { colors } from "@/theme/colors";
import CustomInput from "@/components/shared/CustomInput";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { showAlert } from "@/utils/alert";

type LocationMethod = "gps" | "search" | "map" | "manual";

export default function DeliveryAddressScreen() {
  const [address, setAddress] = useState<DeliveryAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [selectedMethod, setSelectedMethod] = useState<LocationMethod | null>(
    null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapRegion, setMapRegion] = useState({
    latitude: 6.5244, // Lagos default
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
  });

  const { setAddress: saveAddress } = useDeliveryStore();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showAlert({
        type: "error",
        title: "Permission Denied",
        message: "Please enable location permission in your device settings",
      });
    }
  };

  /**
   * METHOD 1: Get user's current location using GPS
   */
  const handleUseCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      setSelectedMethod("gps");

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAlert({
          type: "error",
          title: "Permission Denied",
          message: "Please enable location permission in your device settings",
        });

        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log(
        " ~ handleUseCurrentLocation ~ geocode:",
        JSON.stringify(geocode, null, 2)
      );

      if (geocode) {
        const fullAddress = [
          geocode.streetNumber,
          geocode.street,
          geocode.city,
          geocode.region,
          geocode.postalCode,
        ] 
          .filter(Boolean)
          .join(", ");

        setAddress({
          street:
            `${geocode.streetNumber || ""} ${geocode.street || ""}`.trim(),
          city: geocode.city || "",
          state: geocode.region || "",
          zipCode: geocode.postalCode || "",
          latitude,
          longitude,
          fullAddress,
        });

        // Update map
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setMarkerCoordinate({ latitude, longitude });
      }
    } catch (error) {
      console.error("Error getting location:", error);

      showAlert({
        type: "error",
        title: "Location Error",
        message:
          "Unable to get your current location. Please try another method.",
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * METHOD 2: Search for address (simplified version - can be enhanced with Google Places API)
   */
  const handleSearchAddress = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Empty Search", "Please enter an address to search");
      return;
    }

    try {
      setIsLoadingLocation(true);
      setSelectedMethod("search");

      // Geocode the search query
      const results = await Location.geocodeAsync(searchQuery);

      if (results.length > 0) {
        const { latitude, longitude } = results[0];

        // Reverse geocode to get formatted address
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocode) {
          const fullAddress = searchQuery; // Use search query as full address

          setAddress({
            street:
              `${geocode.streetNumber || ""} ${geocode.street || ""}`.trim() ||
              searchQuery,
            city: geocode.city || "",
            state: geocode.region || "",
            zipCode: geocode.postalCode || "",
            latitude,
            longitude,
            fullAddress,
          });

          // Update map
          setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setMarkerCoordinate({ latitude, longitude });
        }
      } else {
        Alert.alert(
          "Not Found",
          "Could not find the address. Please try a different search.",
        );
      }
    } catch (error) {
      console.error("Error searching address:", error);
      Alert.alert(
        "Search Error",
        "Unable to search for address. Please try again.",
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * METHOD 3: Pick location on map
   */
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedMethod("map");
    setMarkerCoordinate({ latitude, longitude });

    try {
      // Reverse geocode the selected location
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode) {
        const fullAddress = [
          geocode.streetNumber,
          geocode.street,
          geocode.city,
          geocode.region,
          geocode.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress({
          street:
            `${geocode.streetNumber || ""} ${geocode.street || ""}`.trim(),
          city: geocode.city || "",
          state: geocode.region || "",
          zipCode: geocode.postalCode || "",
          latitude,
          longitude,
          fullAddress,
        });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  /**
   * METHOD 4: Manual input handled by form fields
   */
 const handleManualInput = () => {
   setSelectedMethod("manual");

   // If there's no address yet, provide a template with user's location
   if (!address.street && !address.city) {
     setAddress({
       street: "",
       city: "Lagos", // Default city
       state: "Lagos",
       zipCode: "",
     });
   }
   // Otherwise keep existing address and let them edit
 };

  const isFormValid = () => {
    return address.street.trim() !== "" && address.city.trim() !== "";
  };

 const handleContinueToPayment = () => {
   if (!isFormValid()) {
     showAlert({
       type: "error",
       title: "Incomplete Address",
       message: "Please provide at least street and city",
     });
     return;
   }

   // Build fullAddress for manual entries if not already set
   const finalAddress = {
     ...address,
     fullAddress:
       address.fullAddress ||
       `${address.street}, ${address.city}${address.state ? `, ${address.state}` : ""}${address.zipCode ? ` ${address.zipCode}` : ""}`,
   };

   // Save address to store
   saveAddress(finalAddress);

   showAlert({
     type: "success",
     title: "Address Saved! ✓",
     message: "Your delivery address has been set",
     onConfirm: () => router.back(),
   });
 };
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-5 py-4">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="h3-bold">Delivery Address</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {/* Quick Action Buttons */}
          <View className="mb-6 gap-3">
            {/* Use Current Location */}
            <Pressable
              onPress={handleUseCurrentLocation}
              disabled={isLoadingLocation}
              className={cn(
                "flex-row items-center gap-3 rounded-xl border border-gray-300 p-4",

                selectedMethod === "gps" && "border-2 border-primary",
              )}
            >
              {isLoadingLocation && selectedMethod === "gps" ? (
                <ActivityIndicator
                  color={
                    selectedMethod === "gps" ? colors.light.primary : "#666"
                  }
                />
              ) : (
                <Ionicons
                  name="navigate"
                  size={22}
                  color={
                    selectedMethod === "gps" ? colors.light.primary : "#666"
                  }
                />
              )}
              <View className="flex-1">
                <Text
                  className={`paragraph-semibold ${selectedMethod === "gps" ? "text-primary" : ""}`}
                >
                  Use Current Location
                </Text>
                <Text className="text-xs text-gray-500">
                  Automatically detect your location
                </Text>
              </View>
            </Pressable>
            {/* Enter Manually */}
            <Pressable
              onPress={handleManualInput}
              className={cn(
                "flex-row items-center gap-3 rounded-xl border border-gray-300 bg-white p-4",
                selectedMethod === "manual" && "border-2 border-primary",
              )}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={
                  selectedMethod === "manual" ? colors.light.primary : "#666"
                }
              />
              <View className="flex-1">
                <Text
                  className={`paragraph-semibold ${selectedMethod === "manual" ? "text-primary" : ""}`}
                >
                  Enter Manually
                </Text>
                <Text className="text-xs text-gray-500">Type your address</Text>
              </View>
            </Pressable>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <Text className="paragraph-medium mb-2 text-gray-700">
              Search Address
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 flex-row items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Enter street, city, or landmark"
                  placeholderTextColor="#9CA3AF"
                  className="paragraph-regular flex-1"
                  onSubmitEditing={handleSearchAddress}
                />
              </View>
              <Pressable
                onPress={handleSearchAddress}
                disabled={isLoadingLocation}
                className="rounded-lg bg-primary px-4 py-3"
              >
                {isLoadingLocation && selectedMethod === "search" ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="search" size={20} color="#fff" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Map View */}
          <View className="mb-6">
            <Text className="paragraph-medium mb-2 text-gray-700">
              Or select on map
            </Text>
            <View className="overflow-hidden rounded-xl border border-gray-300">
              <MapView
                provider={PROVIDER_DEFAULT}
                style={{ width: "100%", height: 250 }}
                region={mapRegion}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton
              >
                <Marker coordinate={markerCoordinate} draggable />
              </MapView>
            </View>
            <Text className="mt-2 text-xs text-gray-500">
              Tap on the map or drag the marker to select your location
            </Text>
          </View>

          {/* Manual Input Fields */}
          {(selectedMethod === "manual" || address.street) && (
            <View className="gap-4">
              <Text className="paragraph-semibold text-gray-700">
                Delivery Details
              </Text>

              <CustomInput
                label="Street Address *"
                value={address.street}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    street: text,
                    fullAddress: undefined, // Clear auto-detected address when editing
                  })
                }
                placeholder="123 Main Street"
                icon="home-outline"
              />

              <CustomInput
                label="City *"
                value={address.city}
                onChangeText={(text) =>
                  setAddress({
                    ...address,
                    city: text,
                    fullAddress: undefined, // Clear auto-detected address when editing
                  })
                }
                placeholder="Lagos"
                icon="business-outline"
              />

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <CustomInput
                    label="State"
                    value={address.state}
                    onChangeText={(text) =>
                      setAddress({
                        ...address,
                        state: text,
                        fullAddress: undefined,
                      })
                    }
                    placeholder="Lagos"
                    icon="map-outline"
                  />
                </View>
                <View className="flex-1">
                  <CustomInput
                    label="ZIP Code"
                    value={address.zipCode}
                    onChangeText={(text) =>
                      setAddress({
                        ...address,
                        zipCode: text,
                        fullAddress: undefined,
                      })
                    }
                    placeholder="100001"
                    icon="mail-outline"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Show different message based on whether it's auto-detected or manual */}
              {address.fullAddress ? (
                <View className="rounded-lg bg-green-50 p-3">
                  <Text className="text-xs font-medium text-green-800">
                    Auto-detected Address:
                  </Text>
                  <Text className="text-sm text-green-700">
                    {address.fullAddress}
                  </Text>
                  <Text className="mt-1 text-xs text-gray-600">
                    You can edit the fields above to adjust
                  </Text>
                </View>
              ) : address.street && address.city ? (
                <View className="rounded-lg bg-blue-50 p-3">
                  <Text className="text-xs font-medium text-blue-800">
                    Manual Address:
                  </Text>
                  <Text className="text-sm text-blue-700">
                    {`${address.street}, ${address.city}${address.state ? `, ${address.state}` : ""}${address.zipCode ? ` ${address.zipCode}` : ""}`}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="border-t border-gray-200 p-5">
        <Pressable
          onPress={handleContinueToPayment}
          disabled={!isFormValid()}
          className={`flex-row items-center justify-center gap-2 rounded-xl py-4 ${
            isFormValid() ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <Text className="text-base font-bold text-white">
            Confirm & Continue
          </Text>
          <Ionicons name="checkmark-circle" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Reusable Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "numeric";
}) => (
  <View className="gap-2">
    <Text className="paragraph-medium text-gray-700">{label}</Text>
    <View className="flex-row items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3">
      <Ionicons name={icon} size={20} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        className="paragraph-regular flex-1"
      />
    </View>
  </View>
);
