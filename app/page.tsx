import AskAIButton from "@/components/buttons/AskAIButton";
import { getUser } from "./auth/server";
import { prisma } from "@/lib/prisma";
import NewNoteButton from "@/components/buttons/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {

  const noteIdParam = (await searchParams).noteId;

  const user = await getUser();

  const noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <div className="flex flex-col items-center h-full gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteIdParam} startingNoteText={note?.text || null} />
    </div>
  );
}
