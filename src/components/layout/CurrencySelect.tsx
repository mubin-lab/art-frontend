"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useCurrencyStore, COUNTRIES, type Currency } from "@/lib/store/currency";

interface CurrencySelectProps {
  direction?: "up" | "down";
  className?: string;
}

export function CurrencySelect({ direction = "down", className }: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const { currency, setCurrency, symbols, country } = useCurrencyStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencyList = (Object.keys(COUNTRIES) as Currency[]).map((curr) => COUNTRIES[curr]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button with Flag & Currency Symbol */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f4ee] hover:bg-[#eae5d8] border border-[#eeebe3] text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] transition-all cursor-pointer focus:outline-none shadow-2xs select-none"
        title="Change Country & Currency (Worldwide delivery available)"
      >
        <span className="text-sm leading-none">{country?.flag || "🇧🇩"}</span>
        <span className="font-bold">{currency}</span>
        <span className="text-gray-500 font-sans text-[11px]">({symbols[currency] || "৳"})</span>
        <ChevronDown className="w-3 h-3 text-gray-500 ml-0.5" />
      </button>

      {/* Global Country & Currency Dropdown */}
      {open && (
        <div className={`absolute right-0 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 border border-[#eeebe3] z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-150 ${
          direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
        }`}>
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-[#faf8f5] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a8844a] block font-sans">
                Country & Currency
              </span>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Order from any country worldwide
              </p>
            </div>
            <Globe className="w-4 h-4 text-[#a8844a]" />
          </div>

          {/* Country Currency List */}
          <div className="py-1 max-h-52 overflow-y-auto">
            {currencyList.map((item) => {
              const isSelected = currency === item.currency;
              return (
                <button
                  key={item.currency}
                  type="button"
                  onClick={() => {
                    setCurrency(item.currency);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-sans transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#faf8f3] text-[var(--color-ink)] font-bold"
                      : "text-gray-700 hover:bg-[#f8f6f0] hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none flex-shrink-0">{item.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.name}</span>
                        {item.currency === "BDT" && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#ceab51]/15 text-[#a8844a] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--color-muted)] font-mono block">
                        {item.currency} ({item.currencySymbol})
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-sm text-[var(--color-ink)] font-sans ml-2">
                    {item.currencySymbol}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Guarantee */}
          <div className="px-3.5 py-2 bg-[#f9f8f4] text-[10px] text-gray-500 font-sans text-center">
            ✈️ Free insured international shipping included
          </div>
        </div>
      )}
    </div>
  );
}
