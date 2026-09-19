import React, { useState } from "react";
import { Client, IAttackType } from "../../Api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui";
import { Label } from "../ui";
import { Button } from "../ui";
import { useAuth } from "../../Auth";
import { useForm } from "react-hook-form";
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

const attackSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 letters"),
  bonus: z.string(),
  damage: z.string().optional(),
  description: z.string().min(2, "Description must have at least 2 letters"),
  character_id: z.string(),
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
      name: attack ? attack.name : "",
      bonus: attack ? attack.bonus : "",
      damage: attack ? attack.damage || "" : "",
      description: attack ? attack.description : "",
      character_id: effectiveCharacterId,
    },
  });

  const handleClose = (result?: IAttackType) => {
    form.reset();
    onClose(result ?? attack);
  };

  const handleSubmit = (values: AttackFormData) => {
    const base = `/characters/${effectiveCharacterId}/attacks`;
    const url = isUpdate ? `${base}/${attack?.id}` : base;
    const payload = { attack: values };
    const request = { path: url, payload, token: auth.getToken() };
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
      <DialogContent>
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
            <FormField
              control={form.control}
              name="bonus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bonus</FormLabel>
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
                    <Input placeholder="e.g. 1d8+7 bludgeoning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
