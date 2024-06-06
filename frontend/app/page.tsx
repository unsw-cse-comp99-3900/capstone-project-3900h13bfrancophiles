'use client';

import React from 'react';

import { BACKEND_URL } from "@/config";

export default function Home() {
  const [numVisits, setNumVisits] = React.useState<number>();

  React.useEffect(() => {
    fetch(`${BACKEND_URL}/visit`, { method: "POST" })
      .then(res => res.text())
      .then(res => setNumVisits(parseInt(res)));
  }, []);

  if (!numVisits) return null;

  let suffix;
  if (numVisits % 100 == 1) {
    suffix = "th";
  } else if (numVisits % 10 == 1) {
    suffix = "st";
  } else if (numVisits % 10 == 2) {
    suffix = "nd";
  } else if (numVisits % 10 == 3) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  return (
    <main>
      You are the {numVisits}{suffix} visitor!
    </main>
  );
}
