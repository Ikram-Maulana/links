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
import { revalidate } from "@/lib/revalidate";
import { api } from "@/trpc/react";
import { type createLinkSchema, type updateLinkSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@irsyadadl/paranoid";
import { useDebouncedValue } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EditLinkFormSkeleton } from "./skeleton/form-skeleton";

interface EditLinkFormProps {
  detailLink: z.infer<typeof updateLinkSchema>;
}

const formSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  isPublished: z.boolean(),
});

const EditLinkForm: FC<EditLinkFormProps> = ({ detailLink }) => {
  const router = useRouter();
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

  const { mutate: mutateLink, isPending: isPendingMutateLink } =
    api.link.update.useMutation({
      onSuccess: () => {
        revalidate();
        router.push("/dashboard/links-list");
        toast.success("Link updated successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Internal Server Error",
        );
      },
    });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isPendingMutateLink || isFormUnchanged || isFormEmpty) {
      return;
    }

    const linkData = {
      id: detailLink.id,
      title: data.title,
      url: data.url,
      isPublished: data.isPublished,
    } as z.infer<typeof createLinkSchema>;

    mutateLink(linkData);
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
            disabled={isPendingMutateLink || isFormUnchanged || isFormEmpty}
          >
            {isPendingMutateLink ? (
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
