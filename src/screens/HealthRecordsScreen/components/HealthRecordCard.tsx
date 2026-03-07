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
  RecordTime,
} from '../styles';
import { getHealthScheduleIcon } from '../../../utils/iconMappings';
import { formatShortDate } from '../../../utils/dateFormarter';
import { formatTime } from '../../../utils/timeFormatting';
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
  const isScheduled = item.status === 'scheduled';
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
        borderColor={isScheduled ? '#7289da' : (HEALTH_BORDER_COLOR[item.type] || '#41245c')}
        onPress={() => onPress(item)}
        style={isScheduled ? { opacity: 0.95 } : undefined}
      >
        <RecordIconContainer bgColor={isScheduled ? '#e8ecf7' : (HEALTH_TYPE_BG[item.type] || '#f0eff4')}>
          {getHealthScheduleIcon(item.type, 20, isScheduled ? '#7289da' : (HEALTH_TYPE_COLOR[item.type] || '#41245c'))}
        </RecordIconContainer>
        <RecordContent>
          <RecordTitle>{displayText}</RecordTitle>
          <RecordSubtitle>{item.description || item.type}</RecordSubtitle>
        </RecordContent>
        <RecordRight>
          <RecordDate>{formatShortDate(item.date)}</RecordDate>
          {isScheduled && item.time && (
            <RecordTime>{formatTime(item.time)}</RecordTime>
          )}
          <RecordBadge bgColor={badge.bg}>
            <RecordBadgeText color={badge.color}>{badge.label}</RecordBadgeText>
          </RecordBadge>
        </RecordRight>
      </RecordCard>
    </Swipeable>
  );
}
