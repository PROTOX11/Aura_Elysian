import { useMemo } from 'react';
import { useFilters as useFilterContext, FilterState } from '../context/FilterContext';

export const useFilters = () => {
  return useFilterContext();
};

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  primaryImage: string;
  category: string;
  rating: number;
  reviews: number;
  festival?: string[];
  fragrance?: string;
  weight?: string;
  theme?: string;
}

export const useProductFilters = (products: Product[]) => {
  const { filterState, filterOptions } = useFilters();

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    return products.filter(product => {
      // Price filter
      const priceMatch = product.price >= filterState.priceRange[0] &&
                        product.price <= filterState.priceRange[1];

      // Festival filter
      const festivalMatch = filterState.selectedFestivals.length === 0 ||
        (product.festival && product.festival.some(f =>
          filterState.selectedFestivals.includes(f)
        ));

      // Fragrance filter
      const fragranceMatch = filterState.selectedFragrances.length === 0 ||
        (product.fragrance && filterState.selectedFragrances.includes(product.fragrance));

      // Theme filter
      const themeMatch = filterState.selectedThemes.length === 0 ||
        (product.theme && filterState.selectedThemes.includes(product.theme));

      // Weight filter
      const weightMatch = filterState.selectedWeights.length === 0 ||
        (product.weight && filterState.selectedWeights.includes(product.weight));

      // Category filter
      const categoryMatch = filterState.selectedCategories.length === 0 ||
        filterState.selectedCategories.includes(product.category);

      return priceMatch && festivalMatch && fragranceMatch &&
             themeMatch && weightMatch && categoryMatch;
    });
  }, [products, filterState]);

  const getActiveFilterCount = () => {
    return (
      filterState.selectedFestivals.length +
      filterState.selectedFragrances.length +
      filterState.selectedThemes.length +
      filterState.selectedWeights.length +
      filterState.selectedCategories.length +
      (filterState.priceRange[0] > (filterOptions?.priceRanges.min || 0) ||
       filterState.priceRange[1] < (filterOptions?.priceRanges.max || 1000) ? 1 : 0)
    );
  };

  return {
    filteredProducts,
    activeFilterCount: getActiveFilterCount(),
    hasActiveFilters: getActiveFilterCount() > 0,
  };
};
