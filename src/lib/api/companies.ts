import { api } from './client';
import type {
  CompanyListDto,
  CompanyDetailDto,
  CompanySearchQuery,
  PaginatedResponse,
} from './types';

function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export async function getCompanies(
  query: CompanySearchQuery = {}
): Promise<PaginatedResponse<CompanyListDto>> {
  const qs = toQueryString(query as Record<string, unknown>);
  return api.get(`/api/mp/companies${qs}`);
}

export async function getCompanyDetail(
  slugOrId: string
): Promise<CompanyDetailDto> {
  return api.get(`/api/mp/companies/${slugOrId}`);
}

export async function revealPhone(
  companyId: string
): Promise<{ phone: string }> {
  return api.post(`/api/mp/companies/${companyId}/phone-reveal`);
}

export async function searchCompanies(
  query: CompanySearchQuery
): Promise<PaginatedResponse<CompanyListDto>> {
  const qs = toQueryString(query as Record<string, unknown>);
  return api.get(`/api/mp/search${qs}`);
}
