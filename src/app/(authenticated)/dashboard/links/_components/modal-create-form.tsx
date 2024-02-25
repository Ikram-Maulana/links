/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
import { getBaseUrl } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import * as LR from "@uploadcare/blocks";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

LR.registerBlocks(LR);

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

export const ModalCreateForm: FC = () => {
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
  const customCloseRef = useRef<HTMLButtonElement>(null);

  const [imageIds, setImageIds] = useState("");
  const ctxImageLinkRef = useRef<
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  >(null);

  useEffect(() => {
    const ctxImageLink = ctxImageLinkRef.current;
    if (!ctxImageLink) return;

    const handleUpload = (event: CustomEvent<LR.OutputCollectionState>) => {
      if (
        event.detail &&
        event.detail.successEntries &&
        event.detail.successEntries.length > 0
      ) {
        setImageIds(event.detail.successEntries[0]?.uuid ?? "");
      }
    };

    ctxImageLink.addEventListener("common-upload-success", handleUpload);

    return () => {
      ctxImageLink.removeEventListener("common-upload-success", handleUpload);
    };
  }, []);

  useEffect(() => {
    const removeFile = (event: CustomEvent<LR.OutputFileEntry>) => {
      if (event.detail && event.detail.isRemoved) {
        setImageIds("");
      }
    };

    const currentRef = ctxImageLinkRef.current;
    if (currentRef) {
      currentRef.addEventListener("file-removed", removeFile);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("file-removed", removeFile);
      }
    };
  }, []);

  useEffect(() => {
    if (imageIds !== "") {
      form.setValue("image", imageIds);
    }
  }, [imageIds, form]);

  const { mutate: addLink, isLoading: isAddingLink } =
    api.linksList.create.useMutation({
      onSuccess: async () => {
        const customClose = customCloseRef.current;
        if (!customClose) return;
        form.reset();
        customClose.click();
        return toast.success("Link added successfully");
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
    if (isAddingLink) {
      return;
    }

    addLink(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Image
                <p className="mb-4 mt-1 text-[0.8rem] text-muted-foreground">
                  Max file size 10MB
                </p>
              </FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
                <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Example" {...field} required />
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
                <Input type="text" placeholder="example" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogClose asChild>
          <Button className="hidden" ref={customCloseRef}>
            Close
          </Button>
        </DialogClose>

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
  );
};
