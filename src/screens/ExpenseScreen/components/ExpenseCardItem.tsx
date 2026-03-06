import React from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { ArrowsClockwise, TrashSimple } from 'phosphor-react-native';
import {
  ExpenseCard,
  ExpenseIconContainer,
  ExpenseContent,
  ExpenseTitle,
  ExpenseSubtitle,
  ExpenseRight,
  ExpenseAmount,
  ExpenseDate,
  SwipeDeleteButton,
  RecurringBadge,
  RecurringBadgeText,
} from '../styles';
import { getExpenseIcon } from '../../../utils/iconMappings';
import { formatShortDate } from '../../../utils/dateFormarter';
import { EXPENSE_TYPE_COLOR, EXPENSE_TYPE_BG, EXPENSE_BORDER_COLOR } from '../../../constants/colors';

interface ExpenseCardItemProps {
  item: any;
  onDelete: (id: string) => void;
  onPress: (item: any) => void;
  formatCurrency: (value: number) => string;
  t: (key: string) => string;
}

export default function ExpenseCardItem({ item, onDelete, onPress, formatCurrency, t }: ExpenseCardItemProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <SwipeDeleteButton onPress={() => onDelete(item.id)}>
          <TrashSimple size={22} color="#fff" />
        </SwipeDeleteButton>
      )}
      overshootRight={false}
    >
      <ExpenseCard
        borderColor={EXPENSE_BORDER_COLOR[item.type] || '#41245c'}
        onPress={() => onPress(item)}
      >
        <ExpenseIconContainer bgColor={EXPENSE_TYPE_BG[item.type] || '#f0eff4'}>
          {getExpenseIcon(item.type, 20, EXPENSE_TYPE_COLOR[item.type] || '#41245c')}
        </ExpenseIconContainer>
        <ExpenseContent>
          <ExpenseTitle>{item.title}</ExpenseTitle>
          <ExpenseSubtitle>{item.type}</ExpenseSubtitle>
          {item.recurring && (
            <RecurringBadge>
              <ArrowsClockwise size={10} color="#41245c" />
              <RecurringBadgeText>
                {item.recurringFrequency === 'weekly' ? t('expenses.weekly') :
                 item.recurringFrequency === 'yearly' ? t('expenses.yearly') : t('expenses.monthly')}
              </RecurringBadgeText>
            </RecurringBadge>
          )}
        </ExpenseContent>
        <ExpenseRight>
          <ExpenseAmount>{formatCurrency(item.amount)}</ExpenseAmount>
          <ExpenseDate>{formatShortDate(item.date)}</ExpenseDate>
        </ExpenseRight>
      </ExpenseCard>
    </Swipeable>
  );
}
