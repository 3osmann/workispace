
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PropertyDetailsScreen from '../../../src/pages/owner/PropertyDetailsScreen';

export default function PropertyDetailsPage() {
  const params = useLocalSearchParams();
  const propertyId = params.propertyId as string;
  
  return <PropertyDetailsScreen propertyId={propertyId} />;
}
