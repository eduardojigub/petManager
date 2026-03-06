import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CurrencyCircleDollar } from 'phosphor-react-native';
import {
  RecentActivityCard, RecentHeader, RecentTitle, ViewAllText,
  ActivityItem, ActivityIconContainer, ActivityInfo, ActivityTitle, ActivityTime,
  EmptyStateText, ScheduleLoadingIndicator,
} from '../styles';
import { getHealthScheduleIcon } from '../../../utils/iconMappings';
import { getTimeAgo } from '../../../utils/timeFormatting';
import { HEALTH_TYPE_COLOR, HEALTH_TYPE_BG } from '../../../constants/colors';

interface RecentActivityProps {
  recentActivity: any[];
  isLoading: boolean;
  onViewAll: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export default function RecentActivitySection({ recentActivity, isLoading, onViewAll, t }: RecentActivityProps) {
  const getActivityIcon = (item: any) => {
    if (item.icon === 'health' || item.icon === 'schedule') {
      return getHealthScheduleIcon(item.type, 18, HEALTH_TYPE_COLOR[item.type] || '#41245c');
    }
    return <CurrencyCircleDollar size={18} color="#e67e22" weight="bold" />;
  };

  const getActivityBg = (item: any) => {
    if (item.icon === 'health' || item.icon === 'schedule') return HEALTH_TYPE_BG[item.type] || '#ede8f5';
    if (item.icon === 'expense') return '#fdf0e0';
    return '#e0eef9';
  };

  return (
    <RecentActivityCard>
      <RecentHeader>
        <RecentTitle>{t('profile.recentActivity')}</RecentTitle>
        <TouchableOpacity onPress={onViewAll}>
          <ViewAllText>{t('profile.viewAll')}</ViewAllText>
        </TouchableOpacity>
      </RecentHeader>

      {isLoading ? (
        <ScheduleLoadingIndicator />
      ) : recentActivity.length > 0 ? (
        recentActivity.map((item) => (
          <ActivityItem key={item.id}>
            <ActivityIconContainer bgColor={getActivityBg(item)}>
              {getActivityIcon(item)}
            </ActivityIconContainer>
            <ActivityInfo>
              <ActivityTitle numberOfLines={1}>{item.title}</ActivityTitle>
              <ActivityTime>{item.date ? getTimeAgo(item.date, t) : ''}</ActivityTime>
            </ActivityInfo>
          </ActivityItem>
        ))
      ) : (
        <EmptyStateText>{t('profile.noActivity')}</EmptyStateText>
      )}
    </RecentActivityCard>
  );
}
