"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { redirectTo } from "@/lib/redirect";
import { revalidate } from "@/lib/revalidate";
import { type list } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@irsyadadl/paranoid";
import { useDebouncedValue } from "@mantine/hooks";
import { type InferSelectModel } from "drizzle-orm";
import dynamic from "next/dynamic";
import { useCallback, useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EditLinkFormSkeleton } from "./skeleton/form-skeleton";

interface EditLinkFormProps {
  detailLink: InferSelectModel<typeof list>;
}

const formSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  isPublished: z.boolean(),
});

const EditLinkForm: FC<EditLinkFormProps> = ({ detailLink }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: detailLink.title,
      url: detailLink.url,
      isPublished: detailLink.isPublished,
    },
  });
  const formValues = form.watch();
  const [debouncedFormValues] = useDebouncedValue(formValues, 500);
  const { title, url, isPublished } = debouncedFormValues;
  const {
    title: oldTitle,
    url: oldUrl,
    isPublished: oldIsPublished,
  } = detailLink;

  const isFormEmpty = useMemo(() => title === "" || url === "", [title, url]);

  const isFormUnchanged = useMemo(
    () =>
      title === oldTitle && url === oldUrl && isPublished === oldIsPublished,
    [title, url, isPublished, oldTitle, oldUrl, oldIsPublished],
  );

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
      return;
    }

    toast.error("Internal Server Error");
    return;
  }, []);

  const { mutate: mutateLink, isPending: isPendingMutateLink } =
    api.list.update.useMutation({
      onSuccess: () => {
        revalidate();
        redirectTo("/dashboard/links-list");
        return toast.success("Link updated successfully");
      },
      onError: handleError,
    });

  const isOperationPending = useMemo(
    () => isPendingMutateLink,
    [isPendingMutateLink],
  );

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isOperationPending || isFormUnchanged || isFormEmpty) {
      return;
    }

    const linkData = {
      id: detailLink.id,
      title: data.title,
      url: data.url,
      isPublished: data.isPublished,
    } as InferSelectModel<typeof list>;

    try {
      mutateLink(linkData);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 p-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Portfolio"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="https://ikrammaulana.my.id"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Make this link available to the public.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>

        <CardFooter className="justify-end border-t px-6 py-4">
          <Button
            type="submit"
            disabled={isOperationPending || isFormUnchanged || isFormEmpty}
          >
            {isOperationPending ? (
              <IconLoader className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Submit
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default dynamic(() => Promise.resolve(EditLinkForm), {
  ssr: false,
  loading: () => <EditLinkFormSkeleton />,
});
