import React, { useContext, useState } from 'react';
import {
  Alert,
  View,
  Text,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
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
import * as Icon from 'phosphor-react-native';
import useImageUpload from '../../hooks/useImageUpload';
import DatePickerField from '../../components/DatePickerField';
import TypeSelectorComponent, { TypeOption as TypeOptionData } from '../../components/TypeSelector';

const RECORD_TYPES: TypeOptionData[] = [
  { label: 'Vaccine', icon: <Icon.Syringe size={20} color="#7289DA" /> },
  { label: 'Vet Appointment', icon: <Icon.Stethoscope size={20} color="#7289DA" /> },
  { label: 'Medication', icon: <Icon.Pill size={20} color="#7289DA" /> },
  { label: 'Pet Groomer', icon: <Icon.Scissors size={20} color="#7289DA" /> },
  { label: 'Other', icon: <Icon.FileText size={20} color="#7289DA" /> },
];

export default function AddHealthRecordScreen({ navigation, route }) {
  const { record } = route.params;

  const [type, setType] = useState(record?.type || '');
  const [description, setDescription] = useState(record?.description || '');
  const [date, setDate] = useState(record?.date ? new Date(record.date) : new Date());
  const [image, setImage] = useState(record?.image || null);
  const [extraInfo, setExtraInfo] = useState(record?.extraInfo || '');
  const { selectedDog } = useContext(DogProfileContext);
  const { pickImage, uploadImage, uploading } = useImageUpload('healthRecords');

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleSave = async () => {
    if (
      !type ||
      (!description && type !== 'Medication' && type !== 'Vaccine') ||
      (!extraInfo && (type === 'Medication' || type === 'Vaccine')) ||
      !date
    ) {
      Alert.alert('Please fill out all required fields');
      return;
    }

    let imageUrl = image;
    if (image && image.startsWith('file://')) {
      imageUrl = await uploadImage(image);
      if (!imageUrl) {
        Alert.alert('Error', 'Image upload failed. Cannot save the health record.');
        return;
      }
    }

    const newRecord = {
      type,
      description,
      date: date.toISOString(),
      image: imageUrl,
      dogId: selectedDog.id,
      extraInfo,
    };

    try {
      if (route.params?.isEditMode) {
        await db.collection('healthRecords').doc(record.id).update(newRecord);
        if (route.params?.onGoBack) route.params.onGoBack();
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
            <TypeSelectorComponent
              types={RECORD_TYPES}
              selected={type}
              onSelect={setType}
              renderOption={(item, isSelected, onPress) => (
                <TypeOption key={item.label} onPress={onPress} selected={isSelected}>
                  {item.icon}
                  <TypeText selected={isSelected}>{item.label}</TypeText>
                </TypeOption>
              )}
            />
          </TypeSelector>

          {!type && (
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Icon.Question size={40} color="#7289DA" />
              <Text style={{ color: '#7289DA', fontSize: 16, marginTop: 10 }}>
                Please select a type to continue
              </Text>
            </View>
          )}

          {type && (
            <>
              {type === 'Medication' && (
                <Input value={extraInfo} onChangeText={setExtraInfo} placeholder="Name of medication" />
              )}
              {type === 'Vaccine' && (
                <Input value={extraInfo} onChangeText={setExtraInfo} placeholder="Name of vaccine" />
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

              <DatePickerField
                value={date}
                onChange={setDate}
                mode="date"
                label="Select Date"
                renderButton={(onPress, displayText) => (
                  <DatePickerButton onPress={onPress}>
                    <DatePickerText>{displayText}</DatePickerText>
                  </DatePickerButton>
                )}
              />

              <CustomButton onPress={handlePickImage}>
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
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
