import React from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { TrashSimple } from 'phosphor-react-native';
import {
  RecordCard,
  RecordIconContainer,
  RecordContent,
  RecordTitle,
  RecordSubtitle,
  RecordRight,
  RecordDate,
  RecordBadge,
  RecordBadgeText,
  SwipeDeleteButton,
} from '../styles';
import { getHealthScheduleIcon } from '../../../utils/iconMappings';
import { formatShortDate } from '../../../utils/dateFormarter';
import { getBadgeStyle } from '../../../utils/badgeStyle';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG, HEALTH_BORDER_COLOR } from '../../../constants/colors';

interface HealthRecordCardProps {
  item: any;
  onDelete: (id: string) => void;
  onPress: (item: any) => void;
  t: (key: string) => string;
}

export default function HealthRecordCard({ item, onDelete, onPress, t }: HealthRecordCardProps) {
  const badge = getBadgeStyle(item, t);
  const displayText =
    item.type === 'Medication' || item.type === 'Vaccine'
      ? item.extraInfo || item.type
      : item.type;

  return (
    <Swipeable
      renderRightActions={() => (
        <SwipeDeleteButton onPress={() => onDelete(item.id)}>
          <TrashSimple size={22} color="#fff" />
        </SwipeDeleteButton>
      )}
      overshootRight={false}
    >
      <RecordCard
        borderColor={HEALTH_BORDER_COLOR[item.type] || '#41245c'}
        onPress={() => onPress(item)}
      >
        <RecordIconContainer bgColor={HEALTH_TYPE_BG[item.type] || '#f0eff4'}>
          {getHealthScheduleIcon(item.type, 20, HEALTH_TYPE_COLOR[item.type] || '#41245c')}
        </RecordIconContainer>
        <RecordContent>
          <RecordTitle>{displayText}</RecordTitle>
          <RecordSubtitle>{item.description || item.type}</RecordSubtitle>
        </RecordContent>
        <RecordRight>
          <RecordDate>{formatShortDate(item.date)}</RecordDate>
          <RecordBadge bgColor={badge.bg}>
            <RecordBadgeText color={badge.color}>{badge.label}</RecordBadgeText>
          </RecordBadge>
        </RecordRight>
      </RecordCard>
    </Swipeable>
  );
}
