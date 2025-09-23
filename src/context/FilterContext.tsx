import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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
  weightRanges?: {
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
  weightRange: [number, number];
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
    weightRange: [0, 1000],
    selectedCategories: [],
  });

  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/filters');
      setFilterOptions(response.data);

      // Update price range and weight range if we have new data
      if (response.data.priceRanges) {
        setFilterState(prev => ({
          ...prev,
          priceRange: [response.data.priceRanges.min, response.data.priceRanges.max]
        }));
      }

      if (response.data.weightRanges) {
        setFilterState(prev => ({
          ...prev,
          weightRange: [response.data.weightRanges.min, response.data.weightRanges.max]
        }));
      }
    } catch (err: unknown) {
      console.error('Error fetching filter options:', err);
      const message = (axios.isAxiosError(err) && err.response?.data?.message)
        || (err instanceof Error ? err.message : 'Failed to fetch filter options');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFilters = useCallback(async () => {
    await fetchFilterOptions();
  }, [fetchFilterOptions]);

  const updateFilterState = useCallback((newState: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newState }));
  }, []);

  const resetFilters = useCallback(() => {
    // Use fallback values if filterOptions is not loaded yet
    const defaultMinPrice = filterOptions?.priceRanges?.min || 0;
    const defaultMaxPrice = filterOptions?.priceRanges?.max || 1000;
    const defaultMinWeight = filterOptions?.weightRanges?.min || 0;
    const defaultMaxWeight = filterOptions?.weightRanges?.max || 1000;

    setFilterState({
      selectedFestivals: [],
      selectedFragrances: [],
      selectedThemes: [],
      selectedWeights: [],
      priceRange: [defaultMinPrice, defaultMaxPrice],
      weightRange: [defaultMinWeight, defaultMaxWeight],
      selectedCategories: [],
    });
  }, [filterOptions]);

  const applyCollectionFilter = useCallback((collectionTitle: string) => {
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
  }, [filterOptions]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const value: FilterContextType = useMemo(() => ({
    filterOptions,
    filterState,
    loading,
    error,
    updateFilterState,
    refreshFilters,
    resetFilters,
    applyCollectionFilter,
  }), [filterOptions, filterState, loading, error, updateFilterState, refreshFilters, resetFilters, applyCollectionFilter]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
