"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { type publicMetadata, type users } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { EdgeStoreApiClientError } from "@edgestore/react/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

  const { edgestore } = useEdgeStore();
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageUrl !== "") {
      form.setValue("avatar", imageUrl);
    }
  }, [imageUrl, form]);

  useEffect(() => {
    setOldImageUrl(detail?.publicMetadata?.avatar ?? "");
  }, [detail]);

  const { mutate: deleteImage, isLoading: isDeletingImage } =
    api.settings.deleteImage.useMutation({
      onSuccess: async () => {
        try {
          await edgestore.publicFiles.delete({ url: oldImageUrl });
          setImageUrl("");
          setOldImageUrl("");
          form.setValue("avatar", "");
          toast.success("Image deleted successfully");
        } catch (err) {
          if (err instanceof EdgeStoreApiClientError) {
            if (err.data.code === "DELETE_NOT_ALLOWED") {
              toast.error("You don't have permission to delete this file.");
            }
          }

          toast.error("An error occurred while deleting the image");
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

  const { mutate: mutateStore, isLoading: isLoadingStore } =
    api.settings.update.useMutation({
      onSuccess: async () => {
        try {
          if (imageUrl !== "") {
            oldImageUrl !== "" &&
              (await edgestore.publicFiles.delete({ url: oldImageUrl }));
            await edgestore.publicFiles.confirmUpload({ url: imageUrl });
          }
          setProgress(0);
          toast.success("Details users updated successfully");
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

  function onDeleteImage() {
    if (isLoadingStore || isDeletingImage || oldImageUrl === "") {
      return;
    }

    deleteImage();
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (isLoadingStore) {
      return;
    }

    mutateStore({
      avatar: imageUrl,
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
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
                    {imageUrl || detail.publicMetadata?.avatar ? (
                      <Image
                        src={imageUrl || (detail.publicMetadata?.avatar ?? "")}
                        alt={detail.name ?? ""}
                        className="h-full w-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 80vw"
                      />
                    ) : detail.image ? (
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={detail.image} />
                        <AvatarFallback>{detail.name}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>{detail.name}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-y-2">
                    <div className="flex w-full gap-x-2">
                      <Input
                        className="hidden"
                        type="text"
                        {...field}
                        value={field.value ?? ""}
                      />
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            const res = await edgestore.publicFiles.upload({
                              file,
                              input: {
                                type: "profile",
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
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={onDeleteImage}
                        disabled={
                          isLoadingStore ||
                          isDeletingImage ||
                          oldImageUrl === ""
                        }
                        className={cn({
                          hidden: oldImageUrl === "",
                        })}
                      >
                        {isDeletingImage && (
                          <ReloadIcon className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        Delete
                      </Button>
                    </div>
                    <Progress value={progress} />
                    <p className="text-[0.8rem] text-muted-foreground">
                      Max file size 4MB
                    </p>
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
