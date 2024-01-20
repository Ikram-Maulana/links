import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { type linksList } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { EdgeStoreApiClientError } from "@edgestore/react/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@mantine/hooks";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ModalEditProps {
  id: string;
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
    .trim()
    .min(3, "Please enter a title"),
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

type DataLink = InferSelectModel<typeof linksList>;

const ModalEdit: FC<ModalEditProps> = ({ id, children }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      title: "",
      url: "",
      slug: "",
    },
  });
  const [opened, handler] = useDisclosure(false);
  const router = useRouter();

  const { edgestore } = useEdgeStore();
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageUrl !== "") {
      form.setValue("image", imageUrl);
    }
  }, [imageUrl, form]);

  const {
    data: detailLink,
    isLoading: isLoadingDetailLink,
    error: errorDetailLink,
  } = api.linksList.getOne.useQuery<DataLink[]>(
    {
      id,
    },
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (Array.isArray(detailLink) && detailLink.length > 0) {
      form.setValue("title", detailLink[0]?.title ?? "");
      form.setValue("url", detailLink[0]?.url ?? "");
      form.setValue("slug", detailLink[0]?.slug ?? "");

      setOldImageUrl(detailLink[0]?.image ?? "");
    }

    if (errorDetailLink) {
      toast.error(errorDetailLink.message);
    }
  }, [detailLink, errorDetailLink, form]);

  const { mutate: updateLink, isLoading: isUpdatingLink } =
    api.linksList.update.useMutation({
      onSuccess: async () => {
        try {
          if (imageUrl !== "") {
            oldImageUrl !== "" &&
              (await edgestore.publicFiles.delete({ url: oldImageUrl }));
            await edgestore.publicFiles.confirmUpload({ url: imageUrl });
          }
          setProgress(0);
          handler.close();
          toast.success("Details link updated successfully");
        } catch (error) {
          // All errors are typed and you will get intellisense for them
          if (error instanceof EdgeStoreApiClientError) {
            // if it fails due to the `maxSize` set in the router config
            if (error.data.code === "FILE_TOO_LARGE") {
              toast.error(
                `File too large. Max size is ${error.data.details.maxFileSize}MB`,
              );
            }

            // if it fails due to the `accept` set in the router config
            if (error.data.code === "MIME_TYPE_NOT_ALLOWED") {
              toast.error(
                `File type not allowed. Allowed types are ${error.data.details.allowedMimeTypes.join(
                  ", ",
                )}`,
              );
            }

            // if it fails during the `beforeUpload` check
            if (error.data.code === "UPLOAD_NOT_ALLOWED") {
              toast.error("You don't have permission to upload files here.");
            }
          }

          toast.error("An error occurred while uploading the image");
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
    if (isUpdatingLink) return;

    updateLink({ id, ...values });
  }

  return (
    <Dialog open={opened} onOpenChange={handler.toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark:text-slate-50 sm:max-w-[425px]">
        <AlertDialogHeader>
          <DialogTitle>Update Link</DialogTitle>
        </AlertDialogHeader>
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
              disabled={isLoadingDetailLink || isUpdatingLink}
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
                      placeholder={
                        isLoadingDetailLink ? "Loading..." : "Example"
                      }
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
              disabled={isLoadingDetailLink || isUpdatingLink}
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
                      placeholder={
                        isLoadingDetailLink
                          ? "Loading..."
                          : "https://example.com"
                      }
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
              disabled={isLoadingDetailLink || isUpdatingLink}
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
                      placeholder={
                        isLoadingDetailLink ? "Loading..." : "example"
                      }
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="mt-2" disabled={isUpdatingLink}>
                {isUpdatingLink && (
                  <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEdit;
