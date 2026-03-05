import React, { useContext, useState } from 'react';
import {
  Alert,
  Platform,
  Keyboard,
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
  PlaceholderContainer,
  PlaceholderText,
  KeyboardAvoidingContainer,
} from './styles';
import { DogProfileContext } from '../../context/DogProfileContext';
import { db } from '../../firebase/Firestore';
import { collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import { Question } from 'phosphor-react-native';
import useImageUpload from '../../hooks/useImageUpload';
import DatePickerField from '../../components/DatePickerField';
import TypeSelectorComponent from '../../components/TypeSelector';
import { StackScreenProps } from '@react-navigation/stack';
import { HealthStackParamList } from '../../types/navigation';
import { HEALTH_SCHEDULE_TYPES } from '../../constants/typeOptions';

type Props = StackScreenProps<HealthStackParamList, 'AddHealthRecord'>;

export default function AddHealthRecordScreen({ navigation, route }: Props) {
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
        await updateDoc(doc(db, 'healthRecords', record.id), newRecord);
        if (route.params?.onGoBack) route.params.onGoBack();
        navigation.navigate('HealthRecords');
      } else {
        await addDoc(collection(db, 'healthRecords'), newRecord);
        if (route.params?.addRecord) route.params.addRecord(newRecord);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving health record', error);
      Alert.alert('Error', 'Unable to save the health record.');
    }
  };

  return (
    <KeyboardAvoidingContainer
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Title>Select the type</Title>

          <TypeSelector>
            <TypeSelectorComponent
              types={HEALTH_SCHEDULE_TYPES}
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
            <PlaceholderContainer>
              <Question size={40} color="#7289DA" />
              <PlaceholderText>
                Please select a type to continue
              </PlaceholderText>
            </PlaceholderContainer>
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
    </KeyboardAvoidingContainer>
  );
}
