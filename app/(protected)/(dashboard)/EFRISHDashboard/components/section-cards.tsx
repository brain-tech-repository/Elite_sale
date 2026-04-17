"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton"; // Optional: UI loading state
import { DashboardStatsResponse } from "../types";
import {
  usePendingCounterSales,
  usePendingGRN,
  usePendingOrderReturn,
  usePendingRouteInvoices,
  usePendingRouteReturn,
  usePendingSalesInvoice,
  usePendingStockAdjustment,
  useSyncCounterSales,
  useSyncGRN,
  useSyncOrderReturn,
  useSyncRouteInvoices,
  useSyncRouteReturn,
  useSyncSalesInvoice,
  useSyncStockAdjustment,
} from "../usEfris";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Ensure you have Shadcn Dialog installed
import { CommonDataTables } from "@/components/table-data/common-tables";
import { DynamicDialog } from "./DynamicDialog";
import {
  counterSalesColumns,
  orderReturnColumns,
  pendingGRNColumns,
  pendingInvoiceColumns,
  routeReturnColumns,
  salesInvoiceColumns,
  stockAdjustmentColumns,
  stockAdjustmentsyncColumns,
  syncGRNColumns,
} from "./columns";

type SectionCardsProps = {
  data?: DashboardStatsResponse; // Better typing for your data
  isLoading: boolean;
  isError: boolean;
  filters?: any; // Add filters here
};
function AnimatedCard({
  children,
  index,
  onClick,
}: {
  children: React.ReactNode;
  index: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-IN").format(num);

export function SectionCards({
  data,
  isLoading,
  isError,
  filters,
}: SectionCardsProps) {
  // Mapping API data to your UI structure

  const [activeModal, setActiveModal] = useState<
    | "pending_invoice"
    | "stock_adjustment"
    | "stock_sync_adjustment"
    | "sync_route_invoice"
    | "pending_grn"
    | "sync_grn"
    | "pending_route_return"
    | "sync_route_return"
    | "pending_order_return"
    | "sync_order_return"
    | "pending_sales_invoice"
    | "sync_sales_invoice"
    | "pending_counter_sales"
    | "sync_counter_sales"
    | null
  >(null);

  const cardsData = [
    {
      title: "URA Live Date",
      value: "17-06-2024",
      color: "bg-gradient-to-r from-[#0F2027] to-[#2C5364]",
    },
    {
      title: "Pending Route Invoice",
      value: data?.total_pending_efris_invoice ?? 0,
      color: "bg-gradient-to-r from-[#1E6C8E] to-[#2E7775]",
      onClick: () => setActiveModal("pending_invoice"),
    },
    {
      title: "Sync Route Invoice",
      value: data?.total_sync_efris_invoice ?? 0,
      color: "bg-gradient-to-r from-[#031e2f] to-[#0e7490]",
      onClick: () => setActiveModal("sync_route_invoice"),
    },
    {
      title: "Pending Stock Adjustment",
      value: data?.total_stock_adjustment_pending ?? 0,
      color: "bg-gradient-to-r from-[#042f2e] to-[#14b8a6]",
      onClick: () => setActiveModal("stock_adjustment"),
    },
    {
      title: "Sync Stock Adjustment",
      value: data?.total_stock_adjustment ?? 0,
      color: "bg-gradient-to-r from-[#09203f] to-[#537895]",
      onClick: () => setActiveModal("stock_sync_adjustment"),
    },
    {
      title: "Pending GRN",
      value: data?.total_pending_grn ?? 0,
      color: "bg-gradient-to-r from-[#020617] to-[#155e75]",
      onClick: () => setActiveModal("pending_grn"),
    },
    {
      title: "Sync GRN",
      value: data?.total_sync_grn ?? 0,
      color: "bg-gradient-to-r from-[#134e4a] to-[#115e59]",
      onClick: () => setActiveModal("sync_grn"),
    },
    {
      title: "Pending Route Return",
      value: data?.total_pending_route_return ?? 0,
      color: "bg-gradient-to-r from-[#1f2937] to-[#111827]",
      onClick: () => setActiveModal("pending_route_return"),
    },
    {
      title: "Sync Route Return",
      value: data?.total_sync_route_return ?? 0,
      color: "bg-gradient-to-r from-[#134e4a] to-[#115e59]",
      onClick: () => setActiveModal("sync_route_return"),
    },
    {
      title: "Pending Counter Sale",
      value: data?.total_pending_counter_sales ?? 0,
      color: "bg-gradient-to-r from-[#022c22] to-[#134e4a]",
      onClick: () => setActiveModal("pending_counter_sales"),
    },
    {
      title: "Sync Counter Sale",
      value: data?.total_sync_counter_sales ?? 0,
      color: "bg-gradient-to-r from-[#083344] to-[#155e75]",
      onClick: () => setActiveModal("sync_counter_sales"),
    },
    {
      title: "Pending Sales Invoice",
      value: data?.total_pending_sales_invoice,
      color: "bg-gradient-to-r from-[#022c22] to-[#134e4a]",
      onClick: () => setActiveModal("pending_sales_invoice"),
    },
    {
      title: "Sync Sales Invoice",
      value: data?.total_sync_sales_invoice,
      color: "bg-gradient-to-r from-[#083344] to-[#155e75]",
      onClick: () => setActiveModal("sync_sales_invoice"),
    },
    {
      title: "Pending Order Return",
      value: data?.total_pending_order_return,
      color: "bg-gradient-to-r from-[#062c30] to-[#0f766e]",
      onClick: () => setActiveModal("pending_order_return"),
    },
    {
      title: "Sync Order Return",
      value: data?.total_sync_order_return,
      color: "bg-gradient-to-r from-[#021617] to-[#0f766e]",
      onClick: () => setActiveModal("sync_order_return"),
    },
  ];
  const { data: invoiceData = [], isFetching: isFetchingInvoice } =
    usePendingRouteInvoices(filters, activeModal === "pending_invoice");

  const { data: stocSynckData = [], isFetching: isFetchingSyncStock } =
    useSyncStockAdjustment(filters, activeModal === "stock_sync_adjustment");

  const { data: stockData = [], isFetching: isFetchingStock } =
    usePendingStockAdjustment(filters, activeModal === "stock_adjustment");

  const { data: syncInvoiceData = [], isFetching: isFetchingSyncInvoice } =
    useSyncRouteInvoices(filters, activeModal === "sync_route_invoice");

  const { data: grnData = [], isFetching: isFetchingGRN } = usePendingGRN(
    filters,
    activeModal === "pending_grn",
  );

  const { data: syncGrnData = [], isFetching: isFetchingSyncGRN } = useSyncGRN(
    filters,
    activeModal === "sync_grn",
  );

  const { data: routeReturnData = [], isFetching: isFetchingRouteReturn } =
    usePendingRouteReturn(filters, activeModal === "pending_route_return");

  const { data: orderReturnData = [], isFetching: isFetchingOrderReturn } =
    usePendingOrderReturn(filters, activeModal === "pending_order_return");

  const {
    data: syncOrderReturnData = [],
    isFetching: isFetchingSyncOrderReturn,
  } = useSyncOrderReturn(filters, activeModal === "sync_order_return");

  const { data: pendingSalesData = [], isFetching: isFetchingPendingSales } =
    usePendingSalesInvoice(filters, activeModal === "pending_sales_invoice");

  const { data: syncSalesData = [], isFetching: isFetchingSyncSales } =
    useSyncSalesInvoice(filters, activeModal === "sync_sales_invoice");

  const {
    data: pendingCounterData = [],
    isFetching: isFetchingPendingCounter,
  } = usePendingCounterSales(filters, activeModal === "pending_counter_sales");

  const { data: syncCounterData = [], isFetching: isFetchingSyncCounter } =
    useSyncCounterSales(filters, activeModal === "sync_counter_sales");

  const {
    data: syncRouteReturnData = [],
    isFetching: isFetchingSyncRouteReturn,
  } = useSyncRouteReturn(filters, activeModal === "sync_route_return");

  const modalConfig = {
    pending_invoice: {
      title: "Pending Route Invoices",
      columns: pendingInvoiceColumns,
      data: invoiceData,
      isFetching: isFetchingInvoice,
    },
    stock_sync_adjustment: {
      title: "Sync Stock Adjustment ",
      columns: stockAdjustmentsyncColumns,
      data: stocSynckData,
      isFetching: isFetchingSyncStock,
    },
    stock_adjustment: {
      title: "Pending Stock Adjustment",
      columns: stockAdjustmentColumns,
      data: stockData,
      isFetching: isFetchingStock,
    },
    sync_route_invoice: {
      title: "Sync Route Invoice ",
      columns: pendingInvoiceColumns, // or create new columns if needed
      data: syncInvoiceData,
      isFetching: isFetchingSyncInvoice,
    },
    pending_grn: {
      title: "Pending GRN ",
      columns: pendingGRNColumns,
      data: grnData,
      isFetching: isFetchingGRN,
    },
    sync_grn: {
      title: "Sync GRN Details",
      columns: syncGRNColumns,
      data: syncGrnData,
      isFetching: isFetchingSyncGRN,
    },

    pending_route_return: {
      title: "Pending Route Return Details",
      columns: routeReturnColumns,
      data: routeReturnData,
      isFetching: isFetchingRouteReturn,
    },
    sync_route_return: {
      title: "Sync Route Return Details",
      columns: routeReturnColumns,
      data: syncRouteReturnData,
      isFetching: isFetchingSyncRouteReturn,
    },

    pending_order_return: {
      title: "Pending Order Return Details",
      columns: orderReturnColumns,
      data: orderReturnData,
      isFetching: isFetchingOrderReturn,
    },

    sync_order_return: {
      title: "Sync Order Return Details",
      columns: orderReturnColumns,
      data: syncOrderReturnData,
      isFetching: isFetchingSyncOrderReturn,
    },
    pending_sales_invoice: {
      title: "Pending Sales Invoice Details",
      columns: salesInvoiceColumns,
      data: pendingSalesData,
      isFetching: isFetchingPendingSales,
    },

    sync_sales_invoice: {
      title: "Sync Sales Invoice Details",
      columns: salesInvoiceColumns,
      data: syncSalesData,
      isFetching: isFetchingSyncSales,
    },

    pending_counter_sales: {
      title: "Pending Counter Sales Details",
      columns: counterSalesColumns,
      data: pendingCounterData,
      isFetching: isFetchingPendingCounter,
    },

    sync_counter_sales: {
      title: "Sync Counter Sales Details",
      columns: counterSalesColumns,
      data: syncCounterData,
      isFetching: isFetchingSyncCounter,
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        {cardsData.map((card, index) => (
          <AnimatedCard
            key={`${card.title}-${index}`}
            index={index}
            onClick={card.onClick}
          >
            <Card
              className={`rounded-xl border-none shadow-md p-4 ${card.color} text-white`}
            >
              <CardHeader className="px-2 flex flex-col gap-1">
                <CardDescription className="text-xs font-semibold uppercase tracking-wide opacity-80 text-white">
                  {card.title}
                </CardDescription>

                <CardTitle className="text-sm font-bold text-white">
                  {typeof card.value === "number"
                    ? formatNumber(card.value)
                    : card.value}
                </CardTitle>
              </CardHeader>
            </Card>
          </AnimatedCard>
        ))}
      </div>
      <DynamicDialog
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        modalConfig={modalConfig}
      />
    </>
  );
}
