import { MessageSquare, Mail } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Reveal className="mb-6">
        <h1 className="text-2xl font-extrabold text-text">Messages</h1>
        <p className="mt-1 text-sm text-text/50">
          {messages.length} message{messages.length === 1 ? "" : "s"} from the contact form
        </p>
      </Reveal>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <MessageSquare className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-text">{message.name}</p>
                  <a
                    href={`mailto:${message.email}`}
                    className="flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700"
                  >
                    <Mail className="h-3.5 w-3.5" /> {message.email}
                  </a>
                </div>
                <p className="text-xs text-text/40">
                  {message.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {message.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {message.subject && (
                <p className="mt-3 text-sm font-semibold text-text">{message.subject}</p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-text/70">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
