import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";

export const scheduleTimeSchema = z.object({
  id: z.number().optional(),
  resource_schedule_id: z.number().optional(),
  name: z.string().nullable(),
  capacity: z.number(),
  start_time: z.custom<Dayjs>((value) => value instanceof dayjs, 'Invalid time'),
  stop_time: z.custom<Dayjs>((value) => value instanceof dayjs, 'Invalid time'),
})

export const schedulePeriodOfTimeSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_date: z.custom<Dayjs>((value) => value instanceof dayjs, 'Invalid time'),
  stop_date: z.custom<Dayjs>((value) => value instanceof dayjs, 'Invalid time'),
  days_of_week: z.array(z.number()),
  months_of_year: z.array(z.number()),
})

export const scheduleFormSchema = z.object({
  id: z.number().optional(),
  resource_id: z.number().optional(),
  name: z.string().min(1),
  priority: z.number(),
  times: z.array(scheduleTimeSchema),
  period_of_times: z.array(schedulePeriodOfTimeSchema)
});

export type ScheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;
export type ScheduleTimeSchemaType = z.infer<typeof scheduleTimeSchema>;
export type SchedulePeriodOfTimeSchemaType = z.infer<typeof schedulePeriodOfTimeSchema>;
