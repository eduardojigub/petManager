import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ProfileImage, ProfileName, ProfilePlaceholder } from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PetProfile } from '../../../interfaces/profiles';
import { AddProfileCircle } from '../styles';
import { useNavigation } from '@react-navigation/native';
import usePetContext from '../../../context/PetContext';
import usePetProfiles from '../../../hooks/usePetProfile';

/**
 * Renders a list of pet profiles
 * @param {PetProfile[]} profiles - The list of pet profiles to render
 * @returns {JSX.Element} - The rendered list of pet profiles
 **/



const PetProfileList = (): JSX.Element => {
  const navigation = useNavigation();
  const {petProfiles} = usePetProfiles();
  const {setSelectedPet} = usePetContext();
  const addProfileButton = () => (
  <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
    <AddProfileCircle>
      <Icon name="plus" size={40} color="#41245C" />
    </AddProfileCircle>
  </TouchableOpacity>
);
  const renderProfileItem = ({ item }: { item: PetProfile }) => (
    <TouchableOpacity onPress={() => setSelectedPet(item)} style={{ marginHorizontal: 10 }}>
      <View style={{ alignItems: 'center' }}>
        {item.image ? (
          <ProfileImage source={{ uri: item.image }} />
        ) : (
          <ProfilePlaceholder>
            <Icon name="dog" size={32} color="#ffffff" />
          </ProfilePlaceholder>
        )}
        <ProfileName>{item.name}</ProfileName>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal
      data={petProfiles}
      renderItem={renderProfileItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={addProfileButton}
      ListFooterComponent={addProfileButton}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default PetProfileList;

