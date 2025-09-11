'use client';

import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { usePaginatedQuery } from '@/hooks/query/usePaginatedQuery';
import useDebounce from '@/hooks/useDebounce';
import {
  getCategories,
  getProducts,
  type Category,
  type Product,
} from '@/lib/api/products';

// Small helper to avoid ternaries used only for side effects
const setOrDelete = (params: URLSearchParams, key: string, val?: string) => {
  if (val && val.length) params.set(key, val);
  else params.delete(key);
};

export default function ListingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Base path with locale, e.g., /en/listings
  const basePath = useMemo(() => {
    const parts = (pathname || '/').split('/');
    const locale = parts[1] || 'en';
    return `/${locale}/listings`;
  }, [pathname]);

  // Local UI state for filters (single source of truth while typing)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Keep a draft query string and debounce it (fast: 300ms)
  const [draftQS, setDraftQS] = useState(searchParams.toString());
  const debouncedQS = useDebounce(draftQS, 300);

  // On URL changes (back/forward or external), mirror into local state + draft
  useEffect(() => {
    const qs = searchParams.toString();
    setDraftQS(qs);

    // hydrate from the actual URL so inputs reflect external nav
    const url = new URLSearchParams(qs);
    setSearchQuery(url.get('q') || '');
    setSelectedCategoryId(url.get('categoryId') || 'All');
    setMinPrice(url.get('minPrice') || '');
    setMaxPrice(url.get('maxPrice') || '');
  }, [searchParams]);

  // Push only when debouncedQS differs from current URL
  useEffect(() => {
    const currentQS = searchParams.toString();
    if (debouncedQS === currentQS) return;

    const href = debouncedQS ? `${basePath}?${debouncedQS}` : basePath;
    // Cast for typed routes; disable typedRoutes if you prefer to avoid casts
    router.replace(href as unknown as Route);
  }, [debouncedQS, searchParams, basePath, router]);

  // Load categories once
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        const fetched = await getCategories();
        setCategories(fetched);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategoryError('Failed to load categories.');
      }
    };
    run();
  }, []);

  // Products query, synced to URL (only whitelisted keys flow through)
  const {
    data: products,
    isLoading,
    isFetching,
  } = usePaginatedQuery<Product[]>(['products'], 0, 10, getProducts, {
    syncFromUrl: true,
    whitelistKeys: [
      'offset',
      'limit',
      'q',
      'categoryId',
      'minPrice',
      'maxPrice',
    ],
    // keep old data while the new query is fetching to reduce flicker
    staleTime: 5_000,
  });

  // Handlers update local state immediately and schedule a debounced URL update
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    const next = new URLSearchParams(searchParams.toString());
    setOrDelete(next, 'q', value);
    setDraftQS(next.toString());
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    const next = new URLSearchParams(searchParams.toString());
    if (value !== 'All') next.set('categoryId', value);
    else next.delete('categoryId');
    setDraftQS(next.toString());
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    const next = new URLSearchParams(searchParams.toString());
    setOrDelete(next, 'minPrice', value);
    setDraftQS(next.toString());
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    const next = new URLSearchParams(searchParams.toString());
    setOrDelete(next, 'maxPrice', value);
    setDraftQS(next.toString());
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('All');
    setMinPrice('');
    setMaxPrice('');
    setDraftQS(''); // clears query; debounced effect will replace to basePath
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
              value={selectedCategoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
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
      {(isLoading || isFetching) && (
        <p className="text-center">Loading listings...</p>
      )}
      {categoryError && (
        <p className="text-center text-red-500">{categoryError}</p>
      )}

      {!isLoading && !isFetching && !categoryError && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="rounded-lg border p-4 shadow-sm">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  className="mb-4 h-48 w-full rounded-md object-cover"
                />
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">
                  {product.category?.name}
                </p>
                <p className="mt-2 text-xl font-bold">${product.price}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {product.description}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No listings found matching your criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
