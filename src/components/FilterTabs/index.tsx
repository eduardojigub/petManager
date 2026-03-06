import React, { useState } from 'react';
import { FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import {
  FilterTabsContainer,
  FilterTabsRow,
  ScrollHint,
  FilterTab,
  FilterTabText,
} from './styles';

interface TabItem {
  key: string;
  value: string | null;
}

interface FilterTabsProps {
  tabs: TabItem[];
  activeValue: string | null;
  onSelect: (value: string | null) => void;
  showScrollHint?: boolean;
  renderLabel: (tab: TabItem) => string;
}

export default function FilterTabs({
  tabs,
  activeValue,
  onSelect,
  showScrollHint = false,
  renderLabel,
}: FilterTabsProps) {
  const [showFade, setShowFade] = useState(showScrollHint);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!showScrollHint) return;
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
    if (isAtEnd && showFade) setShowFade(false);
    else if (!isAtEnd && !showFade) setShowFade(true);
  };

  return (
    <FilterTabsContainer>
      <FilterTabsRow>
        <FlatList
          horizontal
          data={tabs}
          renderItem={({ item }) => {
            const isSelected = activeValue === item.value;
            return (
              <FilterTab
                selected={isSelected}
                onPress={() => onSelect(item.value)}
              >
                <FilterTabText selected={isSelected}>
                  {renderLabel(item)}
                </FilterTabText>
              </FilterTab>
            );
          }}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          onScroll={showScrollHint ? handleScroll : undefined}
          scrollEventThrottle={showScrollHint ? 16 : undefined}
        />
      </FilterTabsRow>
      {showScrollHint && showFade && (
        <ScrollHint>
          <CaretRight size={16} color="#999" />
        </ScrollHint>
      )}
    </FilterTabsContainer>
  );
}
