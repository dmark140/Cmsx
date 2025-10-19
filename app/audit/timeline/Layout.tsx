"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { runQuery } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLog {
  id: number;
  table_name: string;
  record_id: string;
  action_type: "INSERT" | "UPDATE" | "DELETE";
  old_data: string | null;
  new_data: string | null;
  user_name: string;
  created_at: string;
}

export default function Layout() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchLogs = async () => {
    if (!dateFrom || !dateTo) {
      alert("Please select both dates");
      return;
    }

    setLoading(true);
    const { data } = await runQuery("getAuditLogsByDate", [dateFrom, dateTo]);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const now = new Date();
    const weekAgo = new Date();
    const nowPlus1 = new Date();
    weekAgo.setDate(now.getDate() - 7);
    nowPlus1.setDate(now.getDate() + 1);
    setDateFrom(weekAgo.toISOString().split("T")[0]);
    setDateTo(nowPlus1.toISOString().split("T")[0]);
  }, []);

  const getDiff = (oldData: any, newData: any) => {
    const changes: { field: string; oldVal: any; newVal: any }[] = [];
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
    allKeys.forEach((key) => {
      if (oldData?.[key] !== newData?.[key]) {
        changes.push({ field: key, oldVal: oldData?.[key], newVal: newData?.[key] });
      }
    });
    return changes;
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-sm text-gray-500 mb-1">From</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-44"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">To</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-44"
          />
        </div>
        <Button onClick={fetchLogs} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" /> Filter
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* Results Table */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-0">
          <ScrollArea className="h-[75vh]">
            <table className="w-full border-collapse text-sm">
              <thead className="  ">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Table</th>
                  <th className="p-3 border-b">Record ID</th>
                  <th className="p-3 border-b">Action</th>
                  <th className="p-3 border-b">User</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Changes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-10">
                      No logs found for this date range.
                    </td>
                  </tr>
                )}

                {logs.map((log, index) => {
                  const oldData = log.old_data ? JSON.parse(log.old_data) : null;
                  const newData = log.new_data ? JSON.parse(log.new_data) : null;
                  const diffs = getDiff(oldData, newData);

                  return (
                    <tr key={log.id} className="border-b hover:bg-gray-50/10">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        <Badge variant="secondary">{log.table_name}</Badge>
                      </td>
                      <td className="p-3">{log.record_id}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            log.action_type === "INSERT"
                              ? "default"
                              : log.action_type === "UPDATE"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {log.action_type}
                        </Badge>
                      </td>
                      <td className="p-3">{log.user_name}</td>
                      <td className="p-3 text-gray-500">{log.created_at}</td>
                      <td className="p-3">
                        {diffs.length > 0 ? (
                          <table className="w-full text-xs border  rounded-md">
                            <thead className="">
                              <tr>
                                <th className="p-2 border-b w-1/3">Field</th>
                                <th className="p-2 border-b w-1/3">Old</th>
                                <th className="p-2 border-b w-1/3">New</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diffs.map((d, i) => (
                                <tr key={i}>
                                  <td className="p-1 border-b">{d.field}</td>
                                  <td className="p-1 border-b text-red-500 line-through">
                                    {d.oldVal ?? "—"}
                                  </td>
                                  <td className="p-1 border-b text-green-600">
                                    {d.newVal ?? "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <span className="text-gray-400">No changes</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
