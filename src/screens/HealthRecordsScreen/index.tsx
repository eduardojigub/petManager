import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Container, ListItem, ListItemText, AddButton, ButtonText, TypeIcon, ListItemDetailHint, TrashIconContainer, ListItemContent } from "./styles";
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import Feather from '@expo/vector-icons/Feather';
import * as Icon from 'phosphor-react-native';

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const { selectedDog } = useContext(DogProfileContext);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const recordsSnapshot = await db.collection('healthRecords')
          .where('dogId', '==', selectedDog.id)
          .get();
          
        const records = recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setHealthRecords(records);
      } catch (error) {
        console.error('Error loading health records', error);
      }
    };

    if (selectedDog) {
      loadRecords();
    }
  }, [selectedDog]);

  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Health Record",
      "Are you sure you want to delete this health record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHealthRecord(id),
        },
      ],
      { cancelable: true }
    );
  };
  
  const deleteHealthRecord = async (id) => {
    try {
      await db.collection('healthRecords').doc(id).delete();
      setHealthRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
      Alert.alert('Success', 'Health record deleted successfully');
    } catch (error) {
      console.error('Error deleting health record', error);
      Alert.alert('Error', 'Failed to delete health record');
    }
  };
  

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vaccine':
        return <Icon.Syringe size={20} color="#7289DA" />;
      case 'Vet Appointment':
        return <Icon.Stethoscope size={20} color="#7289DA" />;
      case 'Medication':
        return <Icon.Pill size={20} color="#7289DA" />;
      case 'Dog Groomer':
        return <Icon.Scissors size={20} color="#7289DA" />;
      default:
        return <Icon.FileText size={20} color="#7289DA" />;
    }
  };

  const renderRecord = ({ item }) => (
    <ListItem onPress={() => navigation.navigate('HealthRecordDetails', { record: item })}>
      <TypeIcon>{getTypeIcon(item.type)}</TypeIcon>
      <ListItemContent>
        <ListItemText>{item.type}</ListItemText>
        <ListItemDetailHint>Tap to view details</ListItemDetailHint>
      </ListItemContent>
      <TrashIconContainer onPress={() => confirmDelete(item.id)}>
        <Icon.TrashSimple size={20} color="#e74c3c" />
      </TrashIconContainer>
    </ListItem>
  );
  

  return (
    <Container>
      <Text style={{ fontSize: 24, color: "#41245C", marginBottom: 20 }}>Health Records</Text>
      <FlatList
        data={healthRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={() => navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })}>
        <ButtonText>Add Health Record</ButtonText>
      </AddButton>
    </Container>
  );
}
