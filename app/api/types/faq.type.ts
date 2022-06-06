export interface IFaq {
  question: string;
  answer: string;
  type?: "GENERAL" | "ONG" | "DONOR";
  status?: "ACTIVE" | "INACTIVE";
}