"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { useStockLedgerDetails } from "../useCustomers";

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
  // Extract ID from selectedRow (handling different possible key names)
  const rowId = selectedRow?.material_id || selectedRow?.id;

  // Use the new React Query hook
  const {
    data: apiData,
    isLoading,
    isError,
  } = useStockLedgerDetails(isOpen ? rowId : undefined);

  const handleExport = () => {
    const dataToExport = apiData || selectedRow;
    exportToCSV(dataToExport, `row_details_${new Date().getTime()}`);
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
            disabled={isLoading || !apiData}
          >
            <Download className="h-4 w-4" />
            Export Row
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading ledger details...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
              <p className="font-semibold">Error</p>
              <p className="text-sm">
                Failed to connect to the server. Please try again.
              </p>
            </div>
          ) : apiData ? (
            /* CASE: Data Found */
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.entries(apiData).map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 font-medium bg-gray-50 w-1/2 capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-2 break-all text-right">
                        {String(value ?? "N/A")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* CASE: Data Not Found (apiData is null) */
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Loader2 className="h-8 w-8 opacity-20" />{" "}
                {/* Or any "empty" icon */}
              </div>
              <p className="text-lg font-medium">Data Not Found</p>
              <p className="text-sm">
                No ledger details available for ID: {rowId}
              </p>
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
