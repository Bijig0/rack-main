import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DomBindingMapping } from '@/types/domBinding';

// NOTE: This file uses API endpoints instead of direct database access,
// as postgres/drizzle don't work in browser environments.

/**
 * Fetch the PDF ID for rental appraisal from the database
 */
async function fetchPdfId(): Promise<number> {
  const response = await fetch('/api/pdf-info');
  if (!response.ok) {
    throw new Error('Failed to fetch PDF info');
  }
  const data = await response.json();
  return data.id;
}

/**
 * Fetch all DOM bindings via API
 */
export function useFetchDomBindings() {
  return useQuery({
    queryKey: ['domBindings'],
    queryFn: async (): Promise<DomBindingMapping[]> => {
      // First get the PDF ID dynamically
      const pdfId = await fetchPdfId();

      const response = await fetch(`/api/bindings/${pdfId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bindings');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

/**
 * Save DOM bindings (bulk update - replaces all bindings)
 */
export function useSaveDomBindings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bindings: DomBindingMapping[]) => {
      // Get the PDF ID dynamically
      const pdfId = await fetchPdfId();

      const response = await fetch(`/api/bindings/${pdfId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bindings),
      });
      if (!response.ok) {
        throw new Error('Failed to save bindings');
      }
      console.log('✅ Bindings saved successfully');
      return bindings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domBindings'] });
    },
    onError: (error) => {
      console.error('Failed to save bindings:', error);
    },
  });
}

/**
 * Delete a single DOM binding
 * Note: This requires a DELETE /api/bindings/:id endpoint to be implemented
 */
export function useDeleteDomBinding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/bindings/item/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete binding');
      }
      console.log('✅ Binding deleted successfully');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domBindings'] });
    },
    onError: (error) => {
      console.error('Failed to delete binding:', error);
    },
  });
}
