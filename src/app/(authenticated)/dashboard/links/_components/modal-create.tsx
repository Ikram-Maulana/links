"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useEdgeStore } from "@/lib/edgestore";
import { getBaseUrl } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@mantine/hooks";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ModalCreateProps {
  children: React.ReactNode;
}

const formSchema = z.object({
  image: z
    .string({
      required_error: "Please enter an image",
    })
    .trim(),
  title: z
    .string({
      required_error: "Please enter a title",
    })
    .trim(),
  url: z
    .string({
      required_error: "Please enter a URL",
    })
    .trim()
    .url({
      message: "URL is invalid",
    }),
  slug: z
    .string({
      required_error: "Please enter a slug",
    })
    .trim()
    .min(3, "Slug must be at least 3 characters"),
});

const ModalCreate: FC<ModalCreateProps> = ({ children }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      title: "",
      url: "",
      slug: "",
    },
  });
  const router = useRouter();
  const [opened, handler] = useDisclosure(false);

  const { edgestore } = useEdgeStore();
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageUrl !== "") {
      form.setValue("image", imageUrl);
    }
  }, [imageUrl, form]);

  const { mutate: addLink, isLoading: isAddingLink } =
    api.linksList.create.useMutation({
      onSuccess: async () => {
        try {
          if (imageUrl !== "") {
            await edgestore.publicFiles.confirmUpload({
              url: imageUrl,
            });
          }
          form.reset();
          setProgress(0);
          handler.close();
          toast.success("Link added successfully");
        } catch (error) {
          toast.error((error as Error).message.toString());
        }
      },
      onError: (error) => {
        if (error instanceof Error && error.message) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      },
      onSettled: () => {
        router.refresh();
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAddingLink) {
      return;
    }

    addLink(values);
  }

  return (
    <Dialog open={opened} onOpenChange={handler.toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:text-slate-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <>
                      <Input className="hidden" type="text" {...field} />
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            const res = await edgestore.publicFiles.upload({
                              file,
                              input: {
                                type: "links",
                              },
                              onProgressChange: (progress) => {
                                setProgress(progress);
                              },
                              options: {
                                temporary: true,
                              },
                            });

                            setImageUrl(res.url);
                          }
                        }}
                      />
                      <Progress value={progress} />
                      <p className="text-sm text-muted-foreground">
                        Max: 4MB, 500x500px
                      </p>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Example"
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
                  <FormLabel>
                    Enter the URL
                    <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="https://example.com"
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>
                      Custom Slug
                      <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                        *
                      </span>
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {getBaseUrl()}/s/
                    </p>
                  </div>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="mt-2" disabled={isAddingLink}>
                {isAddingLink && (
                  <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreate;
