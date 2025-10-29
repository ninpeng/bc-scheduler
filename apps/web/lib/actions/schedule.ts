"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../prisma";

export interface InitialState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
}

// Zod 스키마 정의
const ScheduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "제목을 입력해주세요"),
  startTime: z.string().min(1, "시작 시간을 선택해주세요"),
  endTime: z.string().min(1, "종료 시간을 선택해주세요"),
  description: z.string().optional(),
});

// 임시 사용자 ID (나중에 인증 시스템으로 대체)
const TEMP_USER_ID = "temp-user-id";

// 스케줄 생성
export async function createSchedule(
  _prevState: InitialState,
  formData: FormData,
) {
  try {
    const validatedFields = ScheduleSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validatedFields.success) {
      console.error("검증 오류:", validatedFields.error);
      return {
        error: "입력값이 유효하지 않습니다",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const {
      title: validTitle,
      startTime: validStartTime,
      endTime: validEndTime,
      description: validDescription,
    } = validatedFields.data;

    // 시작 시간이 종료 시간보다 빠른지 확인
    if (new Date(validStartTime) >= new Date(validEndTime)) {
      return {
        error: "종료 시간은 시작 시간보다 늦어야 합니다",
      };
    }

    console.log("DB에 저장할 데이터:", {
      title: validTitle,
      startTime: new Date(validStartTime),
      endTime: new Date(validEndTime),
      description: validDescription,
      userId: TEMP_USER_ID,
    });

    await prisma.schedule.create({
      data: {
        title: validTitle,
        startTime: new Date(validStartTime),
        endTime: new Date(validEndTime),
        description: validDescription,
        userId: TEMP_USER_ID,
      },
    });

    revalidatePath("/");
    return { success: "스케줄이 생성되었습니다" };
  } catch (error) {
    console.error("스케줄 생성 오류:", error);
    return { error: "스케줄 생성에 실패했습니다" };
  }
}

// 스케줄 목록 조회
export async function getSchedules() {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: TEMP_USER_ID,
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return schedules;
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    return [];
  }
}

// 스케줄 수정
export async function updateSchedule(
  _prevState: InitialState,
  formData: FormData,
) {
  try {
    const validatedFields = ScheduleSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validatedFields.success) {
      console.error("검증 오류:", validatedFields.error);
      return {
        error: "입력값이 유효하지 않습니다",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const {
      id: validId,
      title: validTitle,
      startTime: validStartTime,
      endTime: validEndTime,
      description: validDescription,
    } = validatedFields.data;

    // 시작 시간이 종료 시간보다 빠른지 확인
    if (new Date(validStartTime) >= new Date(validEndTime)) {
      return {
        error: "종료 시간은 시작 시간보다 늦어야 합니다",
      };
    }

    console.log("DB에 업데이트할 데이터:", {
      id: validId,
      title: validTitle,
      startTime: new Date(validStartTime),
      endTime: new Date(validEndTime),
      description: validDescription,
    });

    await prisma.schedule.update({
      where: { id: validId },
      data: {
        title: validTitle,
        startTime: new Date(validStartTime),
        endTime: new Date(validEndTime),
        description: validDescription,
      },
    });

    revalidatePath("/");
    return { success: "스케줄이 수정되었습니다" };
  } catch (error) {
    console.error("스케줄 수정 오류:", error);
    return { error: "스케줄 수정에 실패했습니다" };
  }
}

// 스케줄 삭제
export async function deleteSchedule(id: string) {
  try {
    await prisma.schedule.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: "스케줄이 삭제되었습니다" };
  } catch (error) {
    console.error("스케줄 삭제 오류:", error);
    return { error: "스케줄 삭제에 실패했습니다" };
  }
}
