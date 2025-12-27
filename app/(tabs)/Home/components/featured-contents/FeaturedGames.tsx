import React from 'react';
import { RenderContent } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedGames({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="gamepad-variant" title="Videojuegos populares">
      {featured.map((game) => (
        <RenderContent key={game.id} item={game} variant="vertical" />
      ))}
    </FeaturedSection>
  );
}
