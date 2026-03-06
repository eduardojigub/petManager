import React, { useContext } from 'react';
import { Text } from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';

interface Props {
  translationKey: string;
}

export default function TranslatedHeaderTitle({ translationKey }: Props) {
  const { t } = useContext(LanguageContext);
  return (
    <Text style={{ fontFamily: 'Poppins_400Regular', fontWeight: 'normal', fontSize: 17 }}>
      {t(translationKey)}
    </Text>
  );
}
