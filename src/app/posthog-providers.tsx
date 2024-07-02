"use client";

import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import React, { type FC } from "react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageleave: true,
  });
}

interface PostHogProviderProps {
  children: React.ReactNode;
}

const PostHogProvider: FC<PostHogProviderProps> = ({
  children,
}): React.JSX.Element => {
  return <PHProvider client={posthog}>{children}</PHProvider>;
};

export default PostHogProvider;
