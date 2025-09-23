import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface FilterOptions {
  fragrances: string[];
  festivals: string[];
  themes: string[];
  weights: string[];
  priceRanges: {
    min: number;
    max: number;
  };
  categories: string[];
}

export interface FilterState {
  selectedFestivals: string[];
  selectedFragrances: string[];
  selectedThemes: string[];
  selectedWeights: string[];
  priceRange: [number, number];
  selectedCategories: string[];
}

interface FilterContextType {
  filterOptions: FilterOptions | null;
  filterState: FilterState;
  loading: boolean;
  error: string | null;
  updateFilterState: (newState: Partial<FilterState>) => void;
  refreshFilters: () => Promise<void>;
  resetFilters: () => void;
  applyCollectionFilter: (collectionTitle: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    selectedFestivals: [],
    selectedFragrances: [],
    selectedThemes: [],
    selectedWeights: [],
    priceRange: [0, 1000],
    selectedCategories: [],
  });

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/filters');
      setFilterOptions(response.data);

      // Update price range if we have new data
      if (response.data.priceRanges) {
        setFilterState(prev => ({
          ...prev,
          priceRange: [response.data.priceRanges.min, response.data.priceRanges.max]
        }));
      }
    } catch (err: any) {
      console.error('Error fetching filter options:', err);
      setError(err.response?.data?.message || 'Failed to fetch filter options');
    } finally {
      setLoading(false);
    }
  };

  const refreshFilters = async () => {
    await fetchFilterOptions();
  };

  const updateFilterState = (newState: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newState }));
  };

  const resetFilters = () => {
    if (filterOptions) {
      setFilterState({
        selectedFestivals: [],
        selectedFragrances: [],
        selectedThemes: [],
        selectedWeights: [],
        priceRange: [filterOptions.priceRanges.min, filterOptions.priceRanges.max],
        selectedCategories: [],
      });
    }
  };

  const applyCollectionFilter = (collectionTitle: string) => {
    if (!filterOptions) return;

    const title = collectionTitle.toLowerCase().trim();

    // Check if title matches any festival
    const matchingFestival = filterOptions.festivals.find(festival =>
      festival.toLowerCase().includes(title) || title.includes(festival.toLowerCase())
    );

    // Check if title matches any fragrance
    const matchingFragrance = filterOptions.fragrances.find(fragrance =>
      fragrance.toLowerCase().includes(title) || title.includes(fragrance.toLowerCase())
    );

    // Check if title matches any theme
    const matchingTheme = filterOptions.themes.find(theme =>
      theme.toLowerCase().includes(title) || title.includes(theme.toLowerCase())
    );

    // Check if title matches any weight
    const matchingWeight = filterOptions.weights.find(weight =>
      weight.toLowerCase().includes(title) || title.includes(weight.toLowerCase())
    );

    // Check if title matches any category
    const matchingCategory = filterOptions.categories.find(category =>
      category.toLowerCase().includes(title) || title.includes(category.toLowerCase())
    );

    // Apply the first match found
    if (matchingFestival) {
      setFilterState(prev => ({
        ...prev,
        selectedFestivals: [matchingFestival]
      }));
    } else if (matchingFragrance) {
      setFilterState(prev => ({
        ...prev,
        selectedFragrances: [matchingFragrance]
      }));
    } else if (matchingTheme) {
      setFilterState(prev => ({
        ...prev,
        selectedThemes: [matchingTheme]
      }));
    } else if (matchingWeight) {
      setFilterState(prev => ({
        ...prev,
        selectedWeights: [matchingWeight]
      }));
    } else if (matchingCategory) {
      setFilterState(prev => ({
        ...prev,
        selectedCategories: [matchingCategory]
      }));
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const value: FilterContextType = {
    filterOptions,
    filterState,
    loading,
    error,
    updateFilterState,
    refreshFilters,
    resetFilters,
    applyCollectionFilter,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
