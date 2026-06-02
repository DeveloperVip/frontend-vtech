'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: AdminSelectOption[];
  className?: string;
}

export default function AdminSelect<T extends string>({ value, onChange, options, className = '' }: AdminSelectProps<T>) {
  return (
    <Select.Root value={value} onValueChange={(next) => onChange(next as T)}>
      <Select.Trigger
        className={`group inline-flex h-10 min-w-[170px] items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/95 px-3.5 text-sm font-semibold text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.06)] outline-none transition-all hover:border-primary-200 hover:bg-white hover:text-slate-950 data-[state=open]:border-primary-400 data-[state=open]:shadow-[0_0_0_4px_rgba(37,99,235,0.10),0_16px_36px_rgba(15,23,42,0.10)] ${className}`}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown size={16} className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-600" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/98 p-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="group relative flex h-9 cursor-pointer select-none items-center rounded-xl pl-9 pr-3 text-sm font-semibold text-slate-600 outline-none transition-colors data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700 data-[state=checked]:bg-slate-50 data-[state=checked]:text-slate-950"
              >
                <Select.ItemIndicator className="absolute left-3 inline-flex items-center justify-center text-primary-600">
                  <Check size={15} strokeWidth={2.5} />
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
