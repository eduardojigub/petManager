import React, { useState, useContext } from 'react';
import { FlatList, Alert, Modal } from 'react-native';
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
  FilterButton,
  ModalContainer,
  ModalTitle,
  DetailDateText,
  EmptyListContainer,
  EmptyListImage,
  EmptyListText,
  DisabledAddButton,
  CloseButton,
  ModalHeader,
  DropdownContainer,
  FloatingFilterButton,
  DropdownLabel,
  DropdownStyle,
  FloatingClearFilterButton,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import * as Icon from 'phosphor-react-native';
import healthRecordsImage from '../../assets/healthRecords.png';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { X } from 'phosphor-react-native';

export default function HealthRecordsScreen({ navigation }) {
  const [healthRecords, setHealthRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedType, setSelectedType] = useState(''); // New state for type filter
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const { selectedDog } = useContext(DogProfileContext);

  const hasActiveFilters = () => {
    return selectedType || selectedMonth !== null || selectedYear !== null;
  };

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
          // Reapply filter if it’s currently active
          if (isFilterApplied) {
            applyFilter(records);
          }
        } catch (error) {
          console.error('Error loading health records', error);
        }
      };

      loadRecords();

      if (!selectedDog) {
        navigation.navigate('Profile');
      }
    }, [selectedDog])
  );

  const currentMonth = new Date().getMonth(); // Get the current month (0-based, 0 = January, 11 = December)

  const months = Array.from({ length: 12 }, (_, index) => ({
    label:
      index === currentMonth
        ? `${new Date(2023, index).toLocaleString('default', {
            month: 'long',
          })} (Current Month)`
        : new Date(2023, index).toLocaleString('default', { month: 'long' }),
    value: index,
  }));

  // Filter function
  const applyFilter = () => {
    const filtered = healthRecords.filter((record) => {
      const recordDate = new Date(record.date); // Date object of the record

      // Check each filter and only apply if there’s a selected value
      const typeMatches = selectedType ? record.type === selectedType : true;
      const monthMatches =
        selectedMonth !== null ? recordDate.getMonth() === selectedMonth : true;
      const yearMatches =
        selectedYear !== null
          ? recordDate.getFullYear() === selectedYear
          : true;

      return typeMatches && monthMatches && yearMatches;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredRecords(filtered);
    setIsFilterApplied(true);
    setShowDateModal(false);
  };

  // Modify `filterRecords` to just call `applyFilter` without resetting filters
  const filterRecords = () => {
    applyFilter();
  };

  useFocusEffect(
    React.useCallback(() => {
      // Only reapply filter if it’s active
      if (isFilterApplied) {
        applyFilter();
      }
    }, [isFilterApplied, healthRecords])
  );

  const addHealthRecord = (newRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Health Record',
      'Are you sure you want to delete this health record?',
      [
        {
          text: 'Cancel',
        style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHealthRecord(id),
        },
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
        // Reapply the filter on updated records if a filter is applied
        const filtered = updatedRecords.filter((record) => {
          const recordDate = new Date(record.date);
          const typeMatches = selectedType
            ? record.type === selectedType
            : true;
          const monthMatches =
            selectedMonth !== null
              ? recordDate.getMonth() === selectedMonth
              : true;
          const yearMatches =
            selectedYear !== null
              ? recordDate.getFullYear() === selectedYear
              : true;

          return typeMatches && monthMatches && yearMatches;
        });

        setFilteredRecords(filtered);

        // Reset `isFilterApplied` if the filtered list is empty or matches the original records
        if (
          filtered.length === 0 ||
          filtered.length === updatedRecords.length
        ) {
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

    // Determine what text to show based on the type
    const displayText =
      item.type === 'Medication' || item.type === 'Vaccine'
        ? item.extraInfo
        : item.type;

    return (
      <ListItem
        onPress={() =>
          navigation.navigate('HealthRecordDetails', { record: item })
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

  // Clear filter function to reset all selected filter values
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  // Modify renderFilterModal to reset filters on close
  const renderFilterModal = () => (
    <Modal
      visible={showDateModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        clearFilters(); // Reset filters when modal closes
        setShowDateModal(false);
      }}
    >
      <Container
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Filter Health Records</ModalTitle>
            <CloseButton
              onPress={() => {
                clearFilters(); // Reset filters on pressing close
                setShowDateModal(false);
              }}
            >
              <X size={32} />
            </CloseButton>
          </ModalHeader>

          {/* Type Filter */}
          <DropdownContainer>
            <DropdownLabel>Filter by Type</DropdownLabel>
            <DropdownStyle>
              <Dropdown
                data={[
                  { label: 'All Types', value: null },
                  { label: 'Vaccine', value: 'Vaccine' },
                  { label: 'Vet Appointment', value: 'Vet Appointment' },
                  { label: 'Medication', value: 'Medication' },
                  { label: 'Pet Groomer', value: 'Pet Groomer' },
                  { label: 'Other', value: 'Other' }, // Add "Other" option here
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select Type"
                value={selectedType}
                onChange={(item) => setSelectedType(item.value)}
              />
            </DropdownStyle>
          </DropdownContainer>

          {/* Month Filter */}
          <DropdownContainer>
            <DropdownLabel>Filter by Month</DropdownLabel>
            <DropdownStyle>
              <Dropdown
                data={months}
                labelField="label"
                valueField="value"
                placeholder="Select Month"
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </DropdownStyle>
          </DropdownContainer>

          {/* Year Filter */}
          <DropdownContainer>
            <DropdownLabel>Filter by Year</DropdownLabel>
            <DropdownStyle>
              <Dropdown
                data={Array.from({ length: 10 }, (_, index) => {
                  const year = new Date().getFullYear() - index;
                  return { label: `${year}`, value: year };
                })}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                onChange={(item) => setSelectedYear(item.value)}
              />
            </DropdownStyle>
          </DropdownContainer>

          {/* Apply Filter Button */}
          <AddButton onPress={filterRecords} disabled={!hasActiveFilters()}>
            <ButtonText style={{ opacity: hasActiveFilters() ? 1 : 0.5 }}>
              Apply Filter
            </ButtonText>
          </AddButton>
        </ModalContainer>
      </Container>
    </Modal>
  );

  const renderEmptyList = () => (
    <EmptyListContainer>
      <EmptyListImage source={healthRecordsImage} />
      <EmptyListText>
        No health records yet. Add your first pet and start adding records to
        keep track of your pet’s health.
      </EmptyListText>
    </EmptyListContainer>
  );

  return (
    <Container>
      {isFilterApplied && (
        <FloatingClearFilterButton
          onPress={() => {
            clearFilters();
            setIsFilterApplied(false);
            setFilteredRecords([]);
          }}
        >
          <Ionicons name="close" size={20} color="#FFF" />
        </FloatingClearFilterButton>
      )}

      {renderFilterModal()}

      <FlatList
        data={isFilterApplied ? filteredRecords : healthRecords}
        renderItem={renderRecord}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {selectedDog ? (
        <>
          <AddButton
            onPress={() =>
              navigation.navigate('AddHealthRecord', {
                addRecord: addHealthRecord,
              })
            }
          >
            <ButtonText>Add Health Record</ButtonText>
          </AddButton>
          {(isFilterApplied
            ? filteredRecords.length > 0
            : healthRecords.length > 0) && (
            <FloatingFilterButton onPress={() => setShowDateModal(true)}>
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
