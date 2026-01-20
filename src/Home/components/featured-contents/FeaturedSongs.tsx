import React from 'react';
import { RenderSong } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedSongs({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="music" title="Canciones populares">
      {featured.map((song) => (
        <RenderSong key={song.id} song={song} />
      ))}
    </FeaturedSection>
  );
}
