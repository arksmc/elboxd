import { useEffect } from "react";

export default function Meta({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | TAMIS` : "TAMIS";
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = description || "Honest reviews of eateries in and around UPLB.";
  }, [title, description]);
  return null;
}