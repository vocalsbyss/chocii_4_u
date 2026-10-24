"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Printer,
  User,
  MapPin,
  CheckCircle2,
  ChefHat,
  Package,
  Bike,
  Sparkles,
  Ban,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Order, OrderFulfillmentStatus } from "@/types";

export default function ClientAdminOrderDetailPage({
  initialOrder,
}: {
  initialOrder: Order;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleStatusTransition = async (newStatus: OrderFulfillmentStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: note ? note.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setOrder(data.order);
      setNote("");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Error updating order status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm(`Are you sure you want to permanently delete Order #${order.orderNumber}?`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${order.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete order");
      }
      alert(`Order #${order.orderNumber} deleted.`);
      router.push("/admin/orders");
    } catch (e: any) {
      alert(e.message || "Failed to delete order");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-caramel-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders Queue
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream-100">
              Order #{order.orderNumber}
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-caramel-500/20 text-caramel-300 border border-caramel-500/40">
              {order.fulfillmentStatus.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-cream-300/60 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-cocoa-900 border border-white/10 hover:bg-cocoa-800 text-cream-200 text-xs font-semibold flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-caramel-400" />
            Print KOT Ticket
          </button>

          <button
            onClick={handleDeleteOrder}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-strawberry-500/20 border border-strawberry-500/40 hover:bg-strawberry-500/30 text-strawberry-300 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Destination */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-cream-300/60">Full Name</p>
                <p className="text-sm font-semibold text-cream-100">{order.customerName}</p>
              </div>
              <div>
                <p className="text-cream-300/60">Verified Phone</p>
                <p className="text-sm font-semibold text-cream-100 font-mono">
                  {order.customerPhone}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-cream-300/60">Delivery Address</p>
                <p className="text-cream-100 font-medium leading-relaxed">
                  {order.deliveryAddress}
                </p>
                {order.landmark && (
                  <p className="text-caramel-300/80 mt-0.5">Landmark: {order.landmark}</p>
                )}
              </div>
              {order.specialInstructions && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <p className="font-semibold">Kitchen Delivery Note:</p>
                  <p className="mt-0.5">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-cocoa-950/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-cream-100">{item.productName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-caramel-500/20 text-caramel-300">
                        {item.customization}
                      </span>
                      <span className="text-cream-300/60">Unit: ₹{item.unitPrice}</span>
                      <span className="text-caramel-400 font-bold">Qty: {item.quantity}</span>
                    </div>
                    {item.specialInstructions && (
                      <p className="text-[11px] text-cream-300/50 italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="text-base font-bold text-cream-100">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-cream-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-cream-100">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-cream-100">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-cream-100 pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-caramel-400 text-lg">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: State Transition & Status Audit History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Workflow Controls */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400">
              Update Order Status
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-cream-300/70">
                Audit Note (Optional reason or rider name):
              </label>
              <input
                type="text"
                placeholder="e.g. Assigned to delivery partner Ramesh..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-cocoa-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-cream-100 focus:outline-none focus:border-caramel-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleStatusTransition("CONFIRMED")}
                disabled={loading || order.fulfillmentStatus === "CONFIRMED"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirmed
              </button>
              <button
                onClick={() => handleStatusTransition("PREPARING")}
                disabled={loading || order.fulfillmentStatus === "PREPARING"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-caramel-500 hover:bg-caramel-400 text-cocoa-950 flex items-center justify-center gap-1.5 disabled:opacity-40 font-bold"
              >
                <ChefHat className="w-3.5 h-3.5" />
                In Kitchen
              </button>
              <button
                onClick={() => handleStatusTransition("READY")}
                disabled={loading || order.fulfillmentStatus === "READY"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-cocoa-950 flex items-center justify-center gap-1.5 disabled:opacity-40 font-bold"
              >
                <Package className="w-3.5 h-3.5" />
                Packed & Ready
              </button>
              <button
                onClick={() => handleStatusTransition("OUT_FOR_DELIVERY")}
                disabled={loading || order.fulfillmentStatus === "OUT_FOR_DELIVERY"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center gap-1.5 disabled:opacity-40 font-bold"
              >
                <Bike className="w-3.5 h-3.5" />
                Out for Delivery
              </button>
              <button
                onClick={() => handleStatusTransition("DELIVERED")}
                disabled={loading || order.fulfillmentStatus === "DELIVERED"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-cocoa-950 flex items-center justify-center gap-1.5 disabled:opacity-40 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Delivered
              </button>
              <button
                onClick={() => handleStatusTransition("CANCELLED")}
                disabled={loading || order.fulfillmentStatus === "CANCELLED"}
                className="p-2.5 rounded-xl text-xs font-semibold bg-strawberry-500/20 hover:bg-strawberry-500/30 border border-strawberry-500/40 text-strawberry-400 flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Ban className="w-3.5 h-3.5" />
                Cancel Order
              </button>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-cocoa-900/60 border border-caramel-500/20 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-caramel-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Status Audit History
            </h3>

            <div className="space-y-3">
              {order.statusHistory?.map((history) => (
                <div
                  key={history.id}
                  className="p-3 rounded-2xl bg-cocoa-950/60 border border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-caramel-300">
                      {history.newStatus.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-cream-300/50">
                      {new Date(history.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-cream-200/80">
                    By: <strong className="text-cream-100">{history.changedBy}</strong>
                  </p>
                  {history.note && (
                    <p className="text-[11px] text-cream-300/60 italic pt-0.5">
                      "{history.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
