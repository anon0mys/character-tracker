import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui";
import { Input } from "../ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { archetypes, backgrounds, Client } from "../../Api";
import { useAuth } from "../../Auth";

interface ArchMeta {
  name: string;
  subclass_label?: string;
  subclasses: string[];
}

const alignmentOptions = [
  { label: "Lawful Good", value: "LG" },
  { label: "Neutral Good", value: "NG" },
  { label: "Chaotic Good", value: "CG" },
  { label: "Lawful Neutral", value: "LN" },
  { label: "Neutral", value: "TN" },
  { label: "Chaotic Neutral", value: "CN" },
  { label: "Lawful Evil", value: "LE" },
  { label: "Neutral Evil", value: "NE" },
  { label: "Chaotic Evil", value: "CE" },
  { label: "Unaligned", value: "UN" },
];

const CharacterBioForm = () => {
  const form = useFormContext();
  const auth = useAuth();
  const client = Client();
  const [meta, setMeta] = useState<ArchMeta[]>([]);

  useEffect(() => {
    client
      .get({ path: "/archetypes", token: auth.getToken() })
      .then((r) => setMeta(r.data ?? []))
      .catch(() => setMeta([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classNames = meta.length ? meta.map((m) => m.name) : archetypes;
  const selectedArchetype = form.watch("archetype");
  const currentMeta = meta.find((m) => m.name === selectedArchetype);
  const subOptions = currentMeta?.subclasses ?? [];
  const subLabel = currentMeta?.subclass_label || "Subclass";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Character Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="race"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Race</FormLabel>
            <FormControl>
              <Input placeholder="Your Race" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="archetype"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Class</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {classNames.map((archetype) => (
                  <SelectItem key={archetype} value={archetype}>
                    {archetype}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {subOptions.length > 0 && (
        <FormField
          control={form.control}
          name="subclass"
          render={({ field }) => (
            <FormItem className="min-w-[150px] flex-1">
              <FormLabel>{subLabel}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${subLabel}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subOptions.map((sc) => (
                    <SelectItem key={sc} value={sc}>
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="background"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Background</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Background" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {backgrounds.map((background) => (
                  <SelectItem key={background} value={background}>
                    {background}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="alignment"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Alignment</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Alignment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {alignmentOptions.map((alignment) => (
                  <SelectItem key={alignment.value} value={alignment.value}>
                    {alignment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[150px]">
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="20"
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CharacterBioForm;
