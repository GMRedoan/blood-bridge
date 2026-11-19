"use client";

import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { bangladeshDistricts } from "../Reusable/bangladesh-districts";

interface DistrictComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DistrictCombobox({
  value,
  onChange,
  disabled,
}: DistrictComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-11 w-full justify-between font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {value || "Search your district..."}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search district..." />
          <CommandList>
            <CommandEmpty>No district found.</CommandEmpty>

            <CommandGroup heading="Bangladesh districts">
              {bangladeshDistricts.map((district) => (
                <CommandItem
                  key={district}
                  value={district}
                  onSelect={() => {
                    onChange(district === value ? "" : district);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === district ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {district}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
