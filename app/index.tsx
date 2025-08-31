import Header from "@/components/home-screen/Header";
import { offers } from "@/constants";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    return (
        <SafeAreaView>
            
            <FlatList
                ListHeaderComponent={<Header />}
                data={offers}
                renderItem={({item}) => {
                    return (
                        <View>
                            <Pressable className="offer-card" style={{backgroundColor:item.color}}>

                            </Pressable>
                        </View>
                    )
                }}

            />
        </SafeAreaView>
    )
}
