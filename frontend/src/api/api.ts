const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  total?: number;
}

// ---------------- PRODUCTS API ----------------
export async function getProductsApi(params?: {
  category?: string;
  search?: string;
  ageGroup?: string;
  gender?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.ageGroup) query.append('ageGroup', params.ageGroup);
  if (params?.gender) query.append('gender', params.gender);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
  return res.json();
}

export async function getProductByIdApi(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  return res.json();
}

// ---------------- ORDERS API ----------------
export async function createOrderApi(orderData: any) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

export async function getCustomerOrdersApi(mobileOrEmail: string) {
  const res = await fetch(`${API_BASE_URL}/orders/customer/${mobileOrEmail}`);
  return res.json();
}

export async function getOrderTrackingApi(orderIdOrTracking: string) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderIdOrTracking}`);
  return res.json();
}

// ---------------- BANNERS API ----------------
export async function getBannersApi(group?: string) {
  const url = group ? `${API_BASE_URL}/banners?group=${group}` : `${API_BASE_URL}/banners`;
  const res = await fetch(url);
  return res.json();
}

// ---------------- COUPONS API ----------------
export async function validateCouponApi(code: string, cartTotal: number) {
  const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, cartTotal }),
  });
  return res.json();
}

// ---------------- FRANCHISE LEADS API ----------------
export async function submitFranchiseLeadApi(leadData: any) {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  return res.json();
}

// ---------------- CONTACT FORM API ----------------
export async function submitContactMessageApi(messageData: any) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  });
  return res.json();
}

// ---------------- AUTH / USER API ----------------
export async function loginOrRegisterUserApi(mobile: string, name?: string, email?: string) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, name, email }),
  });
  return res.json();
}

