import React from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { TrashSimple } from 'phosphor-react-native';
import {
  ScheduleCard,
  ScheduleIconContainer,
  ScheduleContent,
  ScheduleTitle,
  ScheduleSubtitle,
  ScheduleRight,
  ScheduleDate,
  ScheduleTime,
  ScheduleBadge,
  ScheduleBadgeText,
  SwipeDeleteButton,
} from '../styles';
import { getHealthScheduleIcon } from '../../../utils/iconMappings';
import { formatScheduleDate, formatTime } from '../../../utils/timeFormatting';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG, SCHEDULE_BORDER_COLOR } from '../../../constants/colors';

interface ScheduleCardItemProps {
  item: any;
  onDelete: (id: string, notificationId: string) => void;
  onEdit: (item: any) => void;
  pastLabel: string;
  scheduledLabel: string;
}

export default function ScheduleCardItem({
  item,
  onDelete,
  onEdit,
  pastLabel,
  scheduledLabel,
}: ScheduleCardItemProps) {
  return (
    <Swipeable
      renderRightActions={() => (
        <SwipeDeleteButton onPress={() => onDelete(item.id, item.notificationId)}>
          <TrashSimple size={22} color="#fff" />
        </SwipeDeleteButton>
      )}
      overshootRight={false}
    >
      <ScheduleCard
        borderColor={SCHEDULE_BORDER_COLOR[item.type] || '#41245c'}
        isPast={item.isPast}
        onPress={() => onEdit(item)}
      >
        <ScheduleIconContainer bgColor={HEALTH_TYPE_BG[item.type] || '#f0eff4'}>
          {getHealthScheduleIcon(item.type, 20, HEALTH_TYPE_COLOR[item.type] || '#41245c')}
        </ScheduleIconContainer>
        <ScheduleContent>
          <ScheduleTitle>{item.description}</ScheduleTitle>
          <ScheduleSubtitle>{item.type}</ScheduleSubtitle>
        </ScheduleContent>
        <ScheduleRight>
          <ScheduleDate>{formatScheduleDate(item.date)}</ScheduleDate>
          <ScheduleTime>{formatTime(item.time)}</ScheduleTime>
          {item.isPast ? (
            <ScheduleBadge bgColor="#f0f0f0">
              <ScheduleBadgeText color="#999">{pastLabel}</ScheduleBadgeText>
            </ScheduleBadge>
          ) : (
            <ScheduleBadge bgColor="#e8f5e9">
              <ScheduleBadgeText color="#27ae60">{scheduledLabel}</ScheduleBadgeText>
            </ScheduleBadge>
          )}
        </ScheduleRight>
      </ScheduleCard>
    </Swipeable>
  );
}
