export interface AuctionListItem {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  bids: number;
  endAt: string;
  favorited?: boolean;
}

export interface AuctionDetail {
  id: string;
  title: string;
  description: string;
  current_price: number;
  start_price: number;
  year_purchased?: string | number;
  end_at: string;
  images?: { url: string }[];
  bids: number | { id: string; amount: number }[];
}

export interface AdminAuction {
  id: string;
  title: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  yearPurchased: number;
  endAt: string;
  isDeleted: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  images: { id: string; url: string }[];
}