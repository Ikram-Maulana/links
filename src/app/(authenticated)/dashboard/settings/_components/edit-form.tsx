/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import { deleteUploadcareFile } from "@/lib/uploadcare";
import { cn } from "@/lib/utils";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@irsyadadl/paranoid";
import { ReloadIcon } from "@radix-ui/react-icons";
import * as LR from "@uploadcare/blocks";
import { type InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

LR.registerBlocks(LR);

interface EditFormProps {
  detail: InferSelectModel<typeof users> & {
    publicMetadata: InferSelectModel<typeof publicMetadata>;
  };
}

const FormSchema = z.object({
  avatar: z.string().optional().nullable(),
  bio: z
    .string({
      required_error: "Bio is required",
    })
    .trim()
    .min(3, "Please enter a bio"),
  location: z
    .string({
      required_error: "Location is required",
    })
    .trim()
    .min(3, "Please enter a location"),
});

const EditForm: FC<EditFormProps> = ({ detail }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      avatar: detail.publicMetadata?.avatar ?? "",
      bio: detail.publicMetadata?.bio ?? "",
      location: detail.publicMetadata?.location ?? "",
    },
  });
  const router = useRouter();
  const { avatar, bio, location } = form.watch();
  const {
    avatar: oldAvatar,
    bio: oldBio,
    location: oldLocation,
  } = detail.publicMetadata ?? {};

  const [oldImageIds, setOldImageIds] = useState("");
  const [imageIds, setImageIds] = useState("");
  const [imageSource, setImageSource] = useState(
    "https://placehold.co/96/webp",
  );
  const ctxProviderRef = useRef<
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

    const current = ctxProviderRef.current;
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

    const current = ctxProviderRef.current;
    current?.addEventListener("file-removed", removeFile);

    return () => {
      current?.removeEventListener("file-removed", removeFile);
    };
  });

  useEffect(() => {
    let newImageSource = imageSource;

    if (imageIds !== "") {
      newImageSource = `${env.NEXT_PUBLIC_UPLOADCARE_BASE_URL}/${imageIds}/-/quality/lighter/-/progressive/yes/`;
    } else if (detail.publicMetadata?.avatar) {
      newImageSource = `${env.NEXT_PUBLIC_UPLOADCARE_BASE_URL}/${detail.publicMetadata.avatar}/-/quality/lighter/-/progressive/yes/`;
    } else if (detail.image) {
      newImageSource = detail.image;
    }

    setImageSource(newImageSource);
  }, [imageIds, detail, imageSource]);

  useEffect(() => {
    if (imageIds !== "") {
      form.setValue("avatar", imageIds);
    }
  }, [imageIds, form]);

  useEffect(() => {
    setOldImageIds(detail.publicMetadata.avatar!);
  }, [detail]);

  const { mutate: deleteImage, isLoading: isDeletingImage } =
    api.settings.deleteImage.useMutation({
      onSuccess: async () => {
        try {
          await deleteUploadcareFile({ uuid: oldImageIds }).then(() => {
            setImageIds("");
            setOldImageIds("");
            form.setValue("avatar", "");
          });
          return toast.success("Image deleted successfully");
        } catch (err) {
          if (err instanceof Error) {
            return toast.error(err.message);
          }

          return toast.error("An error occurred while deleting the image");
        }
      },
      onError: (error) => {
        if (error instanceof Error && error.message) {
          return toast.error(error.message);
        }

        return toast.error("Something went wrong!");
      },
      onSettled: () => {
        router.refresh();
      },
    });

  const { mutate: mutateStore, isLoading: isLoadingStore } =
    api.settings.update.useMutation({
      onSuccess: async () => {
        try {
          if (imageIds !== "") {
            oldImageIds !== "" &&
              (await deleteUploadcareFile({ uuid: oldImageIds }));
          }
          return toast.success("Details users updated successfully");
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
        ctxProviderRef.current?.uploadCollection.clearAll();
        return router.refresh();
      },
    });

  function onDeleteImage() {
    if (isLoadingStore || isDeletingImage || oldImageIds === "") {
      return;
    }

    deleteImage();
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isLoadingStore) {
      return;
    }

    mutateStore({
      avatar: imageIds,
      bio: data.bio,
      location: data.location,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Profile Picture
                <p className="mb-4 mt-1 text-[0.8rem] text-muted-foreground">
                  Max file size 10MB
                </p>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative mx-auto h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={imageSource}
                      alt={detail.name ?? ""}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 80vw"
                      fill
                      priority
                    />
                  </div>

                  <div className="flex h-fit w-full gap-x-2">
                    <Input
                      className="hidden"
                      type="text"
                      {...field}
                      value={field.value ?? ""}
                    />

                    <lr-config
                      ctx-name="avatar"
                      pubkey={env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
                      maxLocalFileSizeBytes={10000000}
                      multiple={false}
                      imgOnly={true}
                    />
                    <lr-file-uploader-minimal
                      css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${LR.PACKAGE_VERSION}/web/lr-file-uploader-minimal.min.css`}
                      ctx-name="avatar"
                      class="my-config"
                    ></lr-file-uploader-minimal>
                    <lr-upload-ctx-provider
                      ref={ctxProviderRef}
                      ctx-name="avatar"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={onDeleteImage}
                      disabled={
                        isLoadingStore || isDeletingImage || oldImageIds === ""
                      }
                      className={cn("h-[60px] md:mt-[10px]", {
                        hidden: oldImageIds === "",
                      })}
                    >
                      {isDeletingImage ? (
                        <ReloadIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <IconTrash className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>
            Fullname
            <span className="ml-1 text-sm text-red-500 dark:text-red-400">
              *
            </span>
          </Label>
          <Input
            disabled
            type="text"
            placeholder="John Doe"
            value={detail.name ?? ""}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Bio
                <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell something about yourself"
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Location
                <span className="ml-1 text-sm text-red-500 dark:text-red-400">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Jakarta, Indonesia" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end">
          <Button
            type="submit"
            disabled={
              (avatar === oldAvatar &&
                bio === oldBio &&
                location === oldLocation) ||
              isLoadingStore
            }
          >
            {isLoadingStore && (
              <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
            )}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditForm;
