"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { AlertCircleIcon, Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteNoteAction } from "@/app/actions/notes";
import useNote from "@/hooks/useNote";

type DeleteNoteButtonProps = {
  noteId: string;
};
function DeleteNoteButton({ noteId}: DeleteNoteButtonProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const noteIdParam = useSearchParams().get("noteId") || "";

  const {setNotesList} = useNote() || {};

  const handleDeleteNote = async () => {


    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);

      if (errorMessage) {
        console.error("Error deleting note:", errorMessage);
        toast.error("Failed to delete note");
        return;
      }
      toast.success("Note deleted successfully");
      setNotesList && setNotesList((prevNotes) => 
        prevNotes.filter(note => note.id !== noteId)
      );

      if (noteIdParam === noteId) {
        router.replace("/");
      }
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="absolute top-1/2 right-2 size-7 -translate-y-1/2 p-0 group-hover/items:opacity-100 [&_svg]:size-3" >
          <Trash2 className="hover:text-red-500 transition-colors duration-100" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertCircleIcon className="mx-auto mb-4 text-red-500" size={48} />
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your note will be lost forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteNote} className="bg-red-700 text-white hover:bg-red-800/90">{isPending ? <Loader2 className="animate-spin" /> : "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DeleteNoteButton;