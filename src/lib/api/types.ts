/* ───── Enums ───── */

/** Integer enum matching Brain.Api MarketplaceOrderStatus (JsonStringEnumConverter OFF) */
export type MarketplaceOrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
// 0=PendingApproval, 1=Accepted, 2=Rejected, 3=AutoRejected,
// 4=Cancelled, 5=InProgress, 6=Completed, 7=Disputed

export type ProductUnitType = 'SquareMeter' | 'Piece' | 'Kilogram' | 'Meter';

/** Integer enum matching Brain.Api.Domain.MarketplaceProductCategory */
export type MarketplaceProductCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/* ───── Paginated Response ───── */

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/* ───── Brand ───── */

export interface BrandResponseDto {
  id: number;
  code: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  categoryFilter: number[];
  countryFilter: string | null;
  footerText: string | null;
  socialLinks: Record<string, string> | null;
  categories: CategoryResponseDto[];
}

/* ───── Category ───── */

export interface CategoryResponseDto {
  id: number;
  key: string;
  name: string;
  iconName: string | null;
  imageUrl: string | null;
  companyCount?: number;
}

/* ───── Company ───── */

export interface CompanyListDto {
  companyId: string;
  companyName: string;
  slug: string | null;
  logoUrl: string | null;
  city: string | null;
  description: string | null;
  averageRating: number;
  totalReviewCount: number;
  completedOrderCount: number;
  responseTimeMinutes: number;
  acceptingOrders: boolean;
  categoryKeys: string[];
  photoUrls: string[] | null;
  distanceKm: number | null;
}

export interface CompanyDetailDto {
  companyId: string;
  companyName: string;
  slug: string | null;
  logoUrl: string | null;
  city: string | null;
  phone: string | null;
  description: string | null;
  averageRating: number;
  totalReviewCount: number;
  completedOrderCount: number;
  responseTimeMinutes: number;
  acceptingOrders: boolean;
  photoUrls: string[] | null;
  workingHours: Record<string, string> | null;
  serviceAreaDescription: string | null;
  serviceAreas: string[];
  minimumOrderAmount: number;
  categories: CategoryResponseDto[];
  products: ProductDto[];
  recentReviews: ReviewDto[];
}

export interface ProductDto {
  productId: number;
  productName: string;
  unitType: number;
  unitPrice: number;
  currency?: string;
  isActive: boolean;
  marketplaceCategory: MarketplaceProductCategory | null;
}

export interface ReviewDto {
  id: number;
  customerName: string;
  rating: number;
  comment: string | null;
  qualityRating: number | null;
  punctualityRating: number | null;
  communicationRating: number | null;
  priceRating: number | null;
  companyResponse: string | null;
  companyRespondedAt: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  beforePhotoUrls: string[] | null;
  afterPhotoUrls: string[] | null;
  orderTotal: number | null;
  orderCurrency: string | null;
  serviceSummary: string | null;
  companyName: string | null;
}

/* ───── Search Query ───── */

export interface CompanySearchQuery {
  city?: string;
  categoryId?: number;
  minRating?: number;
  sortBy?: 'rating' | 'distance' | 'responseTime' | 'completedOrders';
  lat?: number;
  lng?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}

/* ───── Auth ───── */

export interface RequestOtpRequest {
  phone: string;
  brandCode?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
  name?: string;
  brandCode?: string;
}

export interface AuthResponseDto {
  customerId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  isNewUser: boolean;
  name: string | null;
  phone: string | null;
}

/* ───── Customer ───── */

export interface CustomerProfileDto {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  avatarUrl: string | null;
  preferredLanguage: string | null;
  isPhoneVerified: boolean;
  totalOrders: number;
  createdAt: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  city?: string;
}

/* ───── Address ───── */

export interface AddressDto {
  id: number;
  label: string;
  fullAddress: string;
  city: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  label: string;
  fullAddress: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest {
  label?: string;
  fullAddress?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

/* ───── Order ───── */

export interface CreateOrderRequest {
  companyId: string;
  brandCode: string;
  addressId?: number;
  addressSnapshot?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  preferredPickupDate?: string;
  preferredPickupTimeStart?: string;
  preferredPickupTimeEnd?: string;
  customerNotes?: string;
  source?: string;
  beforePhotoUrls?: string[];
}

export interface OrderResponseDto {
  id: number;
  marketplaceOrderCode: string;
  brandCode: string;
  status: MarketplaceOrderStatus;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  addressSnapshot: string;
  city: string | null;
  customerName: string;
  customerPhone: string;
  preferredPickupDate: string | null;
  customerNotes: string | null;
  trackingCode: string | null;
  trackingId: string | null;
  rejectionReason: string | null;
  acceptedAt: string | null;
  estimatedPickupByCompany: string | null;
  autoRejectAt: string;
  source: string;
  createdAt: string;
  completedAt: string | null;
  beforePhotoUrls: string[] | null;
  afterPhotoUrls: string[] | null;
  // Internal order status: 0=PendingPickup, 1=InWashing, 2=ReadyForDelivery, 3=OutForDelivery, 4=Delivered
  internalOrderStatus: number | null;
  orderItems: OrderItemDto[] | null;
  totalAmount: number | null;
  currency: string | null;
}

export interface OrderItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  width: number | null;
  height: number | null;
  area: number | null;
  itemNotes: string | null;
}

/* ───── Review ───── */

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
  qualityRating?: number;
  punctualityRating?: number;
  communicationRating?: number;
  priceRating?: number;
}

/* ───── City ───── */

export interface CityDto {
  city: string;
  companyCount: number;
}
