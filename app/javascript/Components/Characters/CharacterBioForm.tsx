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

interface RaceOption {
  name: string;
  speed?: number | null;
  size?: string | null;
  subraces: string[];
}

interface BackgroundOption {
  name: string;
  source?: string | null;
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
  const [raceOptions, setRaceOptions] = useState<RaceOption[]>([]);
  const [backgroundOptions, setBackgroundOptions] = useState<
    BackgroundOption[]
  >([]);

  useEffect(() => {
    const token = auth.getToken();
    client
      .get({ path: "/archetypes", token })
      .then((r) => setMeta(r.data ?? []))
      .catch(() => setMeta([]));
    client
      .get({ path: "/races/options", token })
      .then((r) => setRaceOptions(r.data ?? []))
      .catch(() => setRaceOptions([]));
    client
      .get({ path: "/backgrounds/options", token })
      .then((r) => setBackgroundOptions(r.data ?? []))
      .catch(() => setBackgroundOptions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classNames = meta.length ? meta.map((m) => m.name) : archetypes;
  const selectedArchetype = form.watch("archetype");
  const currentMeta = meta.find((m) => m.name === selectedArchetype);
  const subOptions = currentMeta?.subclasses ?? [];
  const subLabel = currentMeta?.subclass_label || "Subclass";

  const selectedRace = form.watch("race");
  const currentRace = raceOptions.find((r) => r.name === selectedRace);
  const raceNames = Array.from(
    new Set([
      ...(selectedRace ? [selectedRace] : []),
      ...raceOptions.map((r) => r.name),
    ]),
  );
  const subraceOptions = currentRace?.subraces ?? [];

  const selectedBackground = form.watch("background");
  const backgroundNames = Array.from(
    new Set([
      ...(selectedBackground ? [selectedBackground] : []),
      ...(backgroundOptions.length
        ? backgroundOptions.map((b) => b.name)
        : backgrounds),
    ]),
  );

  /** Picking a race resets subrace and, unless speed was hand-edited, applies the race's speed. */
  const onRaceChange = (name: string) => {
    form.setValue("race", name, { shouldValidate: true });
    form.setValue("subrace", "");
    const race = raceOptions.find((r) => r.name === name);
    if (race?.speed && !form.formState.dirtyFields.speed) {
      form.setValue("speed", race.speed);
    }
  };

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
            {raceOptions.length > 0 ? (
              <Select
                onValueChange={onRaceChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Race" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {raceNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <FormControl>
                <Input placeholder="Your Race" {...field} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      {subraceOptions.length > 0 && (
        <FormField
          control={form.control}
          name="subrace"
          render={({ field }) => (
            <FormItem className="min-w-[150px] flex-1">
              <FormLabel>Subrace</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subrace" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subraceOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
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
                {backgroundNames.map((background) => (
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
