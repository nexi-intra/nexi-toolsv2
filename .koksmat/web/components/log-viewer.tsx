"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface LogObject {
  time: Date;
  title: string;
  detail: string;
  error: string;
  result: string;
}

interface LogTableProps {
  logs: LogObject[];
  onClear?: () => void;
}

export default function LogViewer({
  logs: initialLogs,
  onClear,
}: LogTableProps) {
  const [sortAscending, setSortAscending] = useState(false);
  const [expandedLog, setExpandedLog] = useState<LogObject | null>(null);
  const [clock, setclock] = useState(0);
  const sortedLogs = useMemo(() => {
    return [...initialLogs].sort((a, b) => {
      return sortAscending
        ? a.time.getTime() - b.time.getTime()
        : b.time.getTime() - a.time.getTime();
    });
  }, [initialLogs, sortAscending]);

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setclock(clock + 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {onClear && (
          <Button onClick={handleClear} variant="destructive">
            Clear Logs
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={toggleSort}
              >
                Time
                {sortAscending ? (
                  <ChevronUp className="inline ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-2 h-4 w-4" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <ScrollArea className="h-[400px]">
            {/* <div className="">{clock}</div> */}
            <TableBody>
              {sortedLogs.map((log, index) => (
                <Sheet key={index}>
                  <SheetTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{formatTimeSince(log.time)}</TableCell>
                      <TableCell>{log.title}</TableCell>
                      <TableCell>
                        {log.error && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{log.title}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <p>
                        <strong>Time:</strong> {log.time.toLocaleString()}
                      </p>
                      <p>
                        <strong>Detail:</strong> {log.detail}
                      </p>
                      {log.error && (
                        <p className="text-destructive">
                          <strong>Error:</strong> {log.error}
                        </p>
                      )}
                      {log.result && <p className="text-xs">{log.result}</p>}
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
    </div>
  );
}
