'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for demonstration
const mockListings = [
  {
    id: '1',
    name: 'Cozy Apartment',
    category: 'Apartment',
    price: 120,
    description: 'A lovely place in the city center.',
  },
  {
    id: '2',
    name: 'Spacious Villa',
    category: 'Villa',
    price: 300,
    description: 'Perfect for a family getaway.',
  },
  {
    id: '3',
    name: 'Downtown Studio',
    category: 'Apartment',
    price: 90,
    description: 'Modern studio with great views.',
  },
  {
    id: '4',
    name: 'Beachfront House',
    category: 'House',
    price: 450,
    description: 'Enjoy the ocean breeze.',
  },
  {
    id: '5',
    name: 'Mountain Cabin',
    category: 'Cabin',
    price: 180,
    description: 'Secluded cabin for nature lovers.',
  },
  {
    id: '6',
    name: 'Urban Loft',
    category: 'Apartment',
    price: 150,
    description: 'Stylish loft in a vibrant neighborhood.',
  },
];

const categories = ['All', 'Apartment', 'Villa', 'House', 'Cabin'];

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredListings, setFilteredListings] = useState(mockListings);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Update URL with new search parameters
  const updateUrl = useCallback(
    debounce((newParams: URLSearchParams) => {
      const queryString = newParams.toString();
      const currentLocale = window.location.pathname.split('/')[1]; // Extract locale from path
      router.push(
        `/${currentLocale}/listings${queryString ? `?${queryString}` : ''}`
      );
    }, 500),
    [router]
  );

  // Effect to read URL params on initial load and on URL changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'All';
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';

    setSearchQuery(q);
    setSelectedCategory(category);
    setMinPrice(minP);
    setMaxPrice(maxP);

    // Apply filters to mock data
    let currentListings = mockListings;

    if (q) {
      currentListings = currentListings.filter(
        (listing) =>
          listing.name.toLowerCase().includes(q.toLowerCase()) ||
          listing.description.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (category !== 'All') {
      currentListings = currentListings.filter(
        (listing) => listing.category === category
      );
    }

    if (minP) {
      currentListings = currentListings.filter(
        (listing) => listing.price >= parseFloat(minP)
      );
    }

    if (maxP) {
      currentListings = currentListings.filter(
        (listing) => listing.price <= parseFloat(maxP)
      );
    }

    setFilteredListings(currentListings);
  }, [searchParams]);

  // Handlers for filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) newParams.set('q', value);
    else newParams.delete('q');
    updateUrl(newParams);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams.toString());
    if (value !== 'All') newParams.set('category', value);
    else newParams.delete('category');
    updateUrl(newParams);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) newParams.set('minPrice', value);
    else newParams.delete('minPrice');
    updateUrl(newParams);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) newParams.set('maxPrice', value);
    else newParams.delete('maxPrice');
    updateUrl(newParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    const currentLocale = window.location.pathname.split('/')[1]; // Extract locale from path
    router.push(`/${currentLocale}/listings`); // Navigate to base URL to clear all params
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Listings</h1>

      <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Filters</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="minPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Min Price
            </label>
            <Input
              id="minPrice"
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Max Price
            </label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="mt-1"
            />
          </div>
        </div>
        <Button onClick={handleClearFilters} className="mt-6">
          Clear Filters
        </Button>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Available Listings</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div key={listing.id} className="rounded-lg border p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{listing.name}</h3>
              <p className="text-sm text-gray-600">{listing.category}</p>
              <p className="mt-2 text-xl font-bold">${listing.price}</p>
              <p className="mt-1 text-sm text-gray-500">
                {listing.description}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No listings found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
