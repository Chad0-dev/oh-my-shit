import { ShitRecord } from "../services/recordService";

export interface CalendarDay {
  day: number | string;
  status: "none" | "normal" | "constipation" | "diarrhea" | "empty";
  records?: ShitRecord[];
}

export interface DisplayRecord {
  id: string;
  time: string;
  duration: string;
  status: string;
  color: string;
  note: string;
}
