/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { deleteUploadcareFile } from "@/lib/uploadcare";
import { getBaseUrl } from "@/lib/utils";
import { type linksList } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import * as LR from "@uploadcare/blocks";
import { type InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

LR.registerBlocks(LR);

interface ModalEditFormProps {
  id: string;
  handler: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  detailLink: InferSelectModel<typeof linksList>[] | undefined;
  isLoadingDetailLink: boolean;
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

export default function ModalEditForm({
  id,
  handler,
  detailLink,
  isLoadingDetailLink,
}: ModalEditFormProps) {
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

  const [oldImageIds, setOldImageIds] = useState("");
  const [imageIds, setImageIds] = useState("");
  const ctxImageLinkRef = useRef<
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  >(null);

  useEffect(() => {
    const handleUpload = (event: CustomEvent<LR.OutputCollectionState>) => {
      if (
        event.detail &&
        event.detail.successEntries &&
        event.detail.successEntries.length > 0
      ) {
        setImageIds(event.detail.successEntries[0]?.uuid ?? "");
      }
    };

    const current = ctxImageLinkRef.current;
    current?.addEventListener("common-upload-success", handleUpload);

    return () => {
      current?.removeEventListener("common-upload-success", handleUpload);
    };
  }, []);

  useEffect(() => {
    const removeFile = (event: CustomEvent<LR.OutputFileEntry>) => {
      if (event.detail && event.detail.isRemoved) {
        setImageIds("");
      }
    };

    const current = ctxImageLinkRef.current;
    current?.addEventListener("file-removed", removeFile);

    return () => {
      current?.removeEventListener("file-removed", removeFile);
    };
  });

  useEffect(() => {
    if (imageIds !== "") {
      form.setValue("image", imageIds);
    }
  }, [imageIds, form]);

  useEffect(() => {
    if (Array.isArray(detailLink) && Boolean(detailLink.length)) {
      form.setValue("title", detailLink[0]?.title ?? "");
      form.setValue("url", detailLink[0]?.url ?? "");
      form.setValue("slug", detailLink[0]?.slug ?? "");

      setOldImageIds(detailLink[0]?.image ?? "");
    }
  }, [detailLink, form]);

  const { mutate: updateLink, isLoading: isUpdatingLink } =
    api.linksList.update.useMutation({
      onSuccess: async () => {
        try {
          if (imageIds !== "") {
            oldImageIds !== "" &&
              (await deleteUploadcareFile({ uuid: oldImageIds }));
          }
          handler.close();
          return toast.success("Details link updated successfully");
        } catch (error) {
          if (error instanceof Error && error.message) {
            return toast.error(error.message);
          }

          return toast.error("Error occurred while deleting the old image");
        }
      },
      onError: (error) => {
        if (error instanceof Error && error.message) {
          return toast.error(error.message);
        }

        return toast.error("Something went wrong!");
      },
      onSettled: () => {
        return router.refresh();
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isUpdatingLink) return;

    updateLink({ id, ...values });
  }

  return (
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

                  <lr-config
                    ctx-name="linkImage"
                    pubkey={env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
                    maxLocalFileSizeBytes={10000000}
                    multiple={false}
                    imgOnly={true}
                    removeCopyright={true}
                  />
                  <lr-file-uploader-minimal
                    css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${LR.PACKAGE_VERSION}/web/lr-file-uploader-minimal.min.css`}
                    ctx-name="linkImage"
                    class="image-link"
                  ></lr-file-uploader-minimal>
                  <lr-upload-ctx-provider
                    ref={ctxImageLinkRef}
                    ctx-name="linkImage"
                  />
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
                  placeholder={isLoadingDetailLink ? "Loading..." : "Example"}
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
                    isLoadingDetailLink ? "Loading..." : "https://example.com"
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
                  placeholder={isLoadingDetailLink ? "Loading..." : "example"}
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
  );
}
