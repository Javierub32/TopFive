import React from 'react';
import { RenderContent } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedFilms({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="film" title="Películas populares">
      {featured.map((film) => (
        <RenderContent key={film.id} item={film} variant="vertical" />
      ))}
    </FeaturedSection>
  );
}
