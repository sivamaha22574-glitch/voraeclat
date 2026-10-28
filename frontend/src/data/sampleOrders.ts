import { CustomerOrder, CustomerUser } from '../types';

export const INITIAL_SAMPLE_ORDERS: CustomerOrder[] = [];

const STORAGE_KEY_CUSTOMER = 'voraeclat_customer_user';
const STORAGE_KEY_ORDERS = 'voraeclat_customer_orders';
const LEGACY_STORAGE_KEY_CUSTOMER = 'puppy_shame_customer_user';
const LEGACY_STORAGE_KEY_ORDERS = 'puppy_shame_customer_orders';

// Fake order IDs that should never be shown as real orders
const FAKE_SAMPLE_ORDER_IDS = new Set(['PS-784291', 'PS-521940', 'PS-310882', 'PS-TEST-999999', 'PS-905290']);

export const getStoredCustomer = (): CustomerUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMER) || localStorage.getItem(LEGACY_STORAGE_KEY_CUSTOMER);
    if (raw) {
      const user = JSON.parse(raw);
      // If customer is the old mock Pooja Verma, don't return it
      if (user?.mobile === '+91 98201 23456' || user?.mobile === '+91 9820123456' || user?.name === 'Pooja Verma') {
        localStorage.removeItem(STORAGE_KEY_CUSTOMER);
        localStorage.removeItem(LEGACY_STORAGE_KEY_CUSTOMER);
        return null;
      }
      return user;
    }
  } catch {
    // ignore
  }
  return null;
};

export const saveStoredCustomer = (customer: CustomerUser | null): void => {
  try {
    if (customer) {
      localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customer));
      localStorage.removeItem(LEGACY_STORAGE_KEY_CUSTOMER);
    } else {
      localStorage.removeItem(STORAGE_KEY_CUSTOMER);
      localStorage.removeItem(LEGACY_STORAGE_KEY_CUSTOMER);
    }
  } catch {
    // ignore
  }
};

export const getStoredOrders = (): CustomerOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS) || localStorage.getItem(LEGACY_STORAGE_KEY_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strip out any legacy sample orders
        const realOrders = parsed.filter((o) => !FAKE_SAMPLE_ORDER_IDS.has(o.orderId) && o.deliveryAddress?.name !== 'Pooja Verma');
        return realOrders;
      }
    }
  } catch {
    // ignore
  }
  return [];
};

export const appendCustomerOrder = (newOrder: CustomerOrder): CustomerOrder[] => {
  try {
    const currentOrders = getStoredOrders();
    const updated = [newOrder, ...currentOrders.filter((o) => o.orderId !== newOrder.orderId)];
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    return updated;
  } catch {
    return [newOrder];
  }
};

