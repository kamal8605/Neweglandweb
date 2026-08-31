import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Address {
  id: number;
  label?: string | null;
  first_name: string;
  last_name: string;
  company?: string | null;
  address_1: string;
  address_2?: string | null;
  city: string;
  state?: string | null;
  postcode: string;
  country: string;
  phone?: string | null;
  is_default?: boolean;
}

export type NewAddress = Omit<Address, "id"> & { is_default?: boolean };

export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: () =>
      api.get<Address[] | { data: Address[] }>("/addresses").then((r) =>
        Array.isArray(r.data) ? r.data : r.data.data
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewAddress) =>
      api.post<{ data: Address }>("/addresses", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewAddress> }) =>
      api.patch<{ data: Address }>(`/addresses/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/addresses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
