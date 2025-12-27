import React from 'react';
import { RenderContent } from '../../styled-components/RenderContent';
import FeaturedSection from '../FeaturedSection';

export default function FeaturedBooks({ featured }: { featured: any[] }) {
  return (
    <FeaturedSection icon="bookshelf" title="Libros populares">
      {featured.map((book) => (
        <RenderContent key={book.id} item={book} variant="vertical" />
      ))}
    </FeaturedSection>
  );
}
