import React from 'react';
import { RenderContent } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedList({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="fire" title="Destacados de la semana">
      {featured.map((item: any) => (
        <RenderContent key={item.id} item={item} variant="horizontal" />
      ))}
    </FeaturedSection>
  );
}
