import React from 'react';
import { RenderContent } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedSeries({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="video-vintage" title="Series populares">
      {featured.map((series) => (
        <RenderContent key={series.id} item={series} variant="vertical" />
      ))}
    </FeaturedSection>
  );
}
