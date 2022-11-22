import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";

import { Header } from "../components/Header";
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Button } from "../components/Button";
import { api } from "../service/api";

import { Loading } from "../components/Loading";
import { PoolCard,PoolPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";


export function Pools(){
    const [ isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolPros[]>([]);

    const navigation = useNavigation();
    const toast = useToast();

    async function fetchPools(){
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools);

        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: "top",
                bgColor: 'red.500'
            });
        } finally {
            setIsLoading(false);
        }
    };

    function screenFind(){
        navigation.navigate('find');
    }; 

    useFocusEffect(useCallback(()=> {
        fetchPools();
    }, []));

    return(
        <VStack flex={1} bgColor='gray.900' >
            <Header title='Meus Bolões' />

            <VStack mt={8} mx={5} alignItems='center' borderBottomColor={"gray.600"} borderBottomWidth={1} pb={4} mb={4} >

                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={screenFind}
                />

            </VStack>

            {
            isLoading ? <Loading /> :    
                <FlatList 
                data={pools}
                keyExtractor={item=> item.id}
                renderItem={({ item })=> <PoolCard data={item} onPress={()=> navigation.navigate('details',{id: item.id})} />}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{pb: 10}}
                ListEmptyComponent={()=> <EmptyPoolList /> }
                />
            }

        </VStack>
    )
}