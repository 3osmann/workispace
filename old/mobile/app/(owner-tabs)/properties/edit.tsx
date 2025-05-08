
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import EditPropertyScreen from '../../../src/pages/owner/EditPropertyScreen';

export default function EditPropertyPage() {
  const params = useLocalSearchParams();
  const propertyId = params.propertyId as string;
  
  return <EditPropertyScreen propertyId={propertyId} />;
}
