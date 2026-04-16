"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";

interface RowDetailsModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  selectedRow: any;
}

export function RowDetailsModal({
  isOpen,
  onClose,
  selectedRow,
}: RowDetailsModalProps) {
  const handleExport = () => {
    exportToCSV(selectedRow, `row_details_${new Date().getTime()}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle>Details View</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex gap-2 mr-6"
          >
            <Download className="h-4 w-4" />
            Export Row
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {selectedRow && (
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.entries(selectedRow).map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 font-bold bg-gray-50 w-1/3 capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-2 break-all">
                        {String(value ?? "N/A")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => onClose(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
