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
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@irsyadadl/paranoid";
import { useDebouncedValue } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AddLinkFormSkeleton } from "./skeleton/form-skeleton";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  url: z.string().url({
    message: "Please enter a valid URL",
  }),
  isPublished: z.boolean(),
});

const AddLinkForm: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      isPublished: false,
    },
  });
  const formValues = form.watch();
  const [debouncedFormValues] = useDebouncedValue(formValues, 500);
  const { title, url } = debouncedFormValues;
  const router = useRouter();

  // isFormEmpty is function that check the title and url should not be empty
  const isFormEmpty = useMemo(() => title === "" || url === "", [title, url]);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
      return;
    }

    toast.error("Internal Server Error");
    return;
  }, []);

  const { mutate: mutateList, isPending: isPendingMutateList } =
    api.list.create.useMutation({
      onSuccess: async () => {
        await revalidate().then(() => router.push("/dashboard/links-list"));
        return toast.success("Link has been added.");
      },
      onError: handleError,
    });

  const isOperationPending = useMemo(
    () => isPendingMutateList,
    [isPendingMutateList],
  );

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isOperationPending || isFormEmpty) {
      return;
    }

    try {
      mutateList({
        title: data.title,
        url: data.url,
        isPublished: data.isPublished,
      });
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
          <Button type="submit" disabled={isOperationPending || isFormEmpty}>
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

export default dynamic(() => Promise.resolve(AddLinkForm), {
  ssr: false,
  loading: () => <AddLinkFormSkeleton />,
});
