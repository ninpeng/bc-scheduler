"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import type { Schedule } from "@/generated/prisma/client";
import { deleteSchedule } from "@/lib/actions/schedule";
import { ScheduleForm } from "./schedule-form";

interface ScheduleListProps {
  schedules: Schedule[];
  onScheduleChange?: () => void;
}

export function ScheduleList({
  schedules,
  onScheduleChange,
}: ScheduleListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>스케줄 목록</CardTitle>
        <CardDescription>
          {schedules.length}개의 스케줄이 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            스케줄이 없습니다. 첫 번째 스케줄을 추가해보세요!
          </p>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-medium">{schedule.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(schedule.startTime), "PPP p", {
                      locale: ko,
                    })}{" "}
                    -{" "}
                    {format(new Date(schedule.endTime), "PPP p", {
                      locale: ko,
                    })}
                  </p>
                  {schedule.description && (
                    <p className="mt-1 text-sm">{schedule.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <ScheduleDialog
                    initialData={{
                      id: schedule.id,
                      title: schedule.title,
                      startTime: new Date(schedule.startTime)
                        .toISOString()
                        .slice(0, 16),
                      endTime: new Date(schedule.endTime)
                        .toISOString()
                        .slice(0, 16),
                      description: schedule.description || "",
                    }}
                    onScheduleChange={onScheduleChange}
                  >
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </ScheduleDialog>
                  <DeleteButton id={schedule.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 스케줄 다이얼로그 컴포넌트
function ScheduleDialog({
  children,
  initialData,
  onScheduleChange,
}: {
  children: React.ReactNode;
  initialData?: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
  };
  onScheduleChange?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "스케줄 수정" : "새 스케줄 추가"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "스케줄을 수정합니다."
              : "새로운 스케줄을 추가합니다."}
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm
          onClose={() => setOpen(false)}
          onScheduleChange={onScheduleChange}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}

// 삭제 버튼 컴포넌트
function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    const result = await deleteSchedule(id);
    setIsDeleting(false);

    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "삭제 중..." : "삭제"}
    </Button>
  );
}
