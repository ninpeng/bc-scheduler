"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { useEffect, useState } from "react";
import type { Schedule } from "@/generated/prisma/client";
import { getSchedules } from "@/lib/actions/schedule";
import { ScheduleForm } from "./components/schedule-form";
import { ScheduleList } from "./components/schedule-list";

export default function Home() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      console.log("데이터 로딩 시작...");
      const data = await getSchedules();
      console.log("데이터 로딩 완료:", data);
      setSchedules(data);
      setLoading(false);
    };

    loadSchedules();
  }, []);

  const handleScheduleAdded = () => {
    console.log("스케줄 변경 감지!");
    // 스케줄이 추가되면 목록을 새로고침
    const loadSchedules = async () => {
      const data = await getSchedules();
      setSchedules(data);
    };

    loadSchedules();
  };

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">스케줄 관리</h1>
        <ScheduleDialog>
          <Button>스케줄 추가</Button>
        </ScheduleDialog>
      </div>

      {/* 스케줄 목록 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ScheduleList
          schedules={schedules}
          onScheduleChange={handleScheduleAdded}
        />
      )}
    </div>
  );
}

// 스케줄 다이얼로그 컴포넌트
function ScheduleDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 스케줄 추가</DialogTitle>
          <DialogDescription>새로운 스케줄을 추가합니다.</DialogDescription>
        </DialogHeader>
        <ScheduleForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
