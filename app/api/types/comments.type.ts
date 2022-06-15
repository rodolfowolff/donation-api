export interface IComments {
  userId: string;
  ongId: string;
  comment: string;
  status: "ACTIVE" | "INACTIVE";
}
