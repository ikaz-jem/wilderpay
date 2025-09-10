"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BorderEffect from "../BorderEffect/BorderEffect";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const active = data.find(
          (a) =>
            new Date(a.startDate) <= now && now <= new Date(a.endDate)
        );

        if (active && localStorage.getItem(`dismissed-${active.id}`) !== "true") {
          setAnnouncement(active);
        }
      });


  }, []);

  if (!announcement) return null;


  function showMessage (announcement) {
    toast(announcement.message, {
    action: {
      label: 'Dismiss',
      onClick: () => {localStorage.setItem(`dismissed-${announcement.id}`, "true")
        
      }
    },duration:Infinity,
    position:'bottom-right'
  })

  } 

  
  return (
    <div className="w-full bg-card backdrop-blur rounded-xl text-black text-center py-2 flex justify-between px-4 animate-pulse">

      <BorderEffect/>
      <p className="text-sm">{announcement.message}</p>
      <button
      className="cursor-pointer hover:scale-125 transition-all "
        onClick={() => {
          localStorage.setItem(`dismissed-${announcement.id}`, "true");
          setAnnouncement(null);
        }}
      >
        ✖
      </button>
    </div>
  );
}
