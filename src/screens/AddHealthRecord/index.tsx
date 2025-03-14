import React, { useContext, useState } from 'react';
import {
  Alert,
  Modal,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Container,
  Title,
  Input,
  CustomButton,
  ButtonText,
  ImagePreview,
  TypeSelector,
  TypeOption,
  TypeText,
  DatePickerButton,
  DatePickerText,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import storage from '@react-native-firebase/storage';
import * as Icon from 'phosphor-react-native';

export default function AddHealthRecordScreen({ navigation, route }) {
  // selected record from edit mode
  const { record } = route.params;

  const [type, setType] = useState(record?.type || '');
  const [description, setDescription] = useState(record?.description || '');
  const [date, setDate] = useState(record?.date ? new Date(record.date) : new Date());
  const [showDateModal, setShowDateModal] = useState(false); // Modal state
  const [image, setImage] = useState(record?.image || null);
  const [uploading, setUploading] = useState(false);
  const [extraInfo, setExtraInfo] = useState(record?.extraInfo || ''); // State for conditional input
  const { selectedDog } = useContext(DogProfileContext);

  const types = [
    { label: 'Vaccine', icon: <Icon.Syringe size={20} color="#7289DA" /> },
    {
      label: 'Vet Appointment',
      icon: <Icon.Stethoscope size={20} color="#7289DA" />,
    },
    { label: 'Medication', icon: <Icon.Pill size={20} color="#7289DA" /> },
    { label: 'Pet Groomer', icon: <Icon.Scissors size={20} color="#7289DA" /> },
    { label: 'Other', icon: <Icon.FileText size={20} color="#7289DA" /> },
  ];

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Permission to access the gallery is required!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log('Image selection was canceled or no assets available');
    }
  };

  const uploadImageToStorage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const storageRef = storage().ref(`healthRecords/${filename}`);

    setUploading(true);

    try {
      await storageRef.putFile(uploadUri);
      const downloadURL = await storageRef.getDownloadURL();
      setUploading(false);
      return downloadURL;
    } catch (error) {
      setUploading(false);
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
      return null;
    }
  };

  const handleSave = async () => {
    // Validation: Check required fields based on type
    if (
      !type ||
      (!description && type !== 'Medication' && type !== 'Vaccine') || // description is optional for Medication and Vaccine
      (!extraInfo && (type === 'Medication' || type === 'Vaccine')) || // extraInfo is mandatory for Medication and Vaccine
      !date
    ) {
      Alert.alert('Please fill out all required fields');
      return;
    }

    let imageUrl = image;
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImageToStorage(image);
      if (!imageUrl) {
        Alert.alert(
          'Error',
          'Image upload failed. Cannot save the health record.'
        );
        return;
      }
    }

    const newRecord = {
      type,
      description, // It will be empty if the type is Medication or Vaccine and left blank by the user
      date: date.toISOString(),
      image: imageUrl,
      dogId: selectedDog.id,
      extraInfo,
    };

    try {
      if (route.params?.isEditMode) {
        await db.collection('healthRecords').doc(record.id).update(newRecord);
        if (route.params?.onGoBack) route.params.onGoBack(); // Reset filter state on return
        navigation.navigate('HealthRecords');
      } else {
        await db.collection('healthRecords').add(newRecord);
        if (route.params?.addRecord) route.params.addRecord(newRecord);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving health record', error);
      Alert.alert('Error', 'Unable to save the health record.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title>Select the type</Title>

          <TypeSelector>
            {types.map((item) => (
              <TypeOption
                key={item.label}
                onPress={() => setType(item.label)}
                selected={type === item.label}
              >
                {item.icon}
                <TypeText selected={type === item.label}>{item.label}</TypeText>
              </TypeOption>
            ))}
          </TypeSelector>

          {/* Show placeholder if no type is selected */}
          {!type && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Icon.Question size={40} color="#7289DA" />
              <Text style={{ color: '#7289DA', fontSize: 16, marginTop: 10 }}>
                Please select a type to continue
              </Text>
            </View>
          )}

          {/* Conditionally show inputs after a type is selected */}
          {type && (
            <>
              {type === 'Medication' && (
                <Input
                  value={extraInfo}
                  onChangeText={setExtraInfo}
                  placeholder="Name of medication"
                />
              )}
              {type === 'Vaccine' && (
                <Input
                  value={extraInfo}
                  onChangeText={setExtraInfo}
                  placeholder="Name of vaccine"
                />
              )}
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Write any details about the record, like prices, notes, or other relevant info you might need later"
                multiline
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {/* Date Picker Button */}
              <DatePickerButton
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    setShowDateModal(true); // Show modal on iOS
                  } else {
                    setShowDateModal(true); // Open DateTimePicker directly on Android
                  }
                }}
              >
                <DatePickerText>{formattedDate}</DatePickerText>
              </DatePickerButton>

              {Platform.OS === 'ios' && (
                <Modal
                  visible={showDateModal}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowDateModal(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        width: '90%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          textAlign: 'center',
                          marginBottom: 10,
                        }}
                      >
                        Select Date
                      </Text>
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) setDate(selectedDate);
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 20,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setShowDateModal(false)}
                        >
                          <Text style={{ color: '#7289DA', fontSize: 16 }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShowDateModal(false)}
                        >
                          <Text style={{ color: '#7289DA', fontSize: 16 }}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}

              {Platform.OS === 'android' && showDateModal && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                    setShowDateModal(false);
                  }}
                />
              )}

              <CustomButton onPress={pickImage}>
                <ButtonText>Select Image</ButtonText>
              </CustomButton>

              <CustomButton onPress={handleSave} disabled={uploading}>
                <ButtonText>
                  {uploading
                    ? 'Uploading...'
                    : route.params?.isEditMode
                    ? 'Update Health Record'
                    : 'Save Health Record'}
                </ButtonText>
              </CustomButton>

              {image && <ImagePreview source={{ uri: image }} />}
            </>
          )}

          {/* Date Picker Direct for Android */}
          {Platform.OS === 'android' && showDateModal && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
                setShowDateModal(false); // Close DateTimePicker after selection
              }}
            />
          )}
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
