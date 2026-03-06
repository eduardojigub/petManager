import React from 'react';
import { Platform, TouchableWithoutFeedback, Keyboard, Switch } from 'react-native';
import { CalendarBlank, ArrowsClockwise } from 'phosphor-react-native';
import {
  KeyboardAvoidingContainer, Container, ContentContainer, SectionTitle,
  FormCard, InputGroup, InputLabel, StyledInput, DateButton, DateButtonText,
  RecurringRow, RecurringLabel, FrequencyChipsRow, FrequencyChip, FrequencyChipText,
  SaveButton, SaveButtonText,
} from './styles';
import DatePickerField from '../../components/DatePickerField';
import TypeChipGrid from '../../components/TypeChipGrid';
import { EXPENSE_TYPES } from '../../constants/typeOptions';
import { getExpenseIcon } from '../../utils/iconMappings';
import { EXPENSE_TYPE_COLOR, EXPENSE_TYPE_BG } from '../../constants/colors';
import { useExpenseForm } from './hooks/useExpenseForm';

const FREQUENCY_OPTIONS = [
  { key: 'add.weekly', value: 'weekly' },
  { key: 'add.monthly', value: 'monthly' },
  { key: 'add.yearly', value: 'yearly' },
] as const;

export default function AddExpenseScreen({ navigation, route }: any) {
  const { expense } = route.params || {};
  const form = useExpenseForm(expense);

  const onSave = () => {
    form.handleSave((addedExpense) => {
      if (addedExpense && route.params?.addExpense) route.params.addExpense(addedExpense);
      navigation.goBack();
    });
  };

  return (
    <KeyboardAvoidingContainer behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <ContentContainer>
            <SectionTitle>{form.t('add.selectType')}</SectionTitle>
            <TypeChipGrid
              types={EXPENSE_TYPES}
              selectedType={form.type}
              onSelect={form.setType}
              getIcon={getExpenseIcon}
              colorMap={EXPENSE_TYPE_COLOR}
              bgMap={EXPENSE_TYPE_BG}
            />

            {form.type ? (
              <>
                <FormCard>
                  <InputGroup>
                    <InputLabel>{form.t('add.title')}</InputLabel>
                    <StyledInput
                      value={form.expenseTitle} onChangeText={form.setExpenseTitle}
                      placeholder={form.t('add.titlePlaceholder')} placeholderTextColor="#ccc"
                      returnKeyType="done" onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{form.t('add.amount')}</InputLabel>
                    <StyledInput
                      value={form.amount} onChangeText={form.handleAmountChange}
                      placeholder="0.00" placeholderTextColor="#ccc"
                      keyboardType="numeric" returnKeyType="done" onSubmitEditing={Keyboard.dismiss}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{form.t('add.date')}</InputLabel>
                    <DatePickerField
                      value={form.date} onChange={form.setDate} mode="date" label={form.t('add.selectDate')}
                      renderButton={(onPress, displayText) => (
                        <DateButton onPress={onPress}>
                          <CalendarBlank size={20} color="#41245c" />
                          <DateButtonText hasValue>{displayText}</DateButtonText>
                        </DateButton>
                      )}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>{form.t('add.recurring')}</InputLabel>
                    <RecurringRow>
                      <ArrowsClockwise size={20} color="#41245c" />
                      <RecurringLabel>{form.t('add.repeatExpense')}</RecurringLabel>
                      <Switch
                        value={form.recurring} onValueChange={form.setRecurring}
                        trackColor={{ false: '#ddd', true: '#7289da' }}
                        thumbColor={form.recurring ? '#41245c' : '#f4f3f4'}
                      />
                    </RecurringRow>
                    {form.recurring && (
                      <FrequencyChipsRow>
                        {FREQUENCY_OPTIONS.map((option) => (
                          <FrequencyChip
                            key={option.value}
                            selected={form.recurringFrequency === option.value}
                            onPress={() => form.setRecurringFrequency(option.value)}
                          >
                            <FrequencyChipText selected={form.recurringFrequency === option.value}>
                              {form.t(option.key)}
                            </FrequencyChipText>
                          </FrequencyChip>
                        ))}
                      </FrequencyChipsRow>
                    )}
                  </InputGroup>
                </FormCard>

                <SaveButton onPress={onSave}>
                  <SaveButtonText>
                    {expense ? form.t('add.updateExpense') : form.t('add.saveExpense')}
                  </SaveButtonText>
                </SaveButton>
              </>
            ) : null}
          </ContentContainer>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingContainer>
  );
}
