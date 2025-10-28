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
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

export default function Home() {
  return (
    <div className="container mx-auto space-y-8 p-8">
      <h1 className="font-bold text-3xl">UI Components Test</h1>

      {/* Button 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Button Components</CardTitle>
          <CardDescription>다양한 버튼 스타일 테스트</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      {/* Input 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Input Components</CardTitle>
          <CardDescription>폼 입력 컴포넌트 테스트</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">스케줄 제목</Label>
            <Input id="title" placeholder="회의 일정" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">시간</Label>
            <Input id="time" type="time" />
          </div>
        </CardContent>
      </Card>

      {/* Dialog 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Component</CardTitle>
          <CardDescription>모달 다이얼로그 테스트</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>일정 추가</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 일정 만들기</DialogTitle>
                <DialogDescription>
                  새로운 스케줄을 추가하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dialog-title">제목</Label>
                  <Input id="dialog-title" placeholder="회의 일정" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialog-time">시간</Label>
                  <Input id="dialog-time" type="time" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">취소</Button>
                <Button>저장</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
