"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useActionState, useEffect } from "react";
import {
  createSchedule,
  type InitialState,
  updateSchedule,
} from "@/lib/actions/schedule";

interface ScheduleFormProps {
  onClose: () => void;
  onScheduleChange?: () => void;
  initialData?: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
  };
}

const _initialState: InitialState = {
  error: undefined,
  fieldErrors: undefined,
  success: undefined,
};

export function ScheduleForm({
  onClose,
  initialData,
  onScheduleChange,
}: ScheduleFormProps) {
  const isEditing = !!initialData;
  const [state, formAction] = useActionState(
    isEditing ? updateSchedule : createSchedule,
    _initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
      onScheduleChange?.();
    }
  }, [state.success, onClose, onScheduleChange]);

  return (
    <form action={formAction} className="space-y-4">
      {isEditing && <input type="hidden" name="id" value={initialData.id} />}

      {state.error && (
        <div className="rounded-md bg-destructive/15 p-3 text-destructive text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-md bg-green-50 p-3 text-green-700 text-sm">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title || ""}
          placeholder="회의 일정"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">시작 시간</Label>
          <Input
            id="startTime"
            name="startTime"
            type="datetime-local"
            defaultValue={initialData?.startTime || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">종료 시간</Label>
          <Input
            id="endTime"
            name="endTime"
            type="datetime-local"
            defaultValue={initialData?.endTime || ""}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택사항)</Label>
        <Input
          id="description"
          name="description"
          defaultValue={initialData?.description || ""}
          placeholder="회의 내용을 간략히 설명해주세요"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="submit">{isEditing ? "수정" : "생성"}</Button>
      </div>
    </form>
  );
}
