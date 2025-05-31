export interface Anthology {
  id?: number;
  title: string;
  image: string | File;
  description: string;
  topic: string;
  price: number;
}

export interface Transaction {
  id: number;
  anthology: Anthology;
  payment_id: string;
  amount: number;
  status: string;
  created_at: string;
}
