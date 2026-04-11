"use client";

import { useEffect } from "react";
import { projects } from "@/data/projects";

function getScreenshotUrl(baseUrl: string, path: string) {
  const fullUrl = path === "/" ? baseUrl : `${baseUrl.replace(/\/$/, "")}${path}`;
  return `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=true&meta=false&embed=screenshot.url&type=png&viewport.width=1280&viewport.height=800&waitForTimeout=4000`;
}

function getThumbnailUrl(baseUrl: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(baseUrl)}&screenshot=true&meta=false&embed=screenshot.url&type=png&viewport.width=1280&viewport.height=800&waitForTimeout=3000`;
}

export function ScreenshotPreloader() {
  useEffect(() => {
    const urls: string[] = [];

    for (const project of projects) {
      if (!project.liveUrl) continue;

      // Thumbnail
      urls.push(getThumbnailUrl(project.liveUrl));

      // All page screenshots
      const pages = project.pages || [{ label: "Home", path: "/" }];
      for (const page of pages) {
        urls.push(getScreenshotUrl(project.liveUrl, page.path));
      }
    }

    // Prefetch all URLs by creating hidden Image objects
    // The browser will cache them for when the user scrolls down
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return null;
}
