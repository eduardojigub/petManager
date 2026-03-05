import React, { useState, useContext } from 'react';
import { FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  DetailDateText,
  DisabledAddButton,
  FloatingFilterButton,
  FloatingClearFilterButton,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native';
import healthRecordsImage from '../../assets/healthRecords.png';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import EmptyStateList from '../../components/EmptyStateList';
import FilterModal from '../../components/FilterModal';

const FILTER_TYPE_OPTIONS = [
  { label: 'All Types', value: null },
  { label: 'Vaccine', value: 'Vaccine' },
  { label: 'Vet Appointment', value: 'Vet Appointment' },
  { label: 'Medication', value: 'Medication' },
  { label: 'Pet Groomer', value: 'Pet Groomer' },
  { label: 'Other', value: 'Other' },
];

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ type: null, month: null, year: null });

  const { selectedDog } = useContext(DogProfileContext);
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      const loadRecords = async () => {
        if (!selectedDog) {
          setHealthRecords([]);
          setFilteredRecords([]);
          return;
        }

        try {
          const recordsSnapshot = await db
            .collection('healthRecords')
            .where('dogId', '==', selectedDog.id)
            .get();

          const records = recordsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          records.sort((a, b) => new Date(b.date) - new Date(a.date));
          setHealthRecords(records);

          if (route.params?.onGoBack) {
            route.params.onGoBack();
            navigation.setParams({ onGoBack: undefined });
          }
        } catch (error) {
          console.error('Error loading health records', error);
        }
      };

      loadRecords();
      setIsFilterApplied(false);
      setFilteredRecords([]);
      setActiveFilters({ type: null, month: null, year: null });
    }, [selectedDog, route.params?.onGoBack])
  );

  const applyFilterToRecords = (records, filters) => {
    return records
      .filter((record) => {
        const recordDate = new Date(record.date);
        const typeMatches = filters.type ? record.type === filters.type : true;
        const monthMatches = filters.month !== null ? recordDate.getMonth() === filters.month : true;
        const yearMatches = filters.year !== null ? recordDate.getFullYear() === filters.year : true;
        return typeMatches && monthMatches && yearMatches;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isFilterApplied) {
        setFilteredRecords(applyFilterToRecords(healthRecords, activeFilters));
      }
    }, [isFilterApplied, healthRecords])
  );

  const handleApplyFilter = (filters) => {
    setActiveFilters(filters);
    const filtered = applyFilterToRecords(healthRecords, filters);
    setFilteredRecords(filtered);
    setIsFilterApplied(true);
    setShowFilterModal(false);
  };

  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Health Record',
      'Are you sure you want to delete this health record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHealthRecord(id) },
      ],
      { cancelable: true }
    );
  };

  const deleteHealthRecord = async (id) => {
    try {
      await db.collection('healthRecords').doc(id).delete();
      const updatedRecords = healthRecords.filter((record) => record.id !== id);
      setHealthRecords(updatedRecords);

      if (isFilterApplied) {
        const filtered = applyFilterToRecords(updatedRecords, activeFilters);
        setFilteredRecords(filtered);
        if (filtered.length === 0 || filtered.length === updatedRecords.length) {
          setIsFilterApplied(false);
        }
      } else {
        setFilteredRecords(updatedRecords);
      }

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
      case 'Pet Groomer':
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

    const displayText =
      item.type === 'Medication' || item.type === 'Vaccine'
        ? item.extraInfo
        : item.type;

    return (
      <ListItem
        onPress={() =>
          navigation.navigate('HealthRecordDetails', { record: item, setIsFilterApplied })
        }
      >
        <TypeIcon>{getTypeIcon(item.type)}</TypeIcon>
        <ListItemContent>
          <ListItemText>{displayText || item.type}</ListItemText>
          <ListItemDetailHint>
            Tap to view or edit details{' '}
            <DetailDateText>• {formattedDate}</DetailDateText>
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
      {isFilterApplied && (
        <FloatingClearFilterButton
          onPress={() => {
            setIsFilterApplied(false);
            setFilteredRecords([]);
            setActiveFilters({ type: null, month: null, year: null });
          }}
        >
          <Ionicons name="close" size={20} color="#FFF" />
        </FloatingClearFilterButton>
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
        typeOptions={FILTER_TYPE_OPTIONS}
      />

      <FlatList
        data={isFilterApplied ? filteredRecords : healthRecords}
        renderItem={renderRecord}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyStateList
            image={healthRecordsImage}
            text="No health records yet. Add your first pet and start adding records to keep track of your pet's health."
          />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {selectedDog ? (
        <>
          <AddButton
            onPress={() =>
              navigation.navigate('AddHealthRecord', { addRecord: addHealthRecord })
            }
          >
            <ButtonText>Add Health Record</ButtonText>
          </AddButton>
          {(isFilterApplied
            ? filteredRecords.length > 0
            : healthRecords.length > 0) && (
            <FloatingFilterButton onPress={() => setShowFilterModal(true)}>
              <Ionicons name="filter" size={20} color="#FFF" />
            </FloatingFilterButton>
          )}
        </>
      ) : (
        <DisabledAddButton disabled>
          <ButtonText>Add Health Record</ButtonText>
        </DisabledAddButton>
      )}
    </Container>
  );
}
