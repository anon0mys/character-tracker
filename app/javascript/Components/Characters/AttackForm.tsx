import React from "react";
import { Client, IAttackType } from "../../Api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input, Button, Checkbox } from "../ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { useAuth } from "../../Auth";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui";
import { Trash2 } from "lucide-react";

const attackSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 letters"),
  bonus: z.string(),
  damage: z.string().optional(),
  description: z.string().min(2, "Description must have at least 2 letters"),
  character_id: z.string(),
  action_type: z.enum(["action", "bonus", "reaction", "dash"]),
  extra_attack: z.boolean(),
  riders: z.array(
    z.object({
      name: z.string().min(1, "Rider needs a name"),
      tag: z.string().optional(),
      damage: z.string().optional(),
      note: z.string().optional(),
    }),
  ),
});

type AttackFormData = z.infer<typeof attackSchema>;

interface AttackFormProps {
  attack?: IAttackType;
  characterId?: string | number;
  opened: boolean;
  onClose: (attack: IAttackType | undefined) => void;
}

const AttackForm = ({
  attack,
  characterId,
  opened,
  onClose,
}: AttackFormProps) => {
  const auth = useAuth();
  const client = Client();

  const isUpdate = !!attack;
  const effectiveCharacterId =
    attack?.character_id || (characterId != null ? String(characterId) : "");

  const form = useForm<AttackFormData>({
    resolver: zodResolver(attackSchema),
    defaultValues: {
      name: attack?.name ?? "",
      bonus: attack?.bonus ?? "",
      damage: attack?.damage ?? "",
      description: attack?.description ?? "",
      character_id: effectiveCharacterId,
      action_type: attack?.action_type ?? "action",
      extra_attack: attack?.extra_attack ?? false,
      riders: attack?.riders ?? [],
    },
  });

  const riders = useFieldArray({ control: form.control, name: "riders" });

  const handleClose = (result?: IAttackType) => {
    form.reset();
    onClose(result ?? attack);
  };

  const handleSubmit = (values: AttackFormData) => {
    const base = `/characters/${effectiveCharacterId}/attacks`;
    const url = isUpdate ? `${base}/${attack?.id}` : base;
    const request = {
      path: url,
      payload: { attack: values },
      token: auth.getToken(),
    };
    const promise = isUpdate ? client.patch(request) : client.post(request);
    promise.then((response) => handleClose(response?.data));
  };

  return (
    <Dialog
      open={opened}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Attack</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="damage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1d8+7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 items-end gap-3">
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Controller
                  control={form.control}
                  name="action_type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                        <SelectItem value="reaction">Reaction</SelectItem>
                        <SelectItem value="dash">Dash</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>
              <Controller
                control={form.control}
                name="extra_attack"
                render={({ field }) => (
                  <label className="flex min-h-[40px] items-center gap-2 text-sm">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                    />
                    Extra Attack (×2)
                  </label>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Riders
                </span>
                <button
                  type="button"
                  onClick={() =>
                    riders.append({ name: "", tag: "", damage: "", note: "" })
                  }
                  className="ml-auto min-h-[30px] rounded-full border border-border-strong px-3 text-[11px]"
                >
                  Add rider
                </button>
              </div>
              {riders.fields.map((r, i) => (
                <div key={r.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Name"
                    {...form.register(`riders.${i}.name` as const)}
                  />
                  <Input
                    placeholder="Damage"
                    {...form.register(`riders.${i}.damage` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => riders.remove(i)}
                    aria-label="Remove rider"
                    className="px-2 text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Input
                    placeholder="Tag (e.g. guardian)"
                    {...form.register(`riders.${i}.tag` as const)}
                  />
                  <Input
                    placeholder="Note"
                    className="col-span-2"
                    {...form.register(`riders.${i}.note` as const)}
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttackForm;
