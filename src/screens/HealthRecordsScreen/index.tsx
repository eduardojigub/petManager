import React, { useState, useEffect, useContext } from 'react';
import { Text, FlatList, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Container,
  ListItem,
  ListItemText,
  AddButton,
  ButtonText,
  TypeIcon,
  ListItemDetailHint,
  TrashIconContainer,
  ListItemContent,
  FilterButton,
  ModalContainer,
  ModalTitle,
  DetailDateText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native';

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showDateModal, setShowDateModal] = useState(false); // Modal state
  const [isFilterApplied, setIsFilterApplied] = useState(false); // Filter state
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

        // Sort records from newest to oldest
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setHealthRecords(records);
        console.log("Loaded Health Records:", records); // Debug: Loaded records
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

  const filterRecords = () => {
    console.log("Selected Month:", selectedMonth, "Selected Year:", selectedYear); // Debug: Log selected month and year
  
    const filtered = healthRecords.filter(record => {
      const recordDate = new Date(record.date);
      console.log("Checking Record Date:", record.date, "Parsed Date:", recordDate); // Log each date for debugging
  
      // Compare record date with selected month and year
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });
  
    // Sort filtered records by date in descending order
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredRecords(filtered);
    setIsFilterApplied(true); // Activate filter
    setShowDateModal(false); // Close modal after filter
    console.log("Filtered Records:", filtered); // Debug: Log filtered data
  };

  const resetFilter = () => {
    setIsFilterApplied(false); // Deactivate filter
    setFilteredRecords([]); // Clear filtered records
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

  const renderRecord = ({ item }) => {
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <ListItem onPress={() => navigation.navigate('HealthRecordDetails', { record: item })}>
        <TypeIcon>{getTypeIcon(item.type)}</TypeIcon>
        <ListItemContent>
          <ListItemText>{item.type}</ListItemText>
          <ListItemDetailHint>
            Tap to view details <DetailDateText>• {formattedDate}</DetailDateText>
          </ListItemDetailHint>
        </ListItemContent>
        <TrashIconContainer onPress={() => confirmDelete(item.id)}>
          <Icon.TrashSimple size={20} color="#e74c3c" />
        </TrashIconContainer>
      </ListItem>
    );
  };

  return (
    <Container>
      
      {/* <FilterButton onPress={() => setShowDateModal(true)}>
        <ButtonText>Filter by Month & Year</ButtonText>
      </FilterButton> */}
      
      {isFilterApplied && (
        <FilterButton onPress={resetFilter}>
          <ButtonText>Clear Filter</ButtonText>
        </FilterButton>
      )}

      <Modal
        visible={showDateModal}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <ModalContainer>
          <ModalTitle>Select Month and Year</ModalTitle>
          
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={{ width: '100%', marginBottom: 10 }}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <Picker.Item key={index} label={new Date(0, index).toLocaleString('default', { month: 'long' })} value={index} />
            ))}
          </Picker>
          
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={{ width: '100%' }}
          >
            {Array.from({ length: 10 }, (_, index) => {
              const year = new Date().getFullYear() - index;
              return <Picker.Item key={year} label={`${year}`} value={year} />;
            })}
          </Picker>
          
          <AddButton onPress={filterRecords}>
            <ButtonText>Apply Filter</ButtonText>
          </AddButton>
        </ModalContainer>
      </Modal>

      <FlatList
        data={isFilterApplied ? filteredRecords : healthRecords}
        renderItem={renderRecord}
        keyExtractor={item => item.id}
      />
      
      <AddButton onPress={() => navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })}>
        <ButtonText>Add Health Record</ButtonText>
      </AddButton>
    </Container>
  );
}
